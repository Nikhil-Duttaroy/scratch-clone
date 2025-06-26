import  { useRef } from "react";
import Icon from "../Icon.component";

const CostumeArea = props => {
    const fileRef = useRef("");

    const handleCostumeUpload = event => {
        const file = event.target.files[0]
        const fileBlob = URL.createObjectURL(file)

        props.addCostume(fileBlob)
        
        fileRef.current = ""
    }

    const costumesRenderer = props.costumes.map((costume, i) => {
        const Unique = costume

        return(
            <div key={i} className={`flex overflow-hidden border-2 h-[20%] w-[20%]  justify-center items-center ${props.inUse == i ? 'border-blue-300' : ''}
                rounded-lg cursor-pointer relative group`} onClick={() => props.changeCostume(i)}>
                <div className="transform scale-50">
                    <Unique />
                </div>
                <button
                    className="absolute inset-0 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs font-medium"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.addSprite(i);
                    }}
                    title={`Add sprite with this costume`}
                >
                    + Sprite
                </button>
            </div>
        );
    })

    return(
        <div className="flex flex-col h-full">
            <div className="h-12 bg-gray-50 border-b flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                        Costumes for Sprite {(props.activeSprite || 0) + 1}
                    </span>
                </div>
                <div className="text-xs text-gray-500">
                    Click a costume to change, hover to add sprite
                </div>
            </div>
            
            <div className="flex-1 flex flex-row flex-wrap gap-2 p-2 overflow-auto">
                <div className={`h-[20%] w-[20%] border-2 border-blue-400 bg-blue-50
                    rounded-lg cursor-pointer flex flex-row items-center justify-center`}
                    onClick={() => { fileRef.current.click() }}>
                    <Icon name="plus" size={45} className="text-blue-500" />
                </div>
                <input type="file" accept="image/*" style={{ display: 'none' }}
                    ref={input => { fileRef.current = input }}
                    onChange={event => handleCostumeUpload(event)}/>
                {costumesRenderer}
            </div>
        </div>
    );
}

export default CostumeArea;