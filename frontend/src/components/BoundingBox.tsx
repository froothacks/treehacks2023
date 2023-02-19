import {Rnd} from 'react-rnd';
import {Text} from "@chakra-ui/react"
import {CheckIcon, CloseIcon} from '@chakra-ui/icons'
import React from "react";

type BoundingBoxType = {
    width: string,
    height: string,
    x: number,
    y: number,
    i: number,
    setBox: Function,
    setFocus: Function,
    focused: boolean,
    intersecting: boolean,
    getParentPosition: Function,
    deleteIfDeleteMode: Function,
    ans: string,
    correct: boolean,
    readOnly: boolean,
}

function BoundingBox({
                         width,
                         height,
                         x,
                         y,
                         i,
                         setBox,
                         setFocus,
                         focused,
                         intersecting,
                         getParentPosition,
                         deleteIfDeleteMode,
                         ans,
                         correct,
                         readOnly
                     }: BoundingBoxType) {
    console.log(getParentPosition()?.top, getParentPosition()?.left)
    return (
        <>
            <Rnd
                bounds='parent'
                size={{width: width, height: height}}
                style={{
                    border: intersecting ? "1px solid red" : "1px #282c34 solid",
                    boxShadow: focused ? "0 0 10px #9ecaed" : undefined,
                    backgroundColor: "rgba(255,255,0, 0.2)",
                }}
                position={{x: x, y: y}}
                onDrag={(_e, d) => {
                    setBox(i, d.x - (getParentPosition()?.left || 0) * 2, d.y - (getParentPosition()?.top || 0) * 2, width, height)
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                    if (!readOnly) {
                        setBox(i, position.x, position.y, ref.style.width, ref.style.height)
                    }
                }}
                onMouseDown={() => {
                    deleteIfDeleteMode(i)
                    setFocus(i)
                }
                }
                disableDragging={readOnly}
            />
            <div style={{position: "absolute", top: y + 30, left: x - 30}}>
                {readOnly &&
                    (correct ? <CheckIcon boxSize={8} color="green.500"/> : <span>
                    <Text color="red.500" fontSize="2xl">{ans}</Text>
                    <CloseIcon boxSize={6} color="red.500"/>
                    </span>)
                }
            </div>
        </>
    );
}

export default BoundingBox;