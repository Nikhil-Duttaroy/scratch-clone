import DragBlock from "../Drag.component";
import Icon from "../Icon.component";


const ReplayArea = props => {
    const replayRenderer = props.replayList.map((block, i) => {
        return(
            <div key={i} className={`w-min h-min overflow-hidden border-2 ${props.replayId == i ? 'border-blue-300' : ''}
                rounded-lg cursor-pointer`} onClick={() => props.updateReplayId(i)}>
               
                    <DragBlock block={block} />
                
            </div>
        );
    })

    return(
        <div className="flex flex-row flex-wrap gap-2 p-2 h-min">
            {props.replayList.length == 0 ?
            <div className="text-center text-lg font-medium text-gray-500 pt-4 h-min flex">
                <span>
                To record replay use when  
                </span><Icon name="flag" className="text-green-600 mx-2" /> 
                <span>
                clicked
                </span>
            </div> : replayRenderer}
        </div>
    );
}

export default ReplayArea;