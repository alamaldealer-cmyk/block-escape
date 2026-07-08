const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    /const x = useMotionValue\(block.dir === 'H' \? block.x \* cellSize : 0\);/g,
    "const x = useMotionValue(is2D ? block.x * cellSize : (block.dir === 'H' ? block.x * cellSize : 0));"
);

code = code.replace(
    /const y = useMotionValue\(block.dir === 'V' \? block.y \* cellSize : 0\);/g,
    "const y = useMotionValue(is2D ? block.y * cellSize : (block.dir === 'V' ? block.y * cellSize : 0));"
);

fs.writeFileSync('src/App.tsx', code);
