import React, { useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";
import { useRef } from "react";

const Say = (props) => {
  const [sayWhat, setSayWhat] = useState(props.default);
  const [sayFor, setSayFor] = useState(props.time);
const { spriteLooksTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);
    const sayTimerRef = useRef(null);
  const makeSay = (what) => {
    setSayWhat(what);
  };

  const updateSayTime = (forTime) => {
    setSayFor(forTime);
  };

  return (
    <button
      className={`bg-${props.color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium items-center functionButton`}
      onClick={() => {
                if(!isCombo)
                    spriteLooksTrigger({
                        what: props.what,
                        default: sayWhat,
                        timed: props.timed,
                        time: sayFor
                    })
            }}
            onMouseDown={event => {
                sayTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)

                    if(isCombo)
                        updateComboPin(props.index, false)
                    else
                        pickBlock([{
                            what: props.what,
                            default: sayWhat,
                            timed: props.timed,
                            time: sayFor
                        }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(sayTimerRef.current)
                if(isCombo)
                    updateComboPin(props.index, false, true)
            }}>
      <span>{props.what}</span>
      <input
        type="text"
        className="text-black text-center mx-2 funcInputText"
        value={sayWhat}
        onChange={(e) => makeSay(e.target.value)}
        onClick={(e) => e.stopPropagation()}
      />
      {props.timed && (
        <>
          <span>for</span>
          <input
            type="number"
            className="text-black text-center mx-2 functionInput"
            value={sayFor}
            onChange={(e) => updateSayTime(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            min={0}
          />
          <span>sec</span>
        </>
      )}
    </button>
  );
};

export default Say;
