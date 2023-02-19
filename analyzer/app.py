from multiprocessing import Pool
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


def get_answers(image, bboxs):
    response = bbParser.get_text_for_bounding_boxes(image, bboxs)
    pprint(response)


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
    def post(self):
        json_data = request.get_json(force=True)
        worksheetId = json_data['worksheetId']
        boxes = json_data['boundingBoxes']
        client.mutation("sendMessage:createBoundingBoxes", {"worksheetID": worksheetId, "box": boxes})


class StartGrading(Resource):
    def post(self):
        def process(x):
            return get_img(x)

        json_data = request.get_json(force=True)

        worksheetId = json_data['worksheetId']
        submissions = client.query("listMessages:getAllSubmissionsForWorksheet", worksheetId)
        boundingboxes = client.query("listMessages:getBB", worksheetId)

        submittedFiles = map(lambda x: x['submission_file_url'], submissions)
        with Pool(4) as p:
            images = p.map(process, submittedFiles)

        for subId, aImage in enumerate(images):
            aImageAnswers = bbParser.get_text_for_bounding_boxes(aImage, boundingboxes)
            answerKeyAnswers = map(lambda x: x["text"], boundingboxes)

            feedbacks = []
            for i in range(len(aImageAnswers)):
                correct = aImageAnswers[i] == answerKeyAnswers[i]
                feedbacks.append({"bb_id": boundingboxes[i].id, "score": correct})

            client.mutation("sendMessage:markSubmission", submissions[subId].id, feedbacks)

        return submissions


api.add_resource(BoundingBoxService, '/bb')
api.add_resource(AddBoundingBoxesService, '/ab')
api.add_resource(StartGrading, '/grading')

if __name__ == '__main__':
    app.run(debug=True)
