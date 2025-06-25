import { useContext } from "react";
import { CombinationContext } from "../../Context/Combination.context";
import { SpriteActionsContext } from "../../Context/SpriteActions.context";
import Icon from "../Icon.component";
import { useRef } from "react";


const EventActions = props => {
    const whatBasedEventRender = props.eventAbility.map((eve, i) => {
        return eve.what == 'flag' ?
                <WhenFlag key={eve.what + i} color={props.color} /> :
                <WhenSprite key={eve.what + i} color={props.color} />
    })

    return whatBasedEventRender;
}

export default EventActions;


export const WhenFlag = ({ color, index }) => {
    const { pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);

    const flagTimerRef = useRef(null);

    return(
        <button className={`bg-${color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium
             items-center functionButton`}
            onMouseDown={event => {
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

export const WhenSprite = ({ color, index }) => {
    const { pickBlock, initializeBlockPos } = useContext(SpriteActionsContext);
    const { isCombo, updateComboPin } = useContext(CombinationContext);

    const spriteTimerRef = useRef(null);

    return(
        <button className={`bg-${color} flex flex-row text-white
            px-4 py-2 my-${isCombo ? 0 : 3} cursor-pointer rounded-md font-medium
            items-center functionButton `}
            onMouseDown={event => {
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