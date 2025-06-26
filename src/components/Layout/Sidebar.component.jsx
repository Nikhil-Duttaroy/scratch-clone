import { useRef, useState } from "react";
import { categories } from "../../util/categoryies";
import Icon from "../Icon.component";
import {
  controlAbility,
  eventAbility,
  lookAbility,
  motionAbility,
} from "../../util/abilities";
import MotionActions from "../Motions/Motion.Actions";
import LookActions from "../Looks/Looks.Actions";
import EventActions from "../Events/Event.Actions";
import ControlActions from "../Controls/Control.Action";

const Sidebar = (props) => {
  const barRef = useRef(null);
  const motionActionsRef = useRef(null);
  const lookActionsRef = useRef(null);
  const eventActionsRef = useRef(null);
  const controlActionsRef = useRef(null);

  const [activeCid, setActiveCid] = useState(1);

  const updateActiveCid = (cid) => {
    setActiveCid(cid);

    if (barRef && barRef.current)
      if (cid == 1) barRef.current.scrollTop = 0;
      else if (cid == 2 && motionActionsRef && motionActionsRef.current)
        barRef.current.scrollTop = motionActionsRef.current.scrollHeight;
      else if (cid == 3 && lookActionsRef && lookActionsRef.current)
        barRef.current.scrollTop =
          motionActionsRef.current.scrollHeight +
          lookActionsRef.current.scrollHeight;
      else if (cid == 4 && eventActionsRef && eventActionsRef.current)
        barRef.current.scrollTop =
          motionActionsRef.current.scrollHeight +
          lookActionsRef.current.scrollHeight +
          eventActionsRef.current.scrollHeight;
  };

  const categoryList = categories.map((category) => (
    <div
      key={category.cid}
      className={`w-full px- py-1 cursor-pointer ${
        activeCid === category.cid ? "bg-blue-50" : ""
      }`}
      onClick={() => updateActiveCid(category.cid)}
    >
      <div>
        <Icon
          name="circle"
          size={24}
          className={`text-${category.color} mx-auto`}
        />
      </div>
      <div className="text-center font-semibold text-sm">
        <span>{category.name}</span>
      </div>
    </div>
  ));

  return (
    <div className="w-2/5 h-full flex flex-row items-start border-r border-gray-200">
      <div className="w-min px-2 h-full flex flex-col border-r border-gray-200">
        {categoryList}
      </div>
      <div
        ref={(ele) => {
          barRef.current = ele;
        }}
        className="h-full flex-1 overflow-y-auto p-2"
      >
        <div
          ref={(ele) => {
            motionActionsRef.current = ele;
          }}
        >
          <div className="font-semibold text-lg">Motion</div>
          <MotionActions
            motionAbility={motionAbility}
            color={
              categories.filter((category) => category.type == "motion")[0]
                .color
            }
          />
        </div>
        <div
          ref={(ele) => {
            lookActionsRef.current = ele;
          }}
        >
          <div className="font-semibold text-lg">Looks</div>
          <LookActions
            lookAbility={lookAbility}
            color={
              categories.filter((category) => category.type == "looks")[0].color
            }
          />
        </div>
        <div
          ref={(ele) => {
            eventActionsRef.current = ele;
          }}
        >
          <div className="font-semibold text-lg">Events</div>
          <EventActions
            eventAbility={eventAbility}
            color={
              categories.filter((category) => category.type == "events")[0]
                .color
            }
          />
        </div>
        <div
          ref={(ele) => {
            controlActionsRef.current = ele;
          }}
        >
          <div className="font-semibold text-lg">Control</div>
          <ControlActions
            controlAbility={controlAbility}
            color={
              categories.filter((category) => category.type == "control")[0]
                .color
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
