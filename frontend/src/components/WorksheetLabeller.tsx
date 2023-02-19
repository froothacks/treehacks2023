import {useState, useRef, useEffect} from "react"
import BoundingBox from "./BoundingBox"
import {Image as ChakraImage, Spinner} from '@chakra-ui/react'

export interface BoundingBoxType {
    height: string,
    width: string,
    x: number,
    y: number,
}

function submit(boxes: Array<BoundingBoxType>, worksheetId: string) {
    fetch("http://localhost:5000/ab", {
        method: "POST", body: JSON.stringify({
            boundingBoxes: boxes,
            worksheetId: worksheetId
        })
    })
}

function WorksheetLabeller({boxesInput, ansURL, worksheetId}: { boxesInput: Array<BoundingBoxType>, ansURL: string, worksheetId: string }) {
    const [boxes, setBoxes] = useState<Array<BoundingBoxType>>(boxesInput)
    const [focus, setFocus] = useState<number | null>(null)
    const [ratio, setRatio] = useState<number | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const WIDTH = 1000


    useEffect(() => {
        getImageDimensions(ansURL)
    })

    const getImageDimensions = (src: string) => {
        var img = new (Image as any)();
        img.onload = function () {
            setRatio(WIDTH / img.naturalWidth)
        }
        img.src = src
    }

    function addBox() {
        setBoxes(
            boxes.concat([{height: "100px", width: "100px", x: 100, y: 100}])
        )
    }

    function deleteBox() {
        setBoxes(
            boxes.filter((_, idx) => idx !== focus)
        )
        setFocus(null)
    }

    function getParentPosition() {
        return ref?.current?.getBoundingClientRect()
    }

    function setBox(index: number, x: number, y: number, width: string, height: string) {
        if (ratio) {
            setBoxes(
                boxes.slice(0, index)
                    .concat([{
                        height: (parseInt(height) / ratio).toString(),
                        width: (parseInt(width) / ratio).toString(),
                        x: x / ratio,
                        y: y / ratio
                    }])
                    .concat(boxes.slice(index + 1))
            )
        }
    }

    function checkIntersecting(index: number) {
        for (let i = 0; i < boxes.length; i++) {
            if (i !== index) {
                if (checkIntersectingHelper(i, index)) return true
            }
        }
        return false
    }

    function checkIntersectingHelper(i: number, j: number) {
        return (boxes[i].x + parseInt(boxes[i].width) > boxes[j].x) && (boxes[i].y + parseInt(boxes[i].height) > boxes[j].y)
            && (boxes[j].x + parseInt(boxes[j].width) > boxes[i].x) && (boxes[j].y + parseInt(boxes[j].height) > boxes[i].y)
    }

    return <div>
        {ratio ? <div>
            <div ref={ref} className='container' style={{border: "1px black solid"}}>
                <img src={ansURL} width="1000px"/>
                {boxes.map((box, i) => {
                    console.log(box.width)
                    console.log(`${parseInt(box.width) * ratio}`)
                    return <BoundingBox
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
                    />
                })}
            </div>
            <button onClick={addBox}>Add Box</button>
            <button onClick={deleteBox}>Delete</button>
            <button onClick={() => submit(boxes, worksheetId)}>Accept</button>
        </div> : <Spinner/>}
    </div>
}

export default WorksheetLabeller