const gridSize = 8;
const random = Math.random;

interface BlockData { id: number; x: number; y: number; size: number; dir: 'H'|'V'; type: string; color?: string; }
interface ScrewGate { side: 'left'|'right'|'top'|'bottom'; index: number; color: string; }

function hasOverlap(b1: any, b2: any) {
    const b1MinX = b1.x, b1MaxX = b1.dir === 'H' ? b1.x + b1.size - 1 : b1.x;
    const b1MinY = b1.y, b1MaxY = b1.dir === 'V' ? b1.y + b1.size - 1 : b1.y;
    const b2MinX = b2.x, b2MaxX = b2.dir === 'H' ? b2.x + b2.size - 1 : b2.x;
    const b2MinY = b2.y, b2MaxY = b2.dir === 'V' ? b2.y + b2.size - 1 : b2.y;
    return !(b2MaxX < b1MinX || b2MinX > b1MaxX || b2MaxY < b1MinY || b2MinY > b1MaxY);
}

function getConstraints(block: any, allBlocks: any[]) {
    let minGrid = 0;
    let maxGrid = gridSize - block.size;
    for (const other of allBlocks) {
        if (other.id === block.id) continue;
        if (block.dir === 'H' && other.dir === 'V') {
            if (other.y <= block.y && other.y + other.size - 1 >= block.y) {
                if (other.x < block.x) minGrid = Math.max(minGrid, other.x + 1);
                else maxGrid = Math.min(maxGrid, other.x - block.size);
            }
        } else if (block.dir === 'H' && other.dir === 'H') {
            if (other.y === block.y) {
                if (other.x < block.x) minGrid = Math.max(minGrid, other.x + other.size);
                else maxGrid = Math.min(maxGrid, other.x - block.size);
            }
        } else if (block.dir === 'V' && other.dir === 'H') {
            if (other.x <= block.x && other.x + other.size - 1 >= block.x) {
                if (other.y < block.y) minGrid = Math.max(minGrid, other.y + 1);
                else maxGrid = Math.min(maxGrid, other.y - block.size);
            }
        } else if (block.dir === 'V' && other.dir === 'V') {
            if (other.x === block.x) {
                if (other.y < block.y) minGrid = Math.max(minGrid, other.y + other.size);
                else maxGrid = Math.min(maxGrid, other.y - block.size);
            }
        }
    }
    return { minGrid, maxGrid };
}

function generate() {
    const blocks: any[] = [];
    const gates: any[] = [];
    const colors = ['red', 'orange', 'teal', 'blue', 'green', 'purple'];
    let colorIdx = 0;
    
    for (let i = 0; i < 10; i++) {
        let inserted = false;
        for (let attempt = 0; attempt < 50; attempt++) {
            // Try to slide existing blocks randomly to make space
            if (blocks.length > 0) {
                const b = blocks[Math.floor(random() * blocks.length)];
                const { minGrid, maxGrid } = getConstraints(b, blocks);
                if (maxGrid >= minGrid) {
                    const newPos = minGrid + Math.floor(random() * (maxGrid - minGrid + 1));
                    if (b.dir === 'H') b.x = newPos;
                    else b.y = newPos;
                }
            }

            const sizeVal = random();
            const size = sizeVal < 0.35 ? 2 : sizeVal < 0.75 ? 3 : 4;
            const side = ['left', 'right', 'top', 'bottom'][Math.floor(random() * 4)];
            const index = Math.floor(random() * gridSize);
            
            // Check if gate already exists
            if (gates.some(g => g.side === side && g.index === index)) continue;
            
            let x = 0, y = 0;
            let dir = 'H';
            if (side === 'left') { x = 0; y = index; dir = 'H'; }
            else if (side === 'right') { x = gridSize - size; y = index; dir = 'H'; }
            else if (side === 'top') { x = index; y = 0; dir = 'V'; }
            else if (side === 'bottom') { x = index; y = gridSize - size; dir = 'V'; }
            
            const newBlock = { id: 200 + i, x, y, size, dir, type: 'color', color: colors[colorIdx % colors.length] };
            
            let overlap = false;
            for (const b of blocks) if (hasOverlap(newBlock, b)) { overlap = true; break; }
            
            if (!overlap) {
                blocks.push(newBlock);
                gates.push({ side, index, color: newBlock.color });
                colorIdx++;
                inserted = true;
                break;
            }
        }
    }
    
    // Scramble fully
    for (let i=0; i<100; i++) {
        const b = blocks[Math.floor(random() * blocks.length)];
        const { minGrid, maxGrid } = getConstraints(b, blocks);
        if (maxGrid >= minGrid) {
            const newPos = minGrid + Math.floor(random() * (maxGrid - minGrid + 1));
            if (b.dir === 'H') b.x = newPos;
            else b.y = newPos;
        }
    }
    
    console.log("Generated blocks:", blocks.length);
}
generate();
