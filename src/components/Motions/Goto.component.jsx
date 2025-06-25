import { useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";
import { useRef } from "react";

/**
 * Goto block component for sprite motion.
 * @param {Object} props
 * @param {number} props.x - X coordinate to go to
 * @param {number} props.y - Y coordinate to go to
 * @param {boolean} [props.random] - If true, go to random position
 * @param {string} props.color - Color for the block UI
 * @param {number} [props.index] - Index in combination (if used in combo)
 * @returns {JSX.Element}
 */
const Goto = props => {
    const [go, setGo] = useState({
        x: props.x,
        y: props.y
    });

    // Update the go state for x or y
    const goto = (where, by) => { setGo({ ...go, [where]: by }) }
    const { spriteMotionTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);
    const gotoTimerRef = useRef(null); // Timer for drag/hold detection
    return(
        <button className={`bg-${props.color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium items-center whitespace-nowrap functionButton`}
           onClick={() => {
                // Trigger sprite goto if not in combination edit mode
                if(!isCombo)
                    spriteMotionTrigger({
                        what: 'goto',
                        options: { x: go.x, y: go.y, random: props.random }
                    })
            }}
            onMouseDown={event => {
                // Start drag after 300ms hold
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