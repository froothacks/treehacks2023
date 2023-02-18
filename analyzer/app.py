import threading
from multiprocessing import Process
from pprint import pprint

import cv2
from convex import ConvexClient
from flask import Flask
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
    def get(self):
        blank_worksheet = cv2.imread('./test/W_NULL.jpg')
        answer_key = cv2.imread('./test/W_ANS.jpg')
        boxes = bbParser.get_answer_boxes(blank_worksheet, answer_key)
        return boxes


api.add_resource(BoundingBoxService, '/answerkey')

if __name__ == '__main__':
    app.run(debug=True)
