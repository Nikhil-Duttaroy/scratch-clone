import Resize from "./Resize.component";
import Say from "./Say.component";

/**
 * Renders the appropriate look block (Costume, Resize, Say) based on the 'what' property of each lookAbility item.
 * @param {Object} props
 * @param {Array} props.lookAbility - Array of look block objects to render
 * @param {string} props.color - Color for the block UI
 * @returns {JSX.Element[]}
 */
const LookActions = props => {
    // Map each lookAbility item to its corresponding component
    const whatBasedLookRender = props.lookAbility.map((look, i) => {
        return (look.what == 'resize' ?
                <Resize key={look.what + i} definite={look.definite} to={look.to}
                    by={look.by} color={props.color} /> :
                <Say key={look.what + i} what={look.what} default={look.default} timed={look.timed}
                    time={look.time} color={props.color} />)
    })

    return whatBasedLookRender;
}

export default LookActions;