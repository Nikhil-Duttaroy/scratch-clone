import React, { useContext, useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useRef } from "react";
import { CombinationContext } from "../../Context/Combination.context";

const CostumeFunction = props => {
   const { spriteLooksTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);

    const [costumeNo, setCostumeNo] = useState(props.which);

    const changeCostume = no => { setCostumeNo(no) }
const costumeTimerRef = useRef(null);
    return(
        <button className={`bg-${props.color} w-min text-white
            px-3 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium
            flex flex-row items-center whitespace-nowrap functionButton`}
             onClick={() => {
                if(!isCombo)
                    spriteLooksTrigger({
                        what: 'costume',
                        next: props.next,
                        which: costumeNo
                    })
            }}
            onMouseDown={event => {
                costumeTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)

                    if(isCombo)
                        updateComboPin(props.index, false)
                    else
                        pickBlock([{
                            what: 'costume',
                            next: props.next,
                            which: costumeNo
                        }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(costumeTimerRef.current)
                if(isCombo)
                    updateComboPin(props.index, false, true)
            }}>
            {props.next ? <span>next costume</span> :
            <>
                <span>switch costume to</span>
                <input type="number" className="text-black text-center mx-2 functionInput"
                    value={costumeNo} onChange={event => changeCostume(Number(event.target.value))}
                    onClick={event => event.stopPropagation()} min={0}/>
            </>}
        </button>
    );
}

export default CostumeFunction;