import time

import cv2
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

from features import FeatureExtraction, feature_matching


def show(boxes, image):
    for i in boxes:
        x, y, h, w = i["x"], i["y"], i["height"], i["width"]
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)
    cv2.imshow("Test", Parser.resize_with_aspect_ratio(image, height=900))
    cv2.waitKey(0)


class Parser:
    def __init__(self):
        self.threshold = 70
        s = time.time()
        self.processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
        self.model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten')
        print("booting took", time.time() - s)

    @staticmethod
    def resize_with_aspect_ratio(image, width=None, height=None, inter=cv2.INTER_AREA):
        (h, w) = image.shape[:2]

        if width is None and height is None:
            return image
        if width is None:
            r = height / float(h)
            dim = (int(w * r), height)
        else:
            r = width / float(w)
            dim = (width, int(h * r))

        return cv2.resize(image, dim, interpolation=inter)

    def get_answer_boxes(self, empty_ws, fill_ws):
        # Outputs
        boxes = []

        # Convert the images to grayscale
        gray2 = self.nm(empty_ws, fill_ws)
        gray1 = cv2.cvtColor(fill_ws, cv2.COLOR_BGR2GRAY)
        gray2 = cv2.cvtColor(gray2, cv2.COLOR_BGR2GRAY)

        # Compute the absolute difference between the images
        diff = cv2.absdiff(gray1, gray2)

        # Apply Median Blur to the difference image
        ksize = (5, 5)
        sigmaX = 0
        correct_answers = cv2.GaussianBlur(diff, ksize, sigmaX)

        # Apply a threshold to the difference image
        _, correct_answers = cv2.threshold(correct_answers, self.threshold, 255, cv2.THRESH_BINARY)

        cnts = cv2.findContours(correct_answers, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        contours = cnts[0] if len(cnts) == 2 else cnts[1]
        # Draw the contours on the original image
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            if w > 10 and h > 10:
                print(w, h, w * h)
                boxes.append({
                    "width": w + 30,
                    "height": h + 30,
                    "x": x - 20,
                    "y": y - 20,
                })
        return boxes

    def nm(self, im0_gray, im1_gray):
        features0 = FeatureExtraction(im0_gray)
        features1 = FeatureExtraction(im1_gray)

        feature_matching(features0, features1)

        H, _ = cv2.findHomography(features0.matched_pts,
                                  features1.matched_pts, cv2.RANSAC, 10, confidence=0.5)

        h, w, c = im0_gray.shape
        warped = cv2.warpPerspective(im0_gray, H, (w, h), borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
        return warped

    def get_text_for_bounding_boxes(self, image, bounding_boxes):
        images = []
        output = []
        for box in bounding_boxes:
            w = int(float(box["width"]))
            h = int(float(box["height"]))
            x = int(float(box["x"]))
            y = int(float(box["y"]))

            sliced = image[y: y + h, x: x + w]
            images.append(sliced)

        generated_text = self.__extract_text_from_images(images)
        for g in generated_text:
            output.append(g)

        return output

    def __extract_text_from_images(self, images):
        start = time.time()
        pixel_values = self.processor(images=images, return_tensors="pt").pixel_values
        generated_ids = self.model.generate(pixel_values, max_length=2)
        generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=True)
        print("took:", time.time() - start)
        return generated_text

# img1 = cv2.imread('./test/W_SUB.jpg')
# b = computeBoundingBox()
# for i in b:
#     x, y, h, w = i["x"], i["y"], i["height"], i["width"]
#     cv2.rectangle(img1, (x, y), (x + w, y + h), (0, 0, 255), 2)
#     cv2.putText(img1, i["text"], (x - 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
#
# cv2.imshow("A", resize_with_aspect_ratio(img1, height=1000))
# cv2.waitKey(0)
# cv2.destroyAllWindows()
