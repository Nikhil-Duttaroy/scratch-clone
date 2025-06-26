import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import CatSprite from "./Sprites/catSprite.component.jsx";
import PreviewArea from "./Layout/PreviewArea.component.jsx";
import MidArea from "./Layout/MidArea.component.jsx";
import Sidebar from "./Layout/Sidebar.component.jsx";
import Icon from "./Icon.component.jsx";
import DragBlock from "./Drag.component.jsx";
import { gotoTrigger, moveTrigger, turnTrigger } from "../util/motionUtil.js";
import {
  resizeTrigger,
  speakTrigger,
} from "../util/lookUtil.js";
import { SpriteActionsContext } from "../Context/SpriteActions.context.js";
import { pinCombinationsUpdator, pinnedBlockExtractor, updateCombinationHelper } from "../util/combinationUtil.js";
import CostumeArea from "./Layout/CostumeArea.component.jsx";
import { categories } from "../util/categoryies.js";
import { waitForSprite } from "../util/controlUtil.js";
import ReplayArea from "./Layout/ReplayArea.component.jsx";
import DogSprite from "./Sprites/dogSprite.component.jsx";

const Editor = () => {
    // --- State Declarations ---
    const [flagClicked, setFlagClicked] = useState(false); // Whether the green flag (run) is clicked
    const [section, setSection] = useState(0); // Current editor section (0: Code, 1: Costume, 2: Replay)
    const [costumes, setCostumes] = useState([
        CatSprite,
        DogSprite, // TODO: Remove duplicate if not needed
    ]);
    const [sprites, setSprites] = useState([
        {
            id: 0,
            costumeIndex: 0,
            position: { x: 0, y: 0, deg: 0 },
            size: 1,
            speak: null,
            pinned: false,
            clicked: false
        }
    ]);
    const [activeSprite, setActiveSprite] = useState(0); // Index of currently selected sprite
    const [runningSprite, setRunningSprite] = useState(0); // Index of sprite currently running blocks
    const [currentExecutionState, setCurrentExecutionState] = useState(null); // Current sprite state during execution
    const executionStateRef = useRef(null); // Synchronous execution state reference
    const [block, setBlock] = useState(null); // Block currently being dragged or manipulated
    const [blockAt, setBlockAt] = useState({ x: 0, y: 0 }); // Position of the dragged block
    const [combinations, setCombinations] = useState([]); // All block combinations (scripts)
    const [combinationPinned, setCombinationPinned] = useState(null); // Currently pinned combination (for editing)
    const [replayList, setReplayList] = useState([]); // List of block runs for replay
    const [replayId, setReplayId] = useState(0); // Current replay index

    // Legacy compatibility getters for active sprite
    const spriteClicked = sprites[activeSprite]?.clicked || false;
    const inUse = sprites[activeSprite]?.costumeIndex || 0;

    // --- Memoized Values ---
    /**
     * Filters combinations to only those whose first block is a 'when flag clicked' or 'when sprite clicked' event,
     * depending on the current run mode.
     */
    const combinationsWithWhen = useMemo(() => {
        return combinations.filter(combo =>
            combo.block[0].what === (flagClicked ? 'flag' : 'sprite')
        );
    }, [combinations, flagClicked]);

    /**
     * Flattens all blocks (except the first event block) from all combinationsWithWhen into a single array.
     * Used to run all relevant blocks in sequence.
     */
    const combinedBlock = useMemo(() => {
        if (combinationsWithWhen.length === 0) return [];
        let combined = [];
        let maxSizeBlock = 0;
        combinationsWithWhen.forEach(combo => {
            maxSizeBlock = Math.max(maxSizeBlock, combo.block.length);
        });
        for (let i = 1; i < maxSizeBlock; i++) {
            for (let j = 0; j < combinationsWithWhen.length; j++) {
                if (i < combinationsWithWhen[j].block.length)
                    combined.push(combinationsWithWhen[j].block[i]);
            }
        }
        return combined;
    }, [combinationsWithWhen]);

    // --- Effects ---
    /**
     * When the sprite or flag is clicked, run all relevant blocks and add to the replay list.
     */
    useEffect(() => {
        if (spriteClicked || flagClicked) {
            if (combinationsWithWhen.length > 0) {
                setReplayList(list => [...list, combinedBlock]);
                runByBlockClick(combinedBlock, false);
                flagClicked && setFlagClicked(false)
                if (spriteClicked) setSprites(sprites => sprites.map(sprite => ({ ...sprite, clicked: false })));
            }
        }
    }, [spriteClicked, flagClicked, combinationsWithWhen, combinedBlock]);

    // --- Callbacks and Handlers ---
    /**
     * Set the 'run' flag in sessionStorage to true.
     */
    const triggerRun = () => {
        sessionStorage.setItem('run', true)
    }
    /**
     * Stop the run, reset sprite/flag click states.
     */
    const stopRun = () => {
        sessionStorage.setItem('run', false)
        if(spriteClicked)
            setSprites(sprites => sprites.map(sprite => ({ ...sprite, clicked: false })));
        if(flagClicked)
            setFlagClicked(false)
    }
    /**
     * Change the current editor section (0: Code, 1: Costume, 2: Replay)
     * @param {number} sec
     */
    const changeSection = sec => { setSection(sec) }
    /**
     * Add a new costume to the costume list.
     * @param {string} newCostume - Image URL or data for the new costume
     */
    const addCostume = newCostume => {
        setCostumes(costumes => [ ...costumes, () => (
            <img src={newCostume} alt="newCostume" />
        ) ])
    }
    /**
     * Change the currently used costume by index.
     * @param {number} to
     */
    const changeCostume = to => {
        if(to < costumes.length)
            setSprites(sprites => sprites.map((sprite, index) => 
                index === activeSprite ? { ...sprite, costumeIndex: to } : sprite
            ));
    }
    /**
     * Add a new sprite to the preview area.
     * @param {number} costumeIndex - Index of costume to use for new sprite
     */
    const addSprite = (costumeIndex = 0) => {
        const newSprite = {
            id: Date.now(), // Use timestamp as unique ID
            costumeIndex: costumeIndex,
            position: { x: Math.random() * 100, y: Math.random() * 100, deg: 0 },
            size: 1,
            speak: null,
            pinned: false,
            clicked: false
        };
        setSprites(sprites => [...sprites, newSprite]);
    }
    /**
     * Remove a sprite by index.
     * @param {number} spriteIndex
     */
    const removeSprite = (spriteIndex) => {
        if (sprites.length > 1) { // Keep at least one sprite
            setSprites(sprites => sprites.filter((_, index) => index !== spriteIndex));
            if (activeSprite >= sprites.length - 1) {
                setActiveSprite(Math.max(0, sprites.length - 2));
            }
        }
    }
    /**
 * Set the active sprite for editing.
 * @param {number} spriteIndex
 */
const selectActiveSprite = (spriteIndex) => {
    if (spriteIndex >= 0 && spriteIndex < sprites.length) {
        setActiveSprite(spriteIndex);
    }
}
    /**
 * Update the sprite's position and direction.
 * @param {{x:number, y:number, deg:number}} to
 * @param {boolean} checkRun - Only update if running, unless checkRun is false
 * @param {number} spriteIndex - Index of sprite to update (defaults to activeSprite)
 */
const updateSpritePos = useCallback((to, checkRun, spriteIndex = activeSprite) => {
    if (!checkRun || JSON.parse(sessionStorage.getItem('run'))) {
        setSprites(sprites => sprites.map((sprite, index) => 
            index === spriteIndex ? { ...sprite, position: to } : sprite
        ));
    }
}, [activeSprite]);
/**
 * Handler for when the sprite is clicked (starts run mode).
 * @param {number} spriteIndex - Index of sprite that was clicked (defaults to activeSprite)
 */
const clickTheSprite = (spriteIndex = activeSprite) => {
    triggerRun()
    setRunningSprite(spriteIndex); // Track which sprite is running
    setSprites(sprites => sprites.map((sprite, index) => 
        index === spriteIndex ? { ...sprite, clicked: true } : sprite
    ));
}
/**
 * Pin or unpin the sprite for editing.
 * @param {boolean} should
 * @param {number} spriteIndex - Index of sprite to pin/unpin (defaults to activeSprite)
 */
const pinTheSprite = (should, spriteIndex = activeSprite) => { 
    setSprites(sprites => sprites.map((sprite, index) => 
        index === spriteIndex ? { ...sprite, pinned: should } : sprite
    )); 
}
/**
 * Set the sprite's speech/thought bubble.
 * @param {object} speak
 */
const makeSpriteSpeak = speak => {
    setSprites(sprites => sprites.map((sprite, index) => 
        index === runningSprite ? { ...sprite, speak: speak && sprite.speak ? { 
            ...sprite.speak,
            act: speak.act,
            speakWhat: speak.speakWhat
        } : speak } : sprite
    ));
}
/**
 * Resize the sprite.
 * @param {number} size
 */
const resizeSprite = useCallback((size) => {
    setSprites(sprites => sprites.map((sprite, index) => 
        index === runningSprite ? { ...sprite, size: size } : sprite
    ));
}, [runningSprite]);
    /**
     * Set the currently picked/dragged block.
     * @param {object|null} block
     */
    const pickBlock = block => { setBlock(block) }
    /**
     * Initialize the position of the dragged block.
     * @param {number} xPos
     * @param {number} yPos
     */
    const initializeBlockPos = (xPos, yPos) => { setBlockAt({ x: xPos, y: yPos }) }
    /**
     * Handler for moving a block during drag.
     * @param {MouseEvent} event
     */
    const handleBlockMove = event => {
        if(block)
            setBlockAt({ x: event.clientX, y: event.clientY })
    }
    /**
     * Handler for releasing a block outside a drop area.
     */
    const handleBlockReleaseOutsideDrop = () => {
        pickBlock(null)
        setBlockAt({ x: 0, y: 0 })
        if(combinationPinned != null)
            pinTheCombination(null)
    }
    /**
     * Add a new combination (script) to the workspace.
     * @param {object} combination
     */
    const createCombination = combination => {
        setCombinations(combinations => [ ...combinations, combination ])
    }
    /**
     * Pin a combination for editing, and update the block state accordingly.
     * @param {object|null} combination
     */
    const pinTheCombination = useCallback((combination) => {
        setCombinationPinned(combination);
        if (combination) {
            pickBlock(pinnedBlockExtractor(combinations[combination.combId], combination));
            setCombinations(pinCombinationsUpdator(combinations, combination));
        }
    }, [combinations]);
    /**
     * Release the pin on a combination and update it with the current block.
     * @param {object} combo
     */
    const releasePinOnCombination = useCallback((combo) => {
        if (!block || ['flag', 'sprite'].includes(block[0].what))
            return;
        setCombinations(updateCombinationHelper(combinations, combo, block));
        handleBlockReleaseOutsideDrop();
    }, [block, combinations]);
    /**
     * Set the current replay index.
     * @param {number} id
     */
    const updateReplayId = id => { setReplayId(id) }
    /**
     * Triggers sprite motion (move, turn, goto) based on the block's function.
     * @param {object} func
     * @param {boolean} checkRun
     */
    const spriteMotionTrigger = useCallback((func, checkRun) => {
        // Use execution ref for synchronous access, fallback to state, then sprite state
        const currentSpritePos = executionStateRef.current?.position || currentExecutionState?.position || sprites[runningSprite]?.position || { x: 0, y: 0, deg: 0 };
        let spritePos = null;
        if (func.what === 'move')
            spritePos = moveTrigger(currentSpritePos, func.options.dir, func.options.units);
        else if (func.what === 'turn')
            spritePos = turnTrigger(currentSpritePos, func.options);
        else
            spritePos = gotoTrigger(currentSpritePos, func.options);
        
        // During execution, update both ref and state
        if (executionStateRef.current) {
            executionStateRef.current = { ...executionStateRef.current, position: spritePos };
            setCurrentExecutionState(prev => ({ ...prev, position: spritePos }));
            updateSpritePos(spritePos, false, runningSprite);
        } else {
            // If no execution state (single block click), update sprite directly
            updateSpritePos(spritePos, checkRun, runningSprite);
        }
    }, [sprites, runningSprite, currentExecutionState, updateSpritePos]);
    /**
     * Triggers sprite look changes (say, think, resize) based on the block's function.
     * @param {object} func
     */
    const spriteLooksTrigger = useCallback(async (func) => {
        if (['say', 'think'].includes(func.what)) {
            makeSpriteSpeak({ act: func.what, speakWhat: func.default });
            if (func.timed)
                makeSpriteSpeak(await speakTrigger(func.time));
        } else {
            const currentSpriteSize = currentExecutionState?.size || sprites[runningSprite]?.size || 1;
            const newSize = resizeTrigger(currentSpriteSize, func.definite, func.to);
            
            // During execution, only update execution state
            if (currentExecutionState) {
                executionStateRef.current = { ...executionStateRef.current, size: newSize };
                setCurrentExecutionState(prev => ({ ...prev, size: newSize }));
                resizeSprite(newSize);
            } else {
                // If no execution state (single block click), update sprite directly
                resizeSprite(newSize);
            }
        }
    }, [sprites, runningSprite, currentExecutionState, resizeSprite]);
    /**
     * Returns a promise that resolves to the next index in a run loop after a short delay.
     * @param {number} i
     * @returns {Promise<number>}
     */
    const getNextInRunLoop = useCallback(i => {
        return new Promise(resolve => {
            setTimeout(() => { resolve(i + 1); }, 50);
        });
    }, []);
    /**
     * Triggers control blocks (wait, repeat, forever) for the sprite.
     * @param {object} func
     */
    const spriteControlTrigger = useCallback(async (func) => {
        if (func.what === 'wait')
            await waitForSprite(func.for);
        else if (func.what === 'forever')
            while (JSON.parse(sessionStorage.getItem('run')))
                await runByBlockClick(func.actionData, true);
        else {
            for (let i = 0; i < func.times;) {
                await runByBlockClick(func.actionData, true);
                i = await getNextInRunLoop(i);
            }
        }
    }, [getNextInRunLoop]);
    /**
     * Determines the type of block and triggers the appropriate handler.
     * @param {object} func
     * @param {boolean} checkRun
     */
    const checkWhatAndRun = useCallback(async (func, checkRun) => {
        if (categories[0].subTypes.includes(func.what)) // motion
            spriteMotionTrigger(func, checkRun);
        else if (categories[1].subTypes.includes(func.what)) // looks
            await spriteLooksTrigger(func);
        else if (categories[3].subTypes.includes(func.what)) // control
            await spriteControlTrigger(func);
    }, [spriteMotionTrigger, spriteLooksTrigger, spriteControlTrigger]);
    /**
     * Runs a sequence of blocks, optionally in repeat mode.
     * @param {Array} block - Array of block objects to run
     * @param {boolean} repeat - Whether this is a repeat/looped run
     */
    const runByBlockClick = useCallback(async (block, repeat, all = false) => {
        if (all) {
            const runPromises = sprites.map((sprite, index) => {
                const singleSpriteBlockRun = async () => {
                    let executionState = {
                        position: sprite.position,
                        size: sprite.size
                    };
    
                    for (let i = 0; i < block.length;) {
                        const func = block[i];
                        
                        // Motion
                        if (categories[0].subTypes.includes(func.what)) {
                            let newPos;
                            if (func.what === 'move')
                                newPos = moveTrigger(executionState.position, func.options.dir, func.options.units);
                            else if (func.what === 'turn')
                                newPos = turnTrigger(executionState.position, func.options);
                            else
                                newPos = gotoTrigger(executionState.position, func.options);
                            executionState.position = newPos;
                        } 
                        // Looks
                        else if (categories[1].subTypes.includes(func.what)) {
                            if (['say', 'think'].includes(func.what)) {
                                makeSpriteSpeak({ act: func.what, speakWhat: func.default }, index);
                                if (func.timed) {
                                    setTimeout(() => makeSpriteSpeak(null, index), func.time * 1000);
                                }
                            } else {
                                const newSize = resizeTrigger(executionState.size, func.definite, func.to);
                                executionState.size = newSize;
                            }
                        }
                        // Control
                        else if (categories[3].subTypes.includes(func.what)) {
                            if (func.what === 'wait') {
                                await new Promise(resolve => setTimeout(resolve, func.for * 1000));
                            }
                        }
                        
                        i = await getNextInRunLoop(i);
                    }
    
                    return { index, finalState: executionState };
                };
                return singleSpriteBlockRun();
            });
    
            triggerRun();
            const results = await Promise.all(runPromises);
            setSprites(prevSprites => {
                const newSprites = [...prevSprites];
                results.forEach(({ index, finalState }) => {
                    newSprites[index] = {
                        ...newSprites[index],
                        position: finalState.position,
                        size: finalState.size,
                    };
                });
                return newSprites;
            });
            stopRun();
            return;
        }

        let executionState = null;
        
        if (!repeat) {
            triggerRun();
            // Initialize execution state with current sprite state
            const currentSprite = sprites[runningSprite] || sprites[0];
            executionState = {
                position: currentSprite.position,
                size: currentSprite.size
            };
            executionStateRef.current = executionState;
            setCurrentExecutionState(executionState);
        }
        if (repeat && !JSON.parse(sessionStorage.getItem('run')))
            return;
        let func = null;
        let checkRun = repeat;
        for (let i = 0; i < block.length;) {
            if (i === 5)
                checkRun = true;
            func = block[i];
            await checkWhatAndRun(func, checkRun);
            i = await getNextInRunLoop(i);
        }
        if (!repeat) {
            stopRun();
            // Sync final execution state to visual sprite
            if (executionStateRef.current) {
                const finalState = executionStateRef.current;
                updateSpritePos(finalState.position, false, runningSprite);
                setSprites(sprites => sprites.map((sprite, index) => 
                    index === runningSprite ? { 
                        ...sprite, 
                        position: finalState.position,
                        size: finalState.size 
                    } : sprite
                ));
            }
            // Clear execution state
            executionStateRef.current = null;
            setCurrentExecutionState(null);
        }
    }, [checkWhatAndRun, getNextInRunLoop, sprites, runningSprite, updateSpritePos]);

    // --- Memoize context value ---
    /**
     * Context value for sprite actions, provided to child components.
     */
    const spriteActionsContextValue = useMemo(() => ({
        spriteMotionTrigger: (func) => spriteMotionTrigger(func),
        spriteLooksTrigger: (func) => spriteLooksTrigger(func),
        pickBlock: (block) => pickBlock(block),
        initializeBlockPos: (xPos, yPos) => initializeBlockPos(xPos, yPos)
    }), [spriteMotionTrigger, spriteLooksTrigger]);

    return (
        <div className="bg-blue-100 font-sans h-screen">
            <div className="h-10 flex flex-row items-center">
                <div className="self-stretch mt-1 items-center">
                    <button type="button" className={`h-full px-3 rounded-t-lg border-t-2
                        border-r-2 flex flex-row items-center ${section == 0 ? 'text-purple-500' : 'text-gray-400'}
                        ${section == 0 ? 'bg-white' : 'bg-gray-100'}`}
                        onClick={() => changeSection(0)}>
                        <Icon name="code" size={15} className="mr-1" />
                        <span className="font-semibold text-sm">Code</span>
                    </button>
                </div>
                <div className="self-stretch mt-1 items-center">
                    <button type="button" className={`h-full px-3 rounded-t-lg border-t-2
                        border-r-2 flex flex-row items-center ${section == 1 ? 'text-purple-500' : 'text-gray-400'}
                        ${section == 1 ? 'bg-white' : 'bg-gray-100'}`}
                        onClick={() => changeSection(1)}>
                        <Icon name="paint-brush" size={15} className="mr-1" />
                        <span className="font-semibold text-sm">Costume</span>
                    </button>
                </div>
                <div className="self-stretch mt-1 items-center">
                    <button type="button" className={`h-full px-3 rounded-t-lg border-t-2
                        border-r-2 flex flex-row items-center ${section == 2 ? 'text-purple-500' : 'text-gray-400'}
                        ${section == 2 ? 'bg-white' : 'bg-gray-100'}`}
                        onClick={() => changeSection(2)}>
                        <Icon name="stream" size={15} className="mr-1" />
                        <span className="font-semibold text-sm">Replay</span>
                    </button>
                </div>
                
                {[0, 2].includes(section) &&
                <div className="ml-auto mr-5 cursor-pointer" onClick={() => {
                        if(section == 0) {
                            triggerRun()
                            setRunningSprite(activeSprite); // Set running sprite for flag click
                            setFlagClicked(true)
                        }
                        else
                            runByBlockClick(replayList[replayId], false)
                    }}>
                    <Icon name="flag" className="text-green-600" />
                </div>}
                {[0, 2].includes(section) &&
                <div className="mr-12 cursor-pointer" onClick={stopRun}>
                    <Icon name="stop" className="text-red-600" />
                </div>}
            </div>
            {section == 0 ?
            <div className="playground flex flex-row" onMouseMove={event => handleBlockMove(event)}
                onMouseUp={() => handleBlockReleaseOutsideDrop()}>
                <div className="flex-1 overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-r-xl mr-1">
                    <SpriteActionsContext.Provider value={spriteActionsContextValue}>
                        <Sidebar />
                        <MidArea block={block} combinations={combinations}
                            createCombination={combination => createCombination(combination)}
                            pinTheCombination={combination => pinTheCombination(combination)}
                            pickBlock={block => pickBlock(block)}
                            releasePinOnCombination={combo => releasePinOnCombination(combo)}
                            runByBlockClick={(block, repeat, all) => {
                                setRunningSprite(activeSprite); 
                                runByBlockClick(block, repeat, all);
                            }} />
                    </SpriteActionsContext.Provider>
                </div>
                <div className="w-1/3 overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-l-xl ml-1">
                    <PreviewArea 
                        costumes={costumes} 
                        sprites={sprites}
                        activeSprite={activeSprite}
                        updateSpritePos={(to, checkRun, spriteIndex) => updateSpritePos(to, checkRun, spriteIndex)}
                        clickTheSprite={(spriteIndex) => clickTheSprite(spriteIndex)}
                        pinTheSprite={(should, spriteIndex) => pinTheSprite(should, spriteIndex)}
                        addSprite={(costumeIndex) => addSprite(costumeIndex)}
                        removeSprite={(spriteIndex) => removeSprite(spriteIndex)}
                        selectActiveSprite={(spriteIndex) => selectActiveSprite(spriteIndex)} />
                </div>
                {block != null &&
                    <div className="absolute" style={{
                        top: blockAt.y + 2,
                        left: blockAt.x + 2,
                    }}>
                        <DragBlock block={block} />
                    </div>}
            </div> : (section == 1 ?
            <div className="playground flex flex-row">
                <div className="flex-1 h-full overflow-auto flex flex-row bg-white border-t border-r border-gray-200 rounded-r-xl mr-4">
                    <CostumeArea 
                        costumes={costumes} 
                        addCostume={newCostume => addCostume(newCostume)}
                        inUse={inUse} 
                        changeCostume={to => changeCostume(to)}
                        activeSprite={activeSprite} 
                        addSprite={(costumeIndex) => addSprite(costumeIndex)} />
                </div>
            </div> :
            <div className="playground flex flex-row">
                <div className="flex-1 h-full overflow-auto flex flex-row bg-white border-t border-r border-gray-200 rounded-r-xl mr-1">
                    <ReplayArea replayList={replayList} replayId={replayId}
                        updateReplayId={id => updateReplayId(id)} />
                </div>
                <div className="w-1/3 overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-l-xl ml-1">
                    <PreviewArea 
                        costumes={costumes} 
                        sprites={sprites}
                        activeSprite={activeSprite}
                        updateSpritePos={(to, checkRun, spriteIndex) => updateSpritePos(to, checkRun, spriteIndex)}
                        clickTheSprite={(spriteIndex) => clickTheSprite(spriteIndex)}
                        pinTheSprite={(should, spriteIndex) => pinTheSprite(should, spriteIndex)}
                        addSprite={(costumeIndex) => addSprite(costumeIndex)}
                        removeSprite={(spriteIndex) => removeSprite(spriteIndex)}
                        selectActiveSprite={(spriteIndex) => selectActiveSprite(spriteIndex)} />
                </div>
            </div>)}
        </div>
    );
}

export default Editor;