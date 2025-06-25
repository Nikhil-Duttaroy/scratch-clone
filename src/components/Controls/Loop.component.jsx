import { useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { CombinationContext } from "../../Context/Combination.context";
import { useContext } from "react";
import { useRef } from "react";
import DragBlock from "../Drag.component";

const Loop = props => {
    const [repeatTime, setRepeatTime] = useState(props.times);

    const modifyRepeatTime = change => { setRepeatTime(change) }
    const { pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);

    const loopTimerRef = useRef(null);

    return(
        <button className={`bg-${props.color} w-min text-white
             py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-mediumAdd commentMore actions
            flex flex-col whitespace-nowrap loopButton functionButton`}
            onMouseDown={event => {
                loopTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)

                    if(isCombo)
                        updateComboPin(props.index, false, false)
                    else
                        pickBlock([{
                            what: props.what,
                            actionData: props.actionData,
                            times: repeatTime
                        }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(loopTimerRef.current)
                if(isCombo)
                    updateComboPin(props.index, false, false)
            }}>
            {props.what == 'repeat' ?
            <div className="flex flex-row items-center px-3">
                <span>repeat</span>
                <input type="number" className="text-black text-center mx-2 functionInput"
                    value={repeatTime} onChange={event => modifyRepeatTime(event.target.value)}
                    onClick={e => e.stopPropagation()}
                    min={0}/>
            </div> :
            <span className="px-3">forever</span>}
            {props.actionData.length == 0 ?
                <div className="bg-white ml-3 mt-2 mb-3 self-stretch">{'blank'}</div> :
                <div className="ml-3 mt-2 mb-3">
                    <DragBlock block={props.actionData} />
                </div>}
        </button>
    );
}

export default Loop;