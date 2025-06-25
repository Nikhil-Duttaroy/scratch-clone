import  { useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { CombinationContext } from "../../Context/Combination.context";
import { useRef } from "react";
import { useContext } from "react";

const Wait = props => {
    const [wait, setWait] = useState(props.for);

    const changeWait = wait => { setWait(wait) }
  const { pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);

    const waitTimerRef = useRef(null);
    return(
        <button className={`bg-${props.color} w-min text-white
           px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium
            flex flex-row items-center whitespace-nowrap functionButton`}
            onMouseDown={event => {
                waitTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)
                    
                    if(isCombo)
                        updateComboPin(props.index, false)
                    else
                        pickBlock([{
                            what: 'wait',
                            for: wait
                        }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(waitTimerRef.current)
                if(isCombo)
                    updateComboPin(props.index, false, true)
            }}>
            <span>wait</span>
            <input type="number" className="text-black text-center mx-2 functionInput"
                value={wait} onChange={event => changeWait(event.target.value)}
                onClick={e => e.stopPropagation()}
                min={0}/>
            <span>seconds</span>
        </button>
    );
}

export default Wait;