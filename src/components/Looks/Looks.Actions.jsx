
import CostumeFunction from "./Costume.component";
import Resize from "./Resize.component";
import Say from "./Say.component";

const LookActions = props => {
    const whatBasedLookRender = props.lookAbility.map((look, i) => {
        return look.what == 'costume' ?
                <CostumeFunction key={look.what + i} next={look.next} which={look.which}
                    color={props.color} /> : (look.what == 'resize' ?
                <Resize key={look.what + i} definite={look.definite} to={look.to}
                    by={look.by} color={props.color} /> :
                <Say key={look.what + i} what={look.what} default={look.default} timed={look.timed}
                    time={look.time} color={props.color} />)
    })

    return whatBasedLookRender;
}

export default LookActions;