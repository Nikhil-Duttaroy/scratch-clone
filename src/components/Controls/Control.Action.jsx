import Loop from "./Loop.component";
import Wait from "./Wait.component";

/**
 * Renders the appropriate control block (Wait, Loop) based on the 'what' property of each controlAbility item.
 * @param {Object} props
 * @param {Array} props.controlAbility - Array of control block objects to render
 * @param {string} props.color - Color for the block UI
 * @returns {JSX.Element[]}
 */
const ControlActions = props => {
    // Map each controlAbility item to its corresponding component
    const whatBasedControlRender = props.controlAbility.map((control, i) => {
        return control.what == 'wait' ?
                <Wait key={control.what + i} for={control.for} color={props.color} /> :
                <Loop key={control.what + i} what={control.what} times={control.times}
                    color={props.color} actionData={control.actionData} />
    })

    return whatBasedControlRender;
}

export default ControlActions;