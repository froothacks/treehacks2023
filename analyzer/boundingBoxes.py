import cv2


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


def computeBoundingBox():
    boxes = []
    img1 = cv2.imread('./test/W_NULL.jpg')
    img2 = cv2.imread('./test/W_ANS.jpg')

    # Convert the images to grayscale
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)

    # Compute the absolute difference between the images
    diff = cv2.absdiff(gray1, gray2)

    # Apply a threshold to the difference image
    threshold = 50
    _, correct_answers = cv2.threshold(diff, threshold, 255, cv2.THRESH_BINARY)

    d = 9
    sigmaColor = 75
    sigmaSpace = 75
    correct_answers = cv2.bilateralFilter(correct_answers, d, sigmaColor, sigmaSpace)

    contours, _ = cv2.findContours(correct_answers, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw the contours on the original image
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w > 5 and h > 10:
            boxes.append({
                "width": w,
                "height": h,
                "x": x,
                "y": y
            })

    return boxes


if __name__ == "main":
    img1 = cv2.imread('./test/W_ANS.jpg')
    b = computeBoundingBox()
    for i in b:
        x, y, h, w = i["x"], i["y"], i["height"], i["width"]
        cv2.rectangle(img1, (x, y), (x + w, y + h), (0, 0, 255), 2)

    cv2.imshow("A", resize_with_aspect_ratio(img1, height=1000))
    # Display the images
    # cv2.imshow('Image 1', resize_with_aspect_ratio(img1, height=1000))
    # cv2.imshow('Image 2', img2)
    # cv2.imshow('Difference', diff)
    # cv2.imshow('Threshold', resize_with_aspect_ratio(correct_answers, height=1000))
    cv2.waitKey(10000)
    cv2.destroyAllWindows()
