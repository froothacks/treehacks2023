import { useState, useRef, useEffect } from "react";
import BoundingBox from "./BoundingBox";
import {
  Image as ChakraImage,
  Spinner,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";

export interface BoundingBoxType {
  height: string;
  width: string;
  x: number;
  y: number;
}

function WorksheetLabeller({
  boxesInput,
  ansURL,
  worksheetId,
  startLabelling,
}: {
  boxesInput: Array<BoundingBoxType>;
  ansURL: string;
  worksheetId: string;
  startLabelling: () => void;
}) {
  const [boxes, setBoxes] = useState<Array<BoundingBoxType>>(boxesInput);
  const [focus, setFocus] = useState<number | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const WIDTH = 1000;

  function submit(boxes: Array<BoundingBoxType>, worksheetId: string) {
    fetch("http://localhost:5001/ab", {
      method: "POST",
      body: JSON.stringify({
        boundingBoxes: boxes,
        worksheetId: worksheetId,
      }),
    });
  }

  useEffect(() => {
    getImageDimensions(ansURL);
  });

  const getImageDimensions = (src: string) => {
    var img = new (Image as any)();
    img.onload = function () {
      setRatio(WIDTH / img.naturalWidth);
    };
    img.src = src;
  };

  function addBox() {
    setBoxes(
      boxes.concat([{ height: "100px", width: "100px", x: 100, y: 100 }])
    );
  }

  function deleteBox() {
    setBoxes(boxes.filter((_, idx) => idx !== focus));
    setFocus(null);
  }

  function getParentPosition() {
    return ref?.current?.getBoundingClientRect();
  }

  function setBox(
    index: number,
    x: number,
    y: number,
    width: string,
    height: string
  ) {
    if (ratio) {
      setBoxes(
        boxes
          .slice(0, index)
          .concat([
            {
              height: (parseInt(height) / ratio).toString(),
              width: (parseInt(width) / ratio).toString(),
              x: x / ratio,
              y: y / ratio,
            },
          ])
          .concat(boxes.slice(index + 1))
      );
    }
  }

  function checkIntersecting(index: number) {
    for (let i = 0; i < boxes.length; i++) {
      if (i !== index) {
        if (checkIntersectingHelper(i, index)) return true;
      }
    }
    return false;
  }

  function checkIntersectingHelper(i: number, j: number) {
    return (
      boxes[i].x + parseInt(boxes[i].width) > boxes[j].x &&
      boxes[i].y + parseInt(boxes[i].height) > boxes[j].y &&
      boxes[j].x + parseInt(boxes[j].width) > boxes[i].x &&
      boxes[j].y + parseInt(boxes[j].height) > boxes[i].y
    );
  }

  function deleteAll() {
    setBoxes([]);
    setFocus(null);
  }

  function deleteIfDeleteMode(i: number) {
    if (deleteMode) {
      setBoxes(boxes.filter((_, idx) => idx !== i));
      setFocus(null);
    }
  }

  return (
    <div>
      {ratio ? (
        <div>
          <div
            ref={ref}
            className="container"
            style={{ border: "1px black solid", width: "1000px" }}
          >
            <img src={ansURL} width="1000px" />
            {boxes.map((box, i) => {
              return (
                <BoundingBox
                  key={i}
                  width={`${parseInt(box.width) * ratio}`}
                  height={`${parseInt(box.height) * ratio}`}
                  x={box.x * ratio}
                  y={box.y * ratio}
                  i={i}
                  setBox={setBox}
                  setFocus={setFocus}
                  focused={focus === i}
                  intersecting={checkIntersecting(i)}
                  getParentPosition={getParentPosition}
                  deleteIfDeleteMode={deleteIfDeleteMode}
                  ans={""}
                  correct
                  readOnly = {false}
                />
              );
            })}
          </div>
          <ButtonGroup gap="4" m="4">
            <Button onClick={addBox}>Add Box</Button>
            <Button onClick={deleteBox}>Delete</Button>
            <Button onClick={deleteAll}>Delete All</Button>
            <Button
              onClick={() => setDeleteMode(!deleteMode)}
              colorScheme={deleteMode ? "red" : "gray"}
            >
              Delete Mode
            </Button>
            <Button onClick={() => submit(boxes, worksheetId)}>Accept</Button>
          </ButtonGroup>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default WorksheetLabeller;
