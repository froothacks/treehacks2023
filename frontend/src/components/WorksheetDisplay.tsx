// @ts-nocheck

import { Spinner } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import BoundingBox from "./BoundingBox";
import { BoundingBoxType } from "./WorksheetLabeller";
import {useQuery} from "../convex/_generated/react";
import {Id} from "../convex/_generated/dataModel";



function WorksheetDisplay({ submission}:
    {  submission: any }) {
    const boxes = useQuery(
        "listMessages:getBB",
         submission.worksheet_id
    )
    console.log(boxes)
    const [ratio, setRatio] = useState<number | null>(null)
    const ref = useRef<HTMLDivElement>(null)
    const WIDTH = 1000
    
    useEffect(() => {
        getImageDimensions(submission.submission_file_url)
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
        {ratio && boxes ?
            <div ref={ref} className='container' style={{border: "1px black solid", width:"1000px"}}>
                <img src={submission.submission_file_url} width="1000px"/>
                {boxes.map((box, i) => {
                    const feedback = submission.feedbacks.filter(feedback => feedback.bb_id === box._id.id)[0]
                    console.log(feedback);
                    return <BoundingBox
                        key={i}
                        width={`${parseInt(box.width) * ratio}`}
                        height={`${parseInt(box.height) * ratio}`}
                        i={i}
                        x={Number(box.x) * ratio}
                        y={Number(box.y) * ratio}
                        setBox={() => {}}
                        setFocus={() => {}}
                        intersecting={false}
                        getParentPosition={getParentPosition}
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