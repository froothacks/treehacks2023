import { Rnd } from 'react-rnd';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'

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

function BoundingBox({width, height, x, y, i, setBox, setFocus, focused, intersecting, getParentPosition, deleteIfDeleteMode, ans, correct, readOnly} : BoundingBoxType) {
    return (
        <>
            <Rnd
                bounds='parent'
                size={{ width: width, height: height }}
                style={{
                    border: intersecting ? "1px solid red" : "1px #282c34 solid",
                    boxShadow: focused ? "0 0 10px #9ecaed" : undefined,
                    backgroundColor: "rgba(255,255,0, 0.2)",
                }}
                position={{ x: x, y: y }}
                onDrag={(_e, d) => {
                    setBox(i, d.x - (getParentPosition()?.left || 0)*2, d.y - (getParentPosition()?.top || 0)*2, width, height)
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
            {readOnly && 
                (correct ? <CheckIcon color="green.500"/> : <CloseIcon color="red.500" />)
            }
        </>
    );
}

export default BoundingBox;