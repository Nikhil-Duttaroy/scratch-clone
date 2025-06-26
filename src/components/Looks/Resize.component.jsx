import  { useRef, useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";

/**
 * Resize block component for sprite looks (size changes).
 * @param {Object} props
 * @param {boolean} props.definite - If true, set size to a value; otherwise, change by value
 * @param {number} props.to - Target size or amount to change
 * @param {string} props.color - Color for the block UI
 * @param {number} [props.index] - Index in combination (if used in combo)
 * @returns {JSX.Element}
 */
const Resize = props => {
    const [sizeUp, setSizeUp] = useState(props.to); // Current value for size
    const { spriteLooksTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);
    const resizeBy = by => { setSizeUp(by) } // Update the size value
    const resizeTimerRef = useRef(null); // Timer for drag/hold detection

    return(
        <button className={`bg-${props.color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium items-center whitespace-nowrap `}
            onClick={() => {
                // Trigger resize if not in combination edit mode
                if(!isCombo)
                    spriteLooksTrigger({
                        what: 'resize',
                        definite: props.definite,
                        to: sizeUp
                    })
            }}
            onMouseDown={event => {
                // Start drag after 300ms hold
                resizeTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)
                    if(isCombo)
                        updateComboPin(props.index, false)
                    else
                        pickBlock([{
                            what: 'resize',
                            definite: props.definite,
                            to: sizeUp
                        }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(resizeTimerRef.current)
                if(isCombo)
                    updateComboPin(props.index, false, true)
            }}>
            <span>{props.definite ? 'set size to' : 'change size by'}</span>
            <input type="number" className="text-black text-center mx-2 functionInput"
                value={sizeUp} onChange={e => resizeBy(Number(event.target.value))}
                onClick={e => e.stopPropagation()}
                min={0}/>
            {props.definite && <span>{'%'}</span>}
        </button>
    );
}

export default Resize;