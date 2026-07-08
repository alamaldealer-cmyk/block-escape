const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldConstraints = `    let { minGrid, maxGrid } = getConstraints(block, blocks, isGhostActive, gridSize);

    if (gameMode === 'screw' && gates.length > 0) {
        if (block.dir === 'H') {
            if (minGrid === 0) {
                const hasMatchingGate = gates.some(g => g.side === 'left' && g.index === block.y && g.color === block.color);
                if (hasMatchingGate) {
                    minGrid = -block.size;
                }
            }
            if (maxGrid === gridSize - block.size) {
                const hasMatchingGate = gates.some(g => g.side === 'right' && g.index === block.y && g.color === block.color);
                if (hasMatchingGate) {
                    maxGrid = gridSize;
                }
            }
        } else {
            if (minGrid === 0) {
                const hasMatchingGate = gates.some(g => g.side === 'top' && g.index === block.x && g.color === block.color);
                if (hasMatchingGate) {
                    minGrid = -block.size;
                }
            }
            if (maxGrid === gridSize - block.size) {
                const hasMatchingGate = gates.some(g => g.side === 'bottom' && g.index === block.x && g.color === block.color);
                if (hasMatchingGate) {
                    maxGrid = gridSize;
                }
            }
        }
    }`;

const newConstraints = `    const is2D = gameMode === 'screw';
    let constraints = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    if (is2D) {
        constraints = get2DConstraints(block, blocks, gridSize, gates || []);
    } else {
        let { minGrid, maxGrid } = getConstraints(block, blocks, isGhostActive, gridSize);
        constraints = {
            minX: block.dir === 'H' ? minGrid : block.x,
            maxX: block.dir === 'H' ? maxGrid : block.x,
            minY: block.dir === 'V' ? minGrid : block.y,
            maxY: block.dir === 'V' ? maxGrid : block.y
        };
    }`;

code = code.replace(oldConstraints, newConstraints);

const oldDragStart = `const [isEscapingAnimating, setIsEscapingAnimating] = useState(false);`;
const newDragStart = `const [isEscapingAnimating, setIsEscapingAnimating] = useState(false);
    useEffect(() => {
        if (!isEscapingAnimating) {
            x.set(block.x * cellSize);
            y.set(block.y * cellSize);
        }
    }, [block.x, block.y, cellSize, isEscapingAnimating, x, y]);`;

// Need to safely add the useEffect without breaking if we re-run
if (!code.includes('if (!isEscapingAnimating) {\\n            x.set')) {
    code = code.replace(oldDragStart, newDragStart);
}

const oldDragProps = `            drag={block.dir === 'H' ? 'x' : 'y'}
            dragConstraints={
                block.dir === 'H' 
                ? { left: minGrid * cellSize, right: maxGrid * cellSize }
                : { top: minGrid * cellSize, bottom: maxGrid * cellSize }
            }`;

const newDragProps = `            drag={is2D ? true : (block.dir === 'H' ? 'x' : 'y')}
            dragDirectionLock={is2D ? true : false}
            dragConstraints={{
                left: constraints.minX * cellSize,
                right: constraints.maxX * cellSize,
                top: constraints.minY * cellSize,
                bottom: constraints.maxY * cellSize
            }}`;

code = code.replace(oldDragProps, newDragProps);

fs.writeFileSync('src/App.tsx', code);
