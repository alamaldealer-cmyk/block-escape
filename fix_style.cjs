const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldStyleLogic = `    if (block.dir === 'H') {
        style.width = block.size * cellSize;
        style.height = cellSize;
        style.left = 0;
        style.top = block.y * cellSize;
        style.x = x as any;
    } else {
        style.width = cellSize;
        style.height = block.size * cellSize;
        style.left = block.x * cellSize;
        style.top = 0;
        style.y = y as any;
    }`;

const newStyleLogic = `    if (is2D) {
        style.width = block.dir === 'H' ? block.size * cellSize : cellSize;
        style.height = block.dir === 'V' ? block.size * cellSize : cellSize;
        style.left = 0;
        style.top = 0;
        style.x = x as any;
        style.y = y as any;
    } else {
        if (block.dir === 'H') {
            style.width = block.size * cellSize;
            style.height = cellSize;
            style.left = 0;
            style.top = block.y * cellSize;
            style.x = x as any;
        } else {
            style.width = cellSize;
            style.height = block.size * cellSize;
            style.left = block.x * cellSize;
            style.top = 0;
            style.y = y as any;
        }
    }`;

code = code.replace(oldStyleLogic, newStyleLogic);

fs.writeFileSync('src/App.tsx', code);
