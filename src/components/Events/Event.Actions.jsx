import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import Icon from "../Icon.component";
import { useRef } from "react";

/**
 * Renders the appropriate event block (WhenFlag, WhenSprite) based on the 'what' property of each eventAbility item.
 * @param {Object} props
 * @param {Array} props.eventAbility - Array of event block objects to render
 * @param {string} props.color - Color for the block UI
 * @returns {JSX.Element[]}
 */
const EventActions = props => {
    // Map each eventAbility item to its corresponding component
    const whatBasedEventRender = props.eventAbility.map((eve, i) => {
        return eve.what == 'flag' ?
                <WhenFlag key={eve.what + i} color={props.color} /> :
                <WhenSprite key={eve.what + i} color={props.color} />
    })
    return whatBasedEventRender;
}

export default EventActions;

/**
 * WhenFlag block component for event (when green flag clicked).
 * @param {Object} props
 * @param {string} props.color - Color for the block UI
 * @param {number} [props.index] - Index in combination (if used in combo)
 * @returns {JSX.Element}
 */
export const WhenFlag = ({ color, index }) => {
    const { pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);
    const flagTimerRef = useRef(null); // Timer for drag/hold detection
    return(
        <button className={`bg-${color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium
             items-center functionButton`}
            onMouseDown={event => {
                // Start drag after 300ms hold
                flagTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)
                    if(isCombo)
                        updateComboPin(index, false)
                    else
                        pickBlock([{ what: 'flag' }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(flagTimerRef.current)
                if(isCombo)
                    updateComboPin(index, false, true)
            }}>
            <span>when</span>
            <Icon name="flag" className="text-green-600 mx-2" />
            <span>clicked</span>
        </button>
    );
}

/**
 * WhenSprite block component for event (when sprite clicked).
 * @param {Object} props
 * @param {string} props.color - Color for the block UI
 * @param {number} [props.index] - Index in combination (if used in combo)
 * @returns {JSX.Element}
 */
export const WhenSprite = ({ color, index }) => {
    const { pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);
    const spriteTimerRef = useRef(null); // Timer for drag/hold detection
    return(
        <button className={`bg-${color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium
            items-center functionButton `}
            onMouseDown={event => {
                // Start drag after 300ms hold
                spriteTimerRef.current = setTimeout(() => {
                    initializeBlockPos(event.clientX, event.clientY)
                    if(isCombo)
                        updateComboPin(index, false)
                    else
                        pickBlock([{ what: 'sprite' }])
                }, 300)
            }}
            onMouseUp={() => {
                clearTimeout(spriteTimerRef.current)
                if(isCombo)
                    updateComboPin(index, false, true)
            }}>
            <span>when</span>
            <span className="mx-1">this sprite</span>
            <span>clicked</span>
        </button>
    );
}