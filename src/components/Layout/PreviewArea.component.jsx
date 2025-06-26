import { useEffect, useRef, useState } from "react";
import { limitUtil } from "../../util/limitUtil";
import Icon from "../Icon.component";

const PreviewArea = (props) => {
  const areaRef = useRef(null);

  const [showCostumeChoices, setShowCostumeChoices] = useState(false)

  const [bounds, setBounds] = useState({
    least: { x: 0, y: 0 },
    most: { x: 0, y: 0 },
  });

  const handleSpriteMove = (event, spriteIndex) => {
    let isInBounds = limitUtil(event.clientX, event.clientY, bounds);
    if (props.sprites[spriteIndex]?.pinned && isInBounds) {
      const newPosition = {
        x: event.clientX - bounds.least.x,
        y: event.clientY - bounds.least.y,
        deg: props.sprites[spriteIndex].position.deg
      };
      props.updateSpritePos(newPosition, false, spriteIndex);
    }
  };

  useEffect(() => {
    if (areaRef && areaRef.current) {
      const areaRect = areaRef.current.getBoundingClientRect();
      setBounds({
        least: { x: areaRect.x, y: areaRect.y },
        most: {
          x: areaRect.x + areaRect.width,
          y: areaRect.y + areaRect.height,
        },
      });
    }
  }, []);

  return (
    <div className="flex-1 h-full flex flex-col">
      {/* Sprite Management Header */}
      <div className="h-10 bg-gray-50 border-b flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sprites:</span>
          <div className="flex space-x-1">
            {props.sprites.map((sprite, index) => (
              <button
                key={sprite.id}
                className={`px-2 py-1 text-xs rounded ${
                  index === props.activeSprite 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => props.selectActiveSprite(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-1 relative">
          <button
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setShowCostumeChoices(d => !d)}
            title="Add Sprite"
          >
            <Icon name="plus" size={12} />
          </button>
          {showCostumeChoices && <div className="absolute bg-white p-2 rounded-md shadow-lg top-8 right-0 z-10
            flex flex-row gap-x-2">
              {props.costumes.map((Costume, i) => {
                return <button key={i} className="w-12 h-12 flex justify-center items-center
                  cursor-pointer hover:bg-gray-100 rounded-md" onClick={() => {
                    props.addSprite(i)
                    setShowCostumeChoices(false)
                  }}>
                  <div className="transform scale-50">
                    <Costume />
                  </div>
                </button>
              })}
          </div>}
          {props.sprites.length > 1 && (
            <button
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => props.removeSprite(props.activeSprite)}
              title="Remove Active Sprite"
            >
              <Icon name="minus" size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div
        className="flex-1 relative"
        ref={(ele) => {
          areaRef.current = ele;
        }}
        onMouseMove={(event) => {
          // Handle mouse move for all pinned sprites
          props.sprites.forEach((sprite, index) => {
            if (sprite.pinned) {
              handleSpriteMove(event, index);
            }
          });
        }}
        onMouseUp={() => {
          // Unpin all sprites on mouse up
          props.sprites.forEach((sprite, index) => {
            if (sprite.pinned) {
              props.pinTheSprite(false, index);
            }
          });
        }}
      >
        {/* Render all sprites */}
        {props.sprites.map((sprite, index) => {
          const Costume = props.costumes[sprite.costumeIndex];
          return (
            <div
              key={sprite.id}
              className={`absolute cursor-pointer ${
                index === props.activeSprite ? 'ring-2 ring-blue-400' : ''
              }`}
              style={{
                top: sprite.position.y,
                left: sprite.position.x,
                rotate: `${sprite.position.deg}deg`,
                transform: `scale(${sprite.size})`,
              }}
              onClick={() => {
                props.selectActiveSprite(index);
                props.clickTheSprite(index);
              }}
              onMouseDown={() => props.pinTheSprite(true, index)}
              onMouseUp={() => props.pinTheSprite(false, index)}
            >
              <Costume />
              {sprite.speak && (
                <div
                  className={`absolute rounded-xl px-4 py-2 border-4 border-gray-300
                            border-${sprite.speak.act === "say" ? "solid" : "dotted"}
                            top-0 left-full z-10`}
                >
                  <span>{sprite.speak.speakWhat}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewArea;

