import Loop from "./Controls/Loop.component";
import Wait from "./Controls/Wait.component";
import { WhenFlag, WhenSprite } from "./Events/Event.Actions";
import CostumeFunction from "./Looks/Costume.component";
import Resize from "./Looks/Resize.component";
import Say from "./Looks/Say.component";
import Goto from "./Motions/Goto.component";
import Move from "./Motions/Move.component";
import Rotate from "./Motions/Rotate.component";


const DragBlock = props => {
    // based on block type, refer SideBar and render block
    const whatBasedActionRender = props.block.map((action, i) => {
        return action.what == 'move' ?
                <Move key={action.what + i} dir={action.options.dir} units={action.options.units}
                    color={colorConstants[action.what]} index={i} /> : (action.what == 'turn' ?
                <Rotate key={action.what + i} dir={action.options.dir}
                    deg={action.options.deg} reset={action.options.reset}
                    color={colorConstants[action.what]} index={i} /> : (action.what == 'goto' ?
                <Goto key={action.what + i} random={action.options.random}
                    x={action.options.x} y={action.options.y}
                    color={colorConstants[action.what]} index={i} /> : (action.what == 'costume' ?
                <CostumeFunction key={action.what + i} next={action.next} which={action.which}
                    color={colorConstants[action.what]} index={i} /> : (action.what == 'resize' ?
                <Resize key={action.what + i} definite={action.definite}
                    to={action.to} by={action.by}
                    color={colorConstants[action.what]} index={i} /> : (['say', 'think'].includes(action.what) ?
                <Say key={action.what + i} what={action.what} default={action.default}
                    timed={action.timed} time={action.time}
                    color={colorConstants[action.what]} index={i} /> : (action.what == 'flag' ?
                <WhenFlag key={action.what + i}
                    color={colorConstants[action.what]} index={i} /> : (action.what == 'sprite' ?
                <WhenSprite key={action.what + i}
                    color={colorConstants[action.what]} index={i} /> : (action.what == 'wait' ?
                <Wait key={action.what + i} for={action.for}
                    color={colorConstants[action.what]} index={i} /> :
                <Loop key={action.what + i} what={action.what}
                    times={action.times} actionData={action.actionData}
                    color={colorConstants[action.what]} index={i} />))))))))
    })

    return whatBasedActionRender;
}

export default DragBlock;


const colorConstants ={
    move: 'blue-500',
    turn: 'blue-500',
    goto: 'blue-500',
    say: 'purple-400',
    think: 'purple-400',
    costume: 'purple-400',
    resize: 'purple-400',
    flag: 'yellow-400',
    sprite: 'yellow-400',
    wait: 'yellow-600',
    repeat: 'yellow-600',
    forever: 'yellow-600'
}