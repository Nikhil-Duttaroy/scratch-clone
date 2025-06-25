import { useState } from "react";
import Icon from "../Icon.component";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";
import { useRef } from "react";
const Rotate = props => {
    const [turnBy, setTurnBy] = useState(props.deg);
    const updateMoveBy = by => { setTurnBy(by) }
    const { spriteMotionTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);

    const rotateTimerRef = useRef(null);
    return(
        <button className={`bg-${props.color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 4} cursor-pointer rounded-md font-medium items-center functionButton`}
            onClick={() => {
                if(!isCombo)
                    spriteMotionTrigger({
                        what: 'turn',
                        options: { dir: props.dir, deg: turnBy, reset: props.reset }
                    })
            }}
            onMouseDown={event => {
                rotateTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)

                    if(isCombo)
                        updateComboPin(props.index, false)
                    else
                        pickBlock([{
                            what: 'turn',
                            options: { dir: props.dir, deg: turnBy, reset: props.reset }
                        }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(rotateTimerRef.current)
                if(isCombo)
                    updateComboPin(props.index, false, true)
            }}>
            {props.reset ?
            <>
                <span className="whitespace-nowrap">point in direction</span>
                <input type="number" className="text-black text-center mx-2 functionInput"
                    defaultValue={0} readOnly/>
            </> :
            <>
                <span>turn</span>
                <Icon name={props.dir == 'r' ? 'redo' : 'undo'} className="mx-2" />
                <input type="number" className="text-black text-center mx-2 functionInput"
                    value={turnBy} onChange={event => updateMoveBy(event.target.value)}
                    onClick={event => event.stopPropagation()} 
                    min={0}/>
                <span>degrees</span>
            </>}
        </button>
    );
}
export default Rotate;