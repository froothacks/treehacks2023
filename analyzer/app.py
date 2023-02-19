from pprint import pprint

import cv2
import numpy as np
import requests
from convex import ConvexClient
from flask import Flask, request
from flask_restful import Resource, Api

from config import url as convex_url
from parser import Parser

app = Flask(__name__)
api = Api(app)
client = ConvexClient(convex_url)
bbParser = Parser()
client.debug = True


def get_answers(image, bboxs):
    response = bbParser.get_text_for_bounding_boxes(image, bboxs)
    pprint(response)


class BoundingBoxService(Resource):

    def get_img(self, url):
        response = requests.get(url, stream=True).raw
        image = np.asarray(bytearray(response.read()), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        return image

    def post(self):
        json_data = request.get_json(force=True)
        ans_url = json_data['ans_url']
        blank_url = json_data['blank_url']
        blank_worksheet = self.get_img(blank_url)
        answer_key = self.get_img(ans_url)
        boxes = bbParser.get_answer_boxes(blank_worksheet, answer_key)

        return boxes


api.add_resource(BoundingBoxService, '/bb')

if __name__ == '__main__':
    app.run(debug=True)
