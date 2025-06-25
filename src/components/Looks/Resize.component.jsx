import  { useRef, useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";

const Resize = props => {
    const [sizeUp, setSizeUp] = useState(props.to);
        const { spriteLooksTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
            const { isCombo, updateComboPin } = useContext(CombinationContext);
    const resizeBy = by => { setSizeUp(by) }
    const resizeTimerRef = useRef(null);

    return(
        <button className={`bg-${props.color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium items-center whitespace-nowrap functionButton`}
            onClick={() => {
                if(!isCombo)
                    spriteLooksTrigger({
                        what: 'resize',
                        definite: props.definite,
                        to: sizeUp
                    })
            }}
            onMouseDown={event => {
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
                value={sizeUp} onChange={e => resizeBy(e.target.value)}
                onClick={e => e.stopPropagation()}
                min={0}/>
            {props.definite && <span>{'%'}</span>}
        </button>
    );
}

export default Resize;