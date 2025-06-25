import  { useState } from "react";
import Icon from "../Icon.component";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";
import { useRef } from "react";
/**
 * Move block component for sprite motion.
 * @param {Object} props
 * @param {string} props.dir - Direction to move ('r', 'l', 'u', 'd', 'm')
 * @param {number} props.units - Number of steps to move
 * @param {string} props.color - Color for the block UI
 * @param {number} [props.index] - Index in combination (if used in combo)
 * @returns {JSX.Element}
 */
const Move = props => {
    const [moveBy, setMoveBy] = useState(props.units); // Current value for steps to move
    const updateMoveBy = by => { setMoveBy(by) }
    const { spriteMotionTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);
    const moveTimerRef = useRef(null); // Timer for drag/hold detection
    return(
        <button className={`bg-${props.color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 4} cursor-pointer rounded-md font-medium items-center functionButton`}
              onClick={() => {
                // Trigger sprite move if not in combination edit mode
                if(!isCombo)
                    spriteMotionTrigger({
                        what: 'move',
                        options: { dir: props.dir, units: moveBy }
                    })
            }}
            onMouseDown={event => {
                // Start drag after 300ms hold
                moveTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)
                    
                    if(isCombo)
                        updateComboPin(props.index, false)
                    else
                        pickBlock([{
                            what: 'move',
                            options: { dir: props.dir, units: moveBy }
                        }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(moveTimerRef.current)
                if(isCombo)
                    updateComboPin(props.index, false, true)
            }}>
            
            <span>move</span>
            {props.dir != 'm' &&
                <Icon name={
                    props.dir == 'r' ? 'arrow-right' :
                    (props.dir == 'l' ? 'arrow-left' :
                    (props.dir == 'u' ? 'arrow-up' : 'arrow-down'))
                } className="mx-2" />}
            <input type="number" className="text-black text-center mx-2 functionInput"
                value={moveBy} onChange={e => updateMoveBy(e.target.value)}
                onClick={e => e.stopPropagation()}
                min={0}/>
            <span>steps</span>
        </button>
    );
}
export default Move;
