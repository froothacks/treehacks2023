import { useState, useRef } from "react"
import BoundingBox from "./BoundingBox"

interface BoundingBoxType {
    height: string,
    width: string,
    x: number,
    y: number,
}

function WorksheetLabeller() {
  const [boxes, setBoxes] = useState<Array<BoundingBoxType>>([])
  const [focus, setFocus] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  function addBox(){
    setBoxes(
      boxes.concat([{height: "100px", width: "100px", x: 100, y: 100}])
    )
  }

  function deleteBox(){
    setBoxes(
      boxes.filter((_, idx) => idx !== focus)
    )
    setFocus(null)
  }

  function getParentPosition(){
    return ref?.current?.getBoundingClientRect()
  }

  function setBox(index: number, x: number, y: number, width: string, height: string){
    setBoxes(
      boxes.slice(0, index).concat([{height, width, x, y}]).concat(boxes.slice(index + 1))
    )
  }

  function checkIntersecting(index: number){
    for(let i = 0; i < boxes.length; i++){
      if (i !== index){
        if(checkIntersectingHelper(i, index)) return true
      }
    }
    return false
  }

  function checkIntersectingHelper(i: number, j: number){
    return (boxes[i].x + parseInt(boxes[i].width) > boxes[j].x) && (boxes[i].y + parseInt(boxes[i].height) > boxes[j].y)
    && (boxes[j].x + parseInt(boxes[j].width) > boxes[i].x) && (boxes[j].y + parseInt(boxes[j].height) > boxes[i].y)
  }

  return (
    <div style={{padding: "20px", height: "600px", width: "600px"}}>
        <div ref={ref} className='container' style={{height: "100%", border: "1px black solid"}}>
            {boxes.map((box, i) =>
                <BoundingBox 
                  key={i} 
                  width={box.width} 
                  height={box.height} 
                  x={box.x} 
                  y={box.y} 
                  i={i} 
                  setBox={setBox} 
                  setFocus={setFocus} 
                  focused={focus === i} 
                  intersecting={checkIntersecting(i)}
                  getParentPosition={getParentPosition}
                />
            )}
        </div>
        <button onClick={addBox}>Add Box</button>
        <button onClick={deleteBox}>Delete</button>
    </div>
    );
}

export default WorksheetLabeller