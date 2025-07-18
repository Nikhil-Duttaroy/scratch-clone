import { useEffect, useRef, useState } from "react";
import { limitUtil } from "../../util/limitUtil";
import { CombinationContext } from "../../Context/Combination.context";
import DragBlock from "../Drag.component";

const MidArea = (props) => {
  const midAreaRef = useRef(null);
  const dragTimerRef = useRef(null);
  const [bounds, setBounds] = useState({
    least: { x: 0, y: 0 },
    most: { x: 0, y: 0 },
  });

  const [comboPin, setComboPin] = useState(null);
  const [releasing, setReleasing] = useState(false);
  const [hoveredComb, setHoveredComb] = useState(null);

  const updateComboPin = (pos, root, releasing) => {
    // releasing - false implies a loop action/function
    setComboPin((comboPin) => {
      if (pos != null) {
        let combinationPin = JSON.parse(JSON.stringify(comboPin));

        if (root && combinationPin) {
          let depList = [...combinationPin.depth].reverse();
          combinationPin = {
            ...combinationPin,
            combId: pos,
            depth: depList,
            aimLevel: combinationPin.aimLevel + 1,
          };
        } else if (!combinationPin)
          combinationPin = {
            combId: -1,
            idx: pos,
            depth: releasing == false ? [pos] : [],
            aim: pos,
            aimLevel: 0,
          };
        else
          combinationPin = {
            ...combinationPin,
            idx: pos,
            depth:
              releasing == false
                ? [...combinationPin.depth, pos]
                : [...combinationPin.depth],
            aimLevel: combinationPin.aimLevel + 1,
          };

        return combinationPin;
      }

      return null;
    });
    setReleasing(releasing == true);
  };

  const handleItemDrop = (event) => {
    event.stopPropagation();
    let isInBounds = limitUtil(event.clientX, event.clientY, bounds);
    if (props.block && isInBounds) {
      props.createCombination({
        position: {
          x: event.clientX - bounds.least.x,
          y: event.clientY - bounds.least.y,
        },
        block: props.block,
      });
      props.pickBlock(null);
    }
    setHoveredComb(null);
  };
  useEffect(() => {
    if (midAreaRef && midAreaRef.current) {
      const areaRect = midAreaRef.current.getBoundingClientRect();
      setBounds({
        least: { x: areaRect.x, y: areaRect.y },
        most: {
          x: areaRect.x + areaRect.width,
          y: areaRect.y + areaRect.height,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (comboPin && comboPin.combId >= 0) {
      let combPin = comboPin;
      updateComboPin(null);
      if (releasing) props.releasePinOnCombination(combPin);
      else props.pinTheCombination(combPin);
    }
  }, [comboPin, releasing]);

  const combinationRenderer = props.combinations.map((combination, i) => {
    return (
      // each drag block will have
      // click - run it
      // mouse down - pin the combination
      //
      // mouse up event on drag block elements,
      // clear block and pinned item & update combinations
      <div
        key={"#" + i}
        className={`absolute rounded-md transition-shadow duration-200 
          ${(hoveredComb === i && props.block) ? 'shadow-lg ring-4 ring-yellow-400' : ''}`}
        style={{
          top: combination.position.y,
          left: combination.position.x,
        }}
        onMouseEnter={() => {
            if(props.block) setHoveredComb(i);
        }}
        onMouseLeave={() => setHoveredComb(null)}
        onMouseDown={() => {
          dragTimerRef.current = setTimeout(() => {
            updateComboPin(i, true);
          }, 300);
        }}
        onMouseUp={(event) => {
          event.stopPropagation();
          clearTimeout(dragTimerRef.current);
          updateComboPin(i, true, true);
          setHoveredComb(null);
        }}
        onClick={event => props.runByBlockClick(combination.block, false)}>
        <DragBlock block={combination.block} />
      </div>
    );
  });

  return (
    <div
      className="flex-1 h-full relative"
      ref={(ele) => {
        midAreaRef.current = ele;
      }}
      onMouseUp={(event) => handleItemDrop(event)}
    >
      <div className="absolute top-2 right-2 z-10">
        <button 
          className={`px-3 py-1.5 text-sm font-semibold rounded-md shadow-sm
            ${props.combinations.length > 0 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={props.combinations.length === 0}
          onClick={() => {
            if (props.combinations.length > 0) {
              props.runByBlockClick(props.combinations[0].block, false, true);
            }
          }}
        >
          Play All
        </button>
      </div>
      <CombinationContext.Provider
        value={{
          isCombo: true,
          updateComboPin: (pos, root, releasing) =>
            updateComboPin(pos, root, releasing),
        }}
      >
        {combinationRenderer}
      </CombinationContext.Provider>
    </div>
  );
};

export default MidArea;
