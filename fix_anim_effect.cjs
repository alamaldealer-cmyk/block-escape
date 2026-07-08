const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffect = `    useEffect(() => {
        if (isEscapingAnimating) return;
        if (block.dir === 'H') {
            const isEscaped = hasWon && (block.x < 0 || block.x > gridSize - block.size);
            const targetX = (hasWon && block.type === 'target') ? (cellSize * (gridSize + 1.5)) : isEscaped ? (block.x < 0 ? -cellSize * block.size : cellSize * (gridSize + 1.5)) : block.x * cellSize;
            const transition = (hasWon && (block.type === 'target' || isEscaped)) ? { duration: 1.2, ease: "easeIn" } : { type: 'spring', bounce: 0, duration: 0.2 };
            animate(x, targetX as any, transition as any);
        }
        if (block.dir === 'V') {
            const isEscaped = hasWon && (block.y < 0 || block.y > gridSize - block.size);
            const targetY = isEscaped ? (block.y < 0 ? -cellSize * block.size : cellSize * (gridSize + 1.5)) : block.y * cellSize;
            const transition = (hasWon && isEscaped) ? { duration: 1.2, ease: "easeIn" } : { type: 'spring', bounce: 0, duration: 0.2 };
            animate(y, targetY as any, transition as any);
        }
    }, [block.x, block.y, cellSize, block.dir, x, y, hasWon, block.type, gridSize, isEscapingAnimating]);`;

const newEffect = `    useEffect(() => {
        if (isEscapingAnimating) return;
        if (is2D) {
             animate(x, block.x * cellSize, { type: 'spring', bounce: 0, duration: 0.2 });
             animate(y, block.y * cellSize, { type: 'spring', bounce: 0, duration: 0.2 });
             return;
        }
        if (block.dir === 'H') {
            const isEscaped = hasWon && (block.x < 0 || block.x > gridSize - block.size);
            const targetX = (hasWon && block.type === 'target') ? (cellSize * (gridSize + 1.5)) : isEscaped ? (block.x < 0 ? -cellSize * block.size : cellSize * (gridSize + 1.5)) : block.x * cellSize;
            const transition = (hasWon && (block.type === 'target' || isEscaped)) ? { duration: 1.2, ease: "easeIn" } : { type: 'spring', bounce: 0, duration: 0.2 };
            animate(x, targetX as any, transition as any);
        }
        if (block.dir === 'V') {
            const isEscaped = hasWon && (block.y < 0 || block.y > gridSize - block.size);
            const targetY = isEscaped ? (block.y < 0 ? -cellSize * block.size : cellSize * (gridSize + 1.5)) : block.y * cellSize;
            const transition = (hasWon && isEscaped) ? { duration: 1.2, ease: "easeIn" } : { type: 'spring', bounce: 0, duration: 0.2 };
            animate(y, targetY as any, transition as any);
        }
    }, [block.x, block.y, cellSize, block.dir, x, y, hasWon, block.type, gridSize, isEscapingAnimating, is2D]);`;

code = code.replace(oldEffect, newEffect);

fs.writeFileSync('src/App.tsx', code);
