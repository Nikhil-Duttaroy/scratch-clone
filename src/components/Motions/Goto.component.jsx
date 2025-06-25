import { useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";
import { useRef } from "react";

const Goto = props => {
    const [go, setGo] = useState({
        x: props.x,
        y: props.y
    });

    const goto = (where, by) => { setGo({ ...go, [where]: by }) }
const { spriteMotionTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);
    const gotoTimerRef = useRef(null);
    return(
        <button className={`bg-${props.color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium items-center whitespace-nowrap functionButton`}
           onClick={() => {
                if(!isCombo)
                    spriteMotionTrigger({
                        what: 'goto',
                        options: { x: go.x, y: go.y, random: props.random }
                    })
            }}
            onMouseDown={event => {
                gotoTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)

                    if(isCombo)
                        updateComboPin(props.index, false)
                    else
                        pickBlock([{
                            what: 'goto',
                            options: { x: go.x, y: go.y, random: props.random }
                        }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(gotoTimerRef.current)
                if(isCombo)
                    updateComboPin(props.index, false, true)
            }}>
            <span>go to</span>
            {props.random ? <span className="ml-1 bg-blue-600 px-2 rounded-md">random position</span> :
            <>
                <span className="ml-1">x</span>
                <input type="number" className="text-black text-center mx-2 functionInput"
                    value={go.x} onChange={event => goto('x', event.target.value)}
                    onClick={e =>e.stopPropagation()}
                    />
                <span>y</span>
                <input type="number" className="text-black text-center mx-2 functionInput"
                    value={go.y} onChange={event => goto('y', event.target.value)}
                    onClick={e =>e.stopPropagation()}
                    
                    />
            </>}
        </button>
    );
}

export default Goto;