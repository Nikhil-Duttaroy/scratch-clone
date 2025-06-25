import React, { useState } from "react";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";
import { useRef } from "react";

/**
 * Say/Think block component for sprite looks (speech/thought bubbles).
 * @param {Object} props
 * @param {string} props.what - Type of look ('say' or 'think')
 * @param {string} props.default - Default text to display
 * @param {boolean} [props.timed] - If true, show for a limited time
 * @param {number} [props.time] - Time in seconds to show
 * @param {string} props.color - Color for the block UI
 * @param {number} [props.index] - Index in combination (if used in combo)
 * @returns {JSX.Element}
 */
const Say = (props) => {
  const [sayWhat, setSayWhat] = useState(props.default); // Current text to say/think
  const [sayFor, setSayFor] = useState(props.time); // Current time to say/think (if timed)
  const { spriteLooksTrigger, pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
  const { isCombo, updateComboPin } = useContext(CombinationContext);
  const sayTimerRef = useRef(null); // Timer for drag/hold detection

  // Update the text to say/think
  const makeSay = (what) => {
    setSayWhat(what);
  };

  // Update the time to say/think
  const updateSayTime = (forTime) => {
    setSayFor(forTime);
  };

  return (
    <button
      className={`bg-${props.color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium items-center functionButton`}
      onClick={() => {
        // Trigger say/think if not in combination edit mode
        if(!isCombo)
          spriteLooksTrigger({
            what: props.what,
            default: sayWhat,
            timed: props.timed,
            time: sayFor
          })
      }}
      onMouseDown={event => {
        // Start drag after 300ms hold
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
