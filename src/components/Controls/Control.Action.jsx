import Loop from "./Loop.component";
import Wait from "./Wait.component";


const ControlActions = props => {
    const whatBasedControlRender = props.controlAbility.map((control, i) => {
        return control.what == 'wait' ?
                <Wait key={control.what + i} for={control.for} color={props.color} /> :
                <Loop key={control.what + i} what={control.what} times={control.times}
                    color={props.color} actionData={control.actionData} />
    })

    return whatBasedControlRender;
}

export default ControlActions;