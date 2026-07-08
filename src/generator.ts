import { BlockData, LEVELS, ScrewGate, SCREW_LEVELS } from './levels';

export function getConstraints(block: BlockData, blocks: BlockData[], isGhost: boolean = false, gridSize: number = 6) {
    let minGrid = 0;
    let maxGrid = gridSize - block.size;
    
    if (block.dir === 'H') {
        const obstaclesLeft: number[] = [];
        const obstaclesRight: number[] = [];

        for (let i=0; i<blocks.length; i++) {
            const b = blocks[i];
            if (b.id === block.id) continue;
            const bMinY = b.y;
            const bMaxY = b.dir === 'V' ? b.y + b.size - 1 : b.y;
            
            if (block.y >= bMinY && block.y <= bMaxY) {
                const bMinX = b.x;
                const bMaxX = b.dir === 'H' ? b.x + b.size - 1 : b.x;
                
                if (bMaxX < block.x) {
                    obstaclesLeft.push(bMaxX + 1);
                } else if (bMinX > block.x) {
                    obstaclesRight.push(bMinX - block.size);
                }
            }
        }

        if (obstaclesLeft.length > 0) {
            obstaclesLeft.sort((a, b) => b - a); // Closest first
            if (isGhost) {
                // Skip one obstacle
                minGrid = obstaclesLeft.length > 1 ? obstaclesLeft[1] : 0;
            } else {
                minGrid = obstaclesLeft[0];
            }
        }

        if (obstaclesRight.length > 0) {
            obstaclesRight.sort((a, b) => a - b); // Closest first
            if (isGhost) {
                // Skip one obstacle
                maxGrid = obstaclesRight.length > 1 ? obstaclesRight[1] : gridSize - block.size;
            } else {
                maxGrid = obstaclesRight[0];
            }
        }
    } else {
        const obstaclesAbove: number[] = [];
        const obstaclesBelow: number[] = [];

        for (let i=0; i<blocks.length; i++) {
            const b = blocks[i];
            if (b.id === block.id) continue;
            const bMinX = b.x;
            const bMaxX = b.dir === 'H' ? b.x + b.size - 1 : b.x;
            
            if (block.x >= bMinX && block.x <= bMaxX) {
                const bMinY = b.y;
                const bMaxY = b.dir === 'V' ? b.y + b.size - 1 : b.y;
                
                if (bMaxY < block.y) {
                    obstaclesAbove.push(bMaxY + 1);
                } else if (bMinY > block.y) {
                    obstaclesBelow.push(bMinY - block.size);
                }
            }
        }

        if (obstaclesAbove.length > 0) {
            obstaclesAbove.sort((a, b) => b - a);
            if (isGhost) {
                minGrid = obstaclesAbove.length > 1 ? obstaclesAbove[1] : 0;
            } else {
                minGrid = obstaclesAbove[0];
            }
        }

        if (obstaclesBelow.length > 0) {
            obstaclesBelow.sort((a, b) => a - b);
            if (isGhost) {
                maxGrid = obstaclesBelow.length > 1 ? obstaclesBelow[1] : gridSize - block.size;
            } else {
                maxGrid = obstaclesBelow[0];
            }
        }
    }
    return { minGrid, maxGrid };
}

export function solve(blocks: BlockData[]): number {
    const targetId = blocks.find(b => b.type === 'target')?.id;
    if (!targetId) return -1;
    const targetIndex = blocks.findIndex(b => b.id === targetId);

    const initialState = blocks.map(b => b.dir === 'H' ? b.x : b.y);
    let queue: { state: number[], depth: number }[] = [{ state: initialState, depth: 0 }];
    const visited = new Set<string>();
    visited.add(initialState.join(','));

    let iterations = 0;
    let head = 0; // use index instead of shift for performance

    const tempBlocks = blocks.map(b => ({ ...b }));

    while (head < queue.length && iterations < 3000) {
        iterations++;
        const { state, depth } = queue[head++];

        // Target reached x = 4 (for size 2 block in 6x6 grid)
        if (state[targetIndex] === 4) return depth;

        for (let i = 0; i < tempBlocks.length; i++) {
            if (tempBlocks[i].dir === 'H') tempBlocks[i].x = state[i];
            else tempBlocks[i].y = state[i];
        }

        for (let i = 0; i < tempBlocks.length; i++) {
            const b = tempBlocks[i];
            const { minGrid, maxGrid } = getConstraints(b, tempBlocks);
            for (let pos = minGrid; pos <= maxGrid; pos++) {
                if (pos !== state[i]) {
                    const newState = [...state];
                    newState[i] = pos;
                    const key = newState.join(',');
                    if (!visited.has(key)) {
                        visited.add(key);
                        queue.push({ state: newState, depth: depth + 1 });
                    }
                }
            }
        }
    }
    return -1;
}

export function generateLevel(levelNum: number): { blocks: BlockData[], maxMoves: number, minMoves: number } {
    if (levelNum < LEVELS.length) {
        const staticBlocks = JSON.parse(JSON.stringify(LEVELS[levelNum].blocks));
        const minM = solve(staticBlocks);
        return {
            blocks: staticBlocks,
            minMoves: minM,
            maxMoves: minM + 3 + Math.floor(levelNum * 0.5)
        };
    }

    let seed = levelNum * 99991 + 12345;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const targetDifficulty = Math.min(8 + Math.floor(levelNum * 1.5), 35);
    
    let bestBlocks: BlockData[] = [];
    let bestMoves = -1;

    for (let tries = 0; tries < 45; tries++) {
        let blocks: BlockData[] = [{ id: 1, x: 4, y: 2, size: 2, dir: 'H', type: 'target' }];
        const numObstacles = Math.min(14, 7 + Math.floor(levelNum / 2));
        
        for(let i=0; i<numObstacles; i++) {
            let attempts = 0;
            while(attempts < 15) {
                attempts++;
                const size = random() > 0.75 ? 3 : 2;
                const dir = random() > 0.5 ? 'H' : 'V';
                const x = Math.floor(random() * (dir === 'H' ? 7 - size : 6));
                const y = Math.floor(random() * (dir === 'V' ? 7 - size : 6));
                
                if (y === 2 && dir === 'V' && x > 4) continue; 
                if (y === 2 && dir === 'H') continue;
                
                let overlap = false;
                for (const b of blocks) {
                    const bMinX = b.x, bMaxX = b.dir === 'H' ? b.x + b.size - 1 : b.x;
                    const bMinY = b.y, bMaxY = b.dir === 'V' ? b.y + b.size - 1 : b.y;
                    const newMinX = x, newMaxX = dir === 'H' ? x + size - 1 : x;
                    const newMinY = y, newMaxY = dir === 'V' ? y + size - 1 : y;
                    if (!(newMaxX < bMinX || newMinX > bMaxX || newMaxY < bMinY || newMinY > bMaxY)) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    blocks.push({ id: i+2, x, y, size, dir, type: 'obstacle' });
                    break;
                }
            }
        }

        const shuffleSteps = 30 + levelNum * 5;
        for(let s=0; s<shuffleSteps; s++) {
            const allMoves: {id: number, pos: number}[] = [];
            for (const b of blocks) {
                const { minGrid, maxGrid } = getConstraints(b, blocks);
                const curr = b.dir === 'H' ? b.x : b.y;
                for (let pos = minGrid; pos <= maxGrid; pos++) {
                    if (pos !== curr) {
                        let weight = 1;
                        if (b.type === 'target' && pos < curr) weight = 5; 
                        for (let w=0; w<weight; w++) allMoves.push({ id: b.id, pos });
                    }
                }
            }
            if (allMoves.length > 0) {
                const move = allMoves[Math.floor(random() * allMoves.length)];
                const block = blocks.find(b => b.id === move.id)!;
                if (block.dir === 'H') block.x = move.pos;
                else block.y = move.pos;
            }
        }
        
        const target = blocks.find(b => b.type === 'target')!;
        if (target.x <= 3) {
            const moves = solve(blocks);
            if (moves > bestMoves) {
                bestMoves = moves;
                bestBlocks = blocks.map(b => ({...b}));
            }
            if (bestMoves >= targetDifficulty) {
                break; // Found a hard enough level
            }
        }
    }
    
    // In case logic breaks or difficulty is unreachable after tries
    if (bestMoves === -1) {
        bestBlocks = [{ id: 1, x: 0, y: 2, size: 2, dir: 'H', type: 'target' }];
        bestMoves = 4;
    }

    // Exact required moves + tight margin (rewards thinking rather than random sliding)
    const margin = Math.max(0, 2 - Math.floor(levelNum / 5));
    const maxMoves = bestMoves + margin;
    
    return { blocks: bestBlocks, maxMoves, minMoves: bestMoves };
}

export function generateScrewLevel(levelNum: number, gridSize: number = 8): { blocks: BlockData[], gates: ScrewGate[], maxMoves: number, minMoves: number } {
    if (levelNum < SCREW_LEVELS.length) {
        const staticLevel = JSON.parse(JSON.stringify(SCREW_LEVELS[levelNum]));
        return {
            blocks: staticLevel.blocks,
            gates: staticLevel.gates,
            maxMoves: staticLevel.maxMoves,
            minMoves: staticLevel.minMoves
        };
    }

    let seed = levelNum * 4321 + 8888;
    const random = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    const colors: ('red' | 'orange' | 'teal' | 'blue' | 'green' | 'purple')[] = ['red', 'orange', 'teal', 'blue', 'green', 'purple'];
    
    // Seeded shuffle of colors
    const shuffledColors = [...colors];
    for (let i = shuffledColors.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        const temp = shuffledColors[i];
        shuffledColors[i] = shuffledColors[j];
        shuffledColors[j] = temp;
    }

    // Determine how many unique colors (gates) to use in this level
    // 2 colors for levels <= 8, 3 colors for levels <= 15, 4 colors for levels > 15 (max 4 colors, up to 5 on extreme levels)
    let numUniqueColors = 2;
    if (levelNum > 15) {
        numUniqueColors = 4;
    } else if (levelNum > 8) {
        numUniqueColors = 3;
    }
    numUniqueColors = Math.min(numUniqueColors, colors.length);

    // Determine tiles per color
    // 3 tiles per color as requested by the user
    const tilesPerColor = 3;

    const blocks: BlockData[] = [];
    const gates: ScrewGate[] = [];

    // Place exactly one gate for each of the selected colors
    const usedGatePositions = new Set<string>();

    for (let c = 0; c < numUniqueColors; c++) {
        const color = shuffledColors[c];
        
        let placedGate = false;
        for (let attempt = 0; attempt < 100; attempt++) {
            const sides: ('left'|'right'|'top'|'bottom')[] = ['left', 'right', 'top', 'bottom'];
            const side = sides[Math.floor(random() * 4)];
            const index = 1 + Math.floor(random() * (gridSize - 2));
            const key = `${side}-${index}`;
            
            if (usedGatePositions.has(key)) continue;
            
            usedGatePositions.add(key);
            gates.push({ side, index, color });
            placedGate = true;
            break;
        }
        
        if (!placedGate) {
            for (let idx = 1; idx < gridSize - 1; idx++) {
                if (!usedGatePositions.has(`left-${idx}`)) {
                    usedGatePositions.add(`left-${idx}`);
                    gates.push({ side: 'left', index: idx, color });
                    break;
                }
            }
        }
    }

    const hasOverlap = (b1: BlockData, b2: BlockData) => {
        const b1W = b1.dir === 'H' ? b1.size : 1;
        const b1H = b1.dir === 'V' ? b1.size : 1;
        const b2W = b2.dir === 'H' ? b2.size : 1;
        const b2H = b2.dir === 'V' ? b2.size : 1;

        return !(
            b2.x + b2W <= b1.x ||
            b2.x >= b1.x + b1W ||
            b2.y + b2H <= b1.y ||
            b2.y >= b1.y + b1H
        );
    };

    let blockIdCounter = 200;

    // Place multiple tiles for each color
    for (const gate of gates) {
        let placedCount = 0;
        for (let attempt = 0; attempt < 500 && placedCount < tilesPerColor; attempt++) {
            const size = random() < 0.6 ? 2 : 3;
            const dir: 'H' | 'V' = random() < 0.5 ? 'H' : 'V';
            
            const maxValX = gridSize - (dir === 'H' ? size : 1);
            const maxValY = gridSize - (dir === 'V' ? size : 1);
            
            const x = Math.floor(random() * (maxValX + 1));
            const y = Math.floor(random() * (maxValY + 1));

            const newBlock: BlockData = {
                id: blockIdCounter++,
                x, y,
                size, dir,
                type: 'color',
                color: gate.color
            };

            let overlap = false;
            for (const b of blocks) {
                if (hasOverlap(newBlock, b)) { overlap = true; break; }
            }

            if (!overlap) {
                blocks.push(newBlock);
                placedCount++;
            }
        }
    }

    // Place random grey obstacles to make the level difficult
    const numObstacles = Math.min(6, 2 + Math.floor(levelNum / 5));
    for (let i = 0; i < numObstacles; i++) {
        for (let attempt = 0; attempt < 500; attempt++) {
            const size = random() < 0.7 ? 2 : 3;
            const dir: 'H' | 'V' = random() < 0.5 ? 'H' : 'V';

            const maxValX = gridSize - (dir === 'H' ? size : 1);
            const maxValY = gridSize - (dir === 'V' ? size : 1);

            const x = Math.floor(random() * (maxValX + 1));
            const y = Math.floor(random() * (maxValY + 1));

            const newBlock: BlockData = {
                id: 300 + i,
                x, y,
                size, dir,
                type: 'obstacle'
            };

            let overlap = false;
            for (const b of blocks) {
                if (hasOverlap(newBlock, b)) { overlap = true; break; }
            }

            if (!overlap) {
                blocks.push(newBlock);
                break;
            }
        }
    }

    if (blocks.length === 0) {
        blocks.push({ id: 200, x: 2, y: 2, size: 2, dir: 'H', type: 'color', color: 'red' });
        gates.push({ side: 'left', index: 2, color: 'red' });
    }

    // Scramble using strictly valid 2D movements
    const scrambleSteps = 250 + levelNum * 15;
    for (let step = 0; step < scrambleSteps; step++) {
        const b = blocks[Math.floor(random() * blocks.length)];
        const constraints = getScrewConstraints(b, blocks, gridSize, gates, true);
        
        const validMoves: { x: number, y: number }[] = [];
        
        for (let xPos = constraints.minX; xPos <= constraints.maxX; xPos++) {
            if (xPos !== b.x) {
                validMoves.push({ x: xPos, y: b.y });
            }
        }
        
        for (let yPos = constraints.minY; yPos <= constraints.maxY; yPos++) {
            if (yPos !== b.y) {
                validMoves.push({ x: b.x, y: yPos });
            }
        }

        if (validMoves.length > 0) {
            const chosenMove = validMoves[Math.floor(random() * validMoves.length)];
            b.x = chosenMove.x;
            b.y = chosenMove.y;
        }
    }

    const maxMoves = 40 + Math.floor(levelNum * 2);
    return {
        blocks,
        gates,
        maxMoves,
        minMoves: Math.ceil(maxMoves / 2.5)
    };
}

export function getScrewConstraints(
    block: BlockData, 
    blocks: BlockData[], 
    gridSize: number = 8, 
    gates: ScrewGate[] = [], 
    isScrambling: boolean = false
) {
    // 1D Constraints (used for classic mode)
    let minGrid = 0;
    let maxGrid = gridSize - block.size;

    if (block.dir === 'H') {
        const obstaclesLeft: number[] = [];
        const obstaclesRight: number[] = [];

        for (let i = 0; i < blocks.length; i++) {
            const b = blocks[i];
            if (b.id === block.id) continue;
            
            const bMinY = b.y;
            const bMaxY = b.dir === 'V' ? b.y + b.size - 1 : b.y;
            
            if (block.y >= bMinY && block.y <= bMaxY) {
                const bMinX = b.x;
                const bMaxX = b.dir === 'H' ? b.x + b.size - 1 : b.x;
                
                if (bMaxX < block.x) {
                    obstaclesLeft.push(bMaxX + 1);
                } else if (bMinX > block.x) {
                    obstaclesRight.push(bMinX - block.size);
                }
            }
        }

        if (obstaclesLeft.length > 0) {
            obstaclesLeft.sort((a, b) => b - a);
            minGrid = obstaclesLeft[0];
        }
        if (obstaclesRight.length > 0) {
            obstaclesRight.sort((a, b) => a - b);
            maxGrid = obstaclesRight[0];
        }
    } else {
        const obstaclesAbove: number[] = [];
        const obstaclesBelow: number[] = [];

        for (let i = 0; i < blocks.length; i++) {
            const b = blocks[i];
            if (b.id === block.id) continue;
            
            const bMinX = b.x;
            const bMaxX = b.dir === 'H' ? b.x + b.size - 1 : b.x;
            
            if (block.x >= bMinX && block.x <= bMaxX) {
                const bMinY = b.y;
                const bMaxY = b.dir === 'V' ? b.y + b.size - 1 : b.y;
                
                if (bMaxY < block.y) {
                    obstaclesAbove.push(bMaxY + 1);
                } else if (bMinY > block.y) {
                    obstaclesBelow.push(bMinY - block.size);
                }
            }
        }

        if (obstaclesAbove.length > 0) {
            obstaclesAbove.sort((a, b) => b - a);
            minGrid = obstaclesAbove[0];
        }
        if (obstaclesBelow.length > 0) {
            obstaclesBelow.sort((a, b) => a - b);
            maxGrid = obstaclesBelow[0];
        }
    }

    // 2D Constraints (used for screw mode)
    const blockW = block.dir === 'H' ? block.size : 1;
    const blockH = block.dir === 'V' ? block.size : 1;

    let minX = 0;
    let maxX = gridSize - blockW;
    let minY = 0;
    let maxY = gridSize - blockH;

    for (const other of blocks) {
        if (other.id === block.id) continue;
        
        const otherW = other.dir === 'H' ? other.size : 1;
        const otherH = other.dir === 'V' ? other.size : 1;

        // X movement (Y is constant)
        if (other.y <= block.y + blockH - 1 && other.y + otherH - 1 >= block.y) {
            if (other.x > block.x) {
                maxX = Math.min(maxX, other.x - blockW);
            } else if (other.x < block.x) {
                minX = Math.max(minX, other.x + otherW);
            }
        }
        
        // Y movement (X is constant)
        if (other.x <= block.x + blockW - 1 && other.x + otherW - 1 >= block.x) {
            if (other.y > block.y) {
                maxY = Math.min(maxY, other.y - blockH);
            } else if (other.y < block.y) {
                minY = Math.max(minY, other.y + otherH);
            }
        }
    }

    // Escape gate checks for 2D mode
    if (block.type === 'color' && !isScrambling) {
        if (minX === 0) {
            const hasLeftGate = gates.some(g => g.side === 'left' && g.color === block.color && g.index >= block.y && g.index <= block.y + blockH - 1);
            if (hasLeftGate && block.dir === 'H') {
                minX = -block.size;
            }
        }
        if (maxX === gridSize - blockW) {
            const hasRightGate = gates.some(g => g.side === 'right' && g.color === block.color && g.index >= block.y && g.index <= block.y + blockH - 1);
            if (hasRightGate && block.dir === 'H') {
                maxX = gridSize;
            }
        }
        if (minY === 0) {
            const hasTopGate = gates.some(g => g.side === 'top' && g.color === block.color && g.index >= block.x && g.index <= block.x + blockW - 1);
            if (hasTopGate && block.dir === 'V') {
                minY = -block.size;
            }
        }
        if (maxY === gridSize - blockH) {
            const hasBottomGate = gates.some(g => g.side === 'bottom' && g.color === block.color && g.index >= block.x && g.index <= block.x + blockW - 1);
            if (hasBottomGate && block.dir === 'V') {
                maxY = gridSize;
            }
        }
    }

    return { minGrid, maxGrid, minX, maxX, minY, maxY };
}
