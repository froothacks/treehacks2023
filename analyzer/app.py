from flask import Flask
from flask_restful import Resource, Api
from convex import ConvexClient
from config import url as convex_url
# from boundingBoxes import computeBoundingBox

# app = Flask(__name__)
# api = Api(app)



# class BoundingBoxService(Resource):
#     def get(self):
#         return computeBoundingBox()



# api.add_resource(BoundingBoxService, '/')

# if __name__ == '__main__':
#     app.run(debug=True)


client = ConvexClient(convex_url)
client.debug = True

messages = client.query("listMessages")
print("PYTHON RPINT")
print(messages)
for message in messages:
    if "format" in message and "url" in message and message["format"] == "image" and message["url"] != None:
        print("URL", message["url"])
        print(message["url"] == None)
# from pprint import pprint
# pprint(messages)