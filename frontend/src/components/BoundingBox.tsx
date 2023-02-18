import { Rnd } from 'react-rnd';

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
}

function BoundingBox({width, height, x, y, i, setBox, setFocus, focused, intersecting, getParentPosition} : BoundingBoxType) {
    return (
        <Rnd
            className='draggable'
            bounds='parent'
            size={{ width: width, height: height }}
            style={{
                border: intersecting ? "1px solid red" : "1px #282c34 solid",
                boxShadow: focused ? "0 0 10px #9ecaed" : undefined,
            }}
            position={{ x: x + (getParentPosition()?.left || 0), y: y + (getParentPosition()?.top || 0) }}
            onDrag={(_e, d) => { 
                setBox(i, d.x - (getParentPosition()?.left || 0) * 3, d.y - (getParentPosition()?.top || 0) * 3, width, height)
            }}
            onResizeStop={(_e, _direction, ref, _delta, position) => {
                setBox(i, position.x - (getParentPosition()?.left || 0), position.y - (getParentPosition()?.top || 0), ref.style.width, ref.style.height)
            }}
            onMouseDown={() => setFocus(i)}
        />
    );
}

export default BoundingBox;