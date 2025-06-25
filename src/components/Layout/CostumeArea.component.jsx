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
                rounded-lg cursor-pointer`} onClick={() => props.changeCostume(i)}>
                <div className="transform scale-50">
                    <Unique />
                </div>
            </div>
        );
    })

    return(
        <div className="flex flex-row flex-wrap gap-2 p-2 aspect-square">
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
    );
}

export default CostumeArea;