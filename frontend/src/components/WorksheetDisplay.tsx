// @ts-nocheck

import { Spinner } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import BoundingBox from "./BoundingBox";
import { BoundingBoxType } from "./WorksheetLabeller";



function WorksheetDisplay({boxes, submission}: 
    { boxes: Array<BoundingBoxType>, submission: any }) {
    const [ratio, setRatio] = useState<number | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const WIDTH = 1000
    
    useEffect(() => {
        getImageDimensions(submission.url)
    })

    const getImageDimensions = (src: string) => {
        var img = new (Image as any)();
        img.onload = function () {
            setRatio(WIDTH / img.naturalWidth)
        }
        img.src = src
    }

    function getParentPosition() {
        return ref?.current?.getBoundingClientRect()
    }


    return <div>
        {ratio ? 
            <div ref={ref} className='container' style={{border: "1px black solid", width:"1000px"}}>
                <img src={submission.url} width="1000px"/>
                {boxes.map((box, i) => {
                    const feedback = submission.feedbacks.filter(feedback => feedback.bb_id === box.id)
                    return <BoundingBox
                        key={i}
                        width={`${parseInt(box.width) * ratio}`}
                        height={`${parseInt(box.height) * ratio}`}
                        i={i}
                        x={box.x * ratio}
                        y={box.y * ratio}
                        setBox={() => {}}
                        setFocus={() => {}}
                        intersecting={false}
                        getParentPosition={() => {}}
                        deleteIfDeleteMode={() => {}}
                        ans={box.text_answer}
                        correct={feedback.score > 0}
                        readOnly
                    />
                })}
            </div> : <Spinner/>}
    </div>
}

export default WorksheetDisplay