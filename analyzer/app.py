from multiprocessing import Pool, Process
from pprint import pprint

import cv2
import numpy as np
import requests
from convex import ConvexClient
from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api

from config import url as convex_url
from parser import Parser, show

app = Flask(__name__)
CORS(app)
api = Api(app)
client = ConvexClient(convex_url)
bbParser = Parser()
client.debug = True


def get_answers(image, worksheetId, bboxs):
    response = bbParser.get_text_for_bounding_boxes(image, bboxs)
    for i in range(len(bboxs)):
        bboxs[i]["text_answer"] = response[i]
        client.mutation("sendMessage:createBoundingBoxes", {"worksheetID": worksheetId, "box": bboxs[i]})


def get_img(url):
    response = requests.get(url, stream=True).raw
    image = np.asarray(bytearray(response.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image


class BoundingBoxService(Resource):

    def post(self):
        json_data = request.get_json(force=True)
        ans_url = json_data['ans_url']
        blank_url = json_data['blank_url']
        blank_worksheet = get_img(blank_url)
        answer_key = get_img(ans_url)
        boxes = bbParser.get_answer_boxes(blank_worksheet, answer_key)
        return boxes


class AddBoundingBoxesService(Resource):

    @staticmethod
    def run(worksheetId, boxes):
        worksheet = client.query("listMessages:getWorksheet", worksheetId)
        get_answers(get_img(worksheet["answer_url"]), worksheetId, boxes)
        client.mutation("sendMessage:setTotalScoreWS", worksheetId, len(boxes))

    def post(self):
        json_data = request.get_json(force=True)
        worksheetId = json_data['worksheetId']
        boxes = json_data['boundingBoxes']
        p = Process(target=AddBoundingBoxesService.run, args=(worksheetId, boxes))
        p.start()


class StartGrading(Resource):
    def post(self):

        json_data = request.get_json(force=True)

        worksheetId = json_data['worksheetId']
        submissions = client.query("listMessages:getAllSubmissionsForWorksheet", worksheetId)
        boundingboxes = client.query("listMessages:getBB", worksheetId)
        print(submissions)
        print(boundingboxes)

        submittedFiles = map(lambda x: x['submission_file_url'], submissions)
        for subId, subFile in enumerate(submittedFiles):
            aImage = get_img(subFile)
            aImageAnswers = bbParser.get_text_for_bounding_boxes(aImage, boundingboxes)
            answerKeyAnswers = [x["text_answer"] for x in boundingboxes]

            print(aImageAnswers)

            feedbacks = []
            totalScore = 0
            for i in range(len(aImageAnswers)):
                score = int(aImageAnswers[i] == answerKeyAnswers[i])
                feedbacks.append({"bb_id": boundingboxes[i]['_id'].id, "score": score})
                totalScore += score

            client.mutation("sendMessage:markSubmission", submissions[subId]['_id'].id, feedbacks, totalScore)


api.add_resource(BoundingBoxService, '/bb')
api.add_resource(AddBoundingBoxesService, '/ab')
api.add_resource(StartGrading, '/start_grading')

if __name__ == '__main__':
    app.run(debug=True)
