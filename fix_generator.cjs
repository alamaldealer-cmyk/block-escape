const fs = require('fs');
let code = fs.readFileSync('src/generator.ts', 'utf8');

const newConstraintsFunc = `
export const get2DConstraints = (block: BlockData, allBlocks: BlockData[], gridSize: number, gates: ScrewGate[]) => {
    let minX = 0;
    let maxX = gridSize - (block.dir === 'H' ? block.size : 1);
    let minY = 0;
    let maxY = gridSize - (block.dir === 'V' ? block.size : 1);

    const blockW = block.dir === 'H' ? block.size : 1;
    const blockH = block.dir === 'V' ? block.size : 1;

    for (const other of allBlocks) {
        if (other.id === block.id) continue;
        
        const otherW = other.dir === 'H' ? other.size : 1;
        const otherH = other.dir === 'V' ? other.size : 1;

        // X movement (Y is constant = block.y)
        // Check Y overlap
        if (other.y <= block.y + blockH - 1 && other.y + otherH - 1 >= block.y) {
            if (other.x > block.x) {
                maxX = Math.min(maxX, other.x - blockW);
            } else if (other.x < block.x) {
                minX = Math.max(minX, other.x + otherW);
            }
        }
        
        // Y movement (X is constant = block.x)
        // Check X overlap
        if (other.x <= block.x + blockW - 1 && other.x + otherW - 1 >= block.x) {
            if (other.y > block.y) {
                maxY = Math.min(maxY, other.y - blockH);
            } else if (other.y < block.y) {
                minY = Math.max(minY, other.y + otherH);
            }
        }
    }

    if (block.type === 'color' && gates.length > 0) {
        // X escapes
        if (minX === 0) {
            const canEscapeLeft = gates.some(g => g.side === 'left' && g.color === block.color && g.index >= block.y && g.index <= block.y + blockH - 1);
            if (canEscapeLeft) minX = -blockW;
        }
        if (maxX === gridSize - blockW) {
            const canEscapeRight = gates.some(g => g.side === 'right' && g.color === block.color && g.index >= block.y && g.index <= block.y + blockH - 1);
            if (canEscapeRight) maxX = gridSize;
        }
        // Y escapes
        if (minY === 0) {
            const canEscapeTop = gates.some(g => g.side === 'top' && g.color === block.color && g.index >= block.x && g.index <= block.x + blockW - 1);
            if (canEscapeTop) minY = -blockH;
        }
        if (maxY === gridSize - blockH) {
            const canEscapeBottom = gates.some(g => g.side === 'bottom' && g.color === block.color && g.index >= block.x && g.index <= block.x + blockW - 1);
            if (canEscapeBottom) maxY = gridSize;
        }
    }

    return { minX, maxX, minY, maxY };
};
`;

code = code + newConstraintsFunc;

// Now modify the scramble part of generateScrewLevel
code = code.replace(
    /const getScrewConstraints = .*?\n    let colorIdx/s,
    `let colorIdx`
);

code = code.replace(
    /const \{ minGrid, maxGrid \} = getScrewConstraints\(b, blocks\);.*?if \(maxGrid >= minGrid\) \{.*?\}\n        \}/s,
    `const { minX, maxX, minY, maxY } = get2DConstraints(b, blocks, gridSize, gates);
        const validMoves = [];
        for(let x = minX; x <= maxX; x++) if(x !== b.x) validMoves.push({x, y: b.y});
        for(let y = minY; y <= maxY; y++) if(y !== b.y) validMoves.push({x: b.x, y});
        
        if (validMoves.length > 0) {
            const move = validMoves[Math.floor(random() * validMoves.length)];
            b.x = move.x;
            b.y = move.y;
        }`
);

fs.writeFileSync('src/generator.ts', code);
