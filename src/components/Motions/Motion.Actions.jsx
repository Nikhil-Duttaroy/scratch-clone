import Goto from "./Goto.component";
import Move from "./Move.component";
import Rotate from "./Rotate.component";

const MotionActions = (props) => {
  const whatBasedMotionRender = props.motionAbility.map((motion, i) => {
    return motion.what == "move" ? (
      <Move
        key={motion.what + i}
        dir={motion.options.dir}
        units={motion.options.units}
        color={props.color}
      />
    ) : motion.what == "turn" ? (
      <Rotate
        key={motion.what + i}
        dir={motion.options.dir}
        deg={motion.options.deg}
        reset={motion.options.reset}
        color={props.color}
      />
    ) : (
      <Goto
        key={motion.what + i}
        random={motion.options.random}
        x={motion.options.x}
        y={motion.options.y}
        color={props.color}
      />
    );
  });

  return whatBasedMotionRender;
};

export default MotionActions;
