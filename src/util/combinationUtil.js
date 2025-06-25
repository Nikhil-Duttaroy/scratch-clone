/**
 * Extracts the pinned (dragged) block(s) from a combination based on the given combination structure.
 * Handles both flat and nested block structures.
 *
 * @param {Object} pin - The pin object containing the block array.
 * @param {Object} combination - The combination structure with depth, idx, aim, and aimLevel.
 * @returns {Array} The extracted block(s) from the combination.
 */
export const pinnedBlockExtractor = (pin, combination) => {
    if (combination.depth.length === 0 ||
        (combination.depth.length === 1 && combination.aimLevel === 1)) {
        return pin.block.slice(combination.idx);
    }
    let block = pin.block[combination.idx];
    if (combination.depth.length === 1) {
        return block.actionData.slice(combination.aim);
    }
    let nested = getNestedBlock(block, combination.depth.slice(1));
    if (combination.aimLevel > combination.depth.length) {
        nested = nested.actionData;
    }
    return nested.slice(combination.aim);
};

/**
 * Updates the combinations array after a block has been pinned (removed) from a combination.
 * Handles both flat and nested block structures.
 *
 * @param {Array} newCombo - The current combinations array.
 * @param {Object} combination - The combination structure with depth, idx, aim, and aimLevel.
 * @returns {Array} The updated combinations array with the block removed.
 */
export const pinCombinationsUpdator = (newCombo, combination) => {
    let newCombinations = [...newCombo];

    if (combination.depth.length === 0 ||
        (combination.depth.length === 1 && combination.aimLevel === 1)) {
        if (combination.idx === 0) {
            newCombinations.splice(combination.combId, 1);
        } else {
            let modifiedCombo = { ...newCombinations[combination.combId] };
            modifiedCombo.block = modifiedCombo.block.slice(0, combination.idx);
            newCombinations[combination.combId] = modifiedCombo;
        }
        return newCombinations;
    }

    // For nested structures
    let modifiedCombo = cloneBlock(newCombinations[combination.combId]);
    let path = [combination.idx, ...combination.depth];
    let parent = modifiedCombo.block;
    for (let i = 0; i < path.length - 1; i++) {
        parent = parent[path[i]].actionData;
    }
    // Remove the block at the aim index
    parent.splice(combination.aim, 1);
    newCombinations[combination.combId] = modifiedCombo;
    return newCombinations;
};

/**
 * Inserts a block (or blocks) into a combination at the specified position and depth.
 * Handles both flat and nested block structures.
 *
 * @param {Array} currentCombos - The current combinations array.
 * @param {Object} combo - The combination structure with depth, idx, aim, and aimLevel.
 * @param {Array} block - The block(s) to insert.
 * @returns {Array} The updated combinations array with the block(s) inserted.
 */
export const updateCombinationHelper = (currentCombos, combo, block) => {
    let updatedComboList = [...currentCombos];
    let modifiedCombo = cloneBlock(updatedComboList[combo.combId]);
    let chosenCombo = modifiedCombo.block;

    if (combo.depth.length === 0 ||
        (combo.depth.length === 1 &&
            (combo.depth.length === combo.aimLevel && chosenCombo[combo.idx].actionData.length !== 0))) {
        let newChosenCombo = [
            ...chosenCombo.slice(0, combo.idx + 1),
            ...block,
            ...chosenCombo.slice(combo.idx + 1)
        ];
        modifiedCombo.block = newChosenCombo;
        updatedComboList[combo.combId] = modifiedCombo;
        return updatedComboList;
    }

    if (combo.depth.length === 1) {
        let idxActionData = chosenCombo[combo.idx].actionData;
        idxActionData = [
            ...idxActionData.slice(0, combo.aim + 1),
            ...block,
            ...idxActionData.slice(combo.aim + 1)
        ];
        chosenCombo[combo.idx].actionData = idxActionData;
        modifiedCombo.block = chosenCombo;
        updatedComboList[combo.combId] = modifiedCombo;
        return updatedComboList;
    }

    // For deeper nesting
    let path = [combo.idx, ...combo.depth];
    let parent = chosenCombo;
    for (let i = 0; i < path.length - 1; i++) {
        parent = parent[path[i]].actionData;
    }
    parent.splice(combo.aim + 1, 0, ...block);
    modifiedCombo.block = chosenCombo;
    updatedComboList[combo.combId] = modifiedCombo;
    return updatedComboList;
};

// Helper: Deep clone only the necessary parts (for blocks with possible nested actionData)
function cloneBlock(block) {
    if (Array.isArray(block)) {
        return block.map(cloneBlock);
    } else if (block && typeof block === 'object') {
        return {
            ...block,
            actionData: block.actionData ? cloneBlock(block.actionData) : undefined
        };
    }
    return block;
}

// Helper: Traverse to a nested block using a depth array
function getNestedBlock(block, depth) {
    let current = block;
    for (let i = 0; i < depth.length; i++) {
        if (!current || !current.actionData) return undefined;
        current = current.actionData[depth[i]];
    }
    return current;
}