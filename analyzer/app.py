from flask import Flask
from flask_restful import Resource, Api
from convex import ConvexClient
from config import url as convex_url
from treehacks2023.analyzer.boundingBoxes import computeBoundingBox

app = Flask(__name__)
api = Api(app)
client = ConvexClient(convex_url)
client.debug = True


class BoundingBoxService(Resource):
    def get(self):
        return computeBoundingBox()



api.add_resource(BoundingBoxService, '/')

if __name__ == '__main__':
    app.run(debug=True)
