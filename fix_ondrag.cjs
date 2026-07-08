const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Change onMove type in BlockView props
code = code.replace(
    /onMove: \(id: number, newGrid: number\) => void,/,
    'onMove: (id: number, newX: number, newY: number) => void,'
);

// 2. Change onDragEnd logic in BlockView
const oldOnDragEnd = `            onDragEnd={(e, info) => {
                const val = block.dir === 'H' ? x.get() : y.get();
                let newGrid = Math.round(val / cellSize);
                
                let isEscapeMove = false;
                if (gameMode === 'screw') {
                    const dragValRatio = val / cellSize;
                    const maxBoardPos = gridSize - block.size;
                    
                    if (minGrid === -block.size && dragValRatio < -0.15) {
                        newGrid = -block.size;
                        isEscapeMove = true;
                    } else if (maxGrid === gridSize && dragValRatio > (maxBoardPos + 0.15)) {
                        newGrid = gridSize;
                        isEscapeMove = true;
                    }
                }
                
                newGrid = Math.max(minGrid, Math.min(newGrid, maxGrid));
                if (newGrid === -block.size || newGrid === gridSize) {
                    isEscapeMove = true;
                }
                
                if (isEscapeMove) {
                    setIsEscapingAnimating(true);
                    audio.playSlide();
                    
                    const targetVal = newGrid * cellSize;
                    const activeVal = block.dir === 'H' ? x : y;
                    
                    animate(activeVal, targetVal, {
                        type: 'tween',
                        ease: 'easeIn',
                        duration: 0.35,
                        onComplete: () => {
                            onMove(block.id, newGrid);
                        }
                    });
                } else if (newGrid !== (block.dir === 'H' ? block.x : block.y)) {
                    audio.playSlide();
                    onMove(block.id, newGrid);
                } else {
                    audio.playError();
                    if (block.dir === 'H') {
                        animate(x, block.x * cellSize, { type: 'spring', bounce: 0 });
                    } else {
                        animate(y, block.y * cellSize, { type: 'spring', bounce: 0 });
                    }
                }
            }}`;

const newOnDragEnd = `            onDragEnd={(e, info) => {
                const valX = x.get();
                const valY = y.get();
                
                let newGridX = Math.round(valX / cellSize);
                let newGridY = Math.round(valY / cellSize);
                let isEscapeMove = false;

                if (is2D) {
                    const dx = Math.abs(valX - block.x * cellSize);
                    const dy = Math.abs(valY - block.y * cellSize);
                    
                    if (dx > dy) {
                        newGridY = block.y;
                        const maxBoardPosX = gridSize - (block.dir === 'H' ? block.size : 1);
                        const dragValRatio = valX / cellSize;
                        if (constraints.minX < 0 && dragValRatio < -0.15) {
                            newGridX = constraints.minX;
                            isEscapeMove = true;
                        } else if (constraints.maxX > maxBoardPosX && dragValRatio > (maxBoardPosX + 0.15)) {
                            newGridX = constraints.maxX;
                            isEscapeMove = true;
                        }
                        newGridX = Math.max(constraints.minX, Math.min(newGridX, constraints.maxX));
                    } else {
                        newGridX = block.x;
                        const maxBoardPosY = gridSize - (block.dir === 'V' ? block.size : 1);
                        const dragValRatio = valY / cellSize;
                        if (constraints.minY < 0 && dragValRatio < -0.15) {
                            newGridY = constraints.minY;
                            isEscapeMove = true;
                        } else if (constraints.maxY > maxBoardPosY && dragValRatio > (maxBoardPosY + 0.15)) {
                            newGridY = constraints.maxY;
                            isEscapeMove = true;
                        }
                        newGridY = Math.max(constraints.minY, Math.min(newGridY, constraints.maxY));
                    }

                    if (isEscapeMove) {
                        setIsEscapingAnimating(true);
                        audio.playSlide();
                        const targetValX = newGridX * cellSize;
                        const targetValY = newGridY * cellSize;
                        animate(x, targetValX, { type: 'tween', ease: 'easeIn', duration: 0.35 });
                        animate(y, targetValY, { type: 'tween', ease: 'easeIn', duration: 0.35, onComplete: () => onMove(block.id, newGridX, newGridY) });
                    } else if (newGridX !== block.x || newGridY !== block.y) {
                        audio.playSlide();
                        onMove(block.id, newGridX, newGridY);
                    } else {
                        audio.playError();
                        animate(x, block.x * cellSize, { type: 'spring', bounce: 0 });
                        animate(y, block.y * cellSize, { type: 'spring', bounce: 0 });
                    }
                } else {
                    const val = block.dir === 'H' ? valX : valY;
                    let newGrid = Math.round(val / cellSize);
                    
                    newGrid = Math.max(block.dir === 'H' ? constraints.minX : constraints.minY, Math.min(newGrid, block.dir === 'H' ? constraints.maxX : constraints.maxY));
                    
                    if (newGrid !== (block.dir === 'H' ? block.x : block.y)) {
                        audio.playSlide();
                        onMove(block.id, block.dir === 'H' ? newGrid : block.x, block.dir === 'V' ? newGrid : block.y);
                    } else {
                        audio.playError();
                        if (block.dir === 'H') {
                            animate(x, block.x * cellSize, { type: 'spring', bounce: 0 });
                        } else {
                            animate(y, block.y * cellSize, { type: 'spring', bounce: 0 });
                        }
                    }
                }
            }}`;

code = code.replace(oldOnDragEnd, newOnDragEnd);

// 3. Update handleMove signature and logic in App
const oldHandleMove = `  const handleMove = (id: number, newGrid: number) => {
      const boardSize = cellSize * (gameMode === 'screw' ? 8 : 6);
      
      if (gameMode === 'classic' && moves === 0) {
          setHistory([blocks]);
      }

      const block = blocks.find(b => b.id === id);
      const isEscaping = gameMode === 'screw' && block && (
          (block.dir === 'H' && (newGrid === -block.size || newGrid === gridSize)) ||
          (block.dir === 'V' && (newGrid === -block.size || newGrid === gridSize))
      );

      setHistory(prev => [...prev, blocks]);

      if (isEscaping && block) {
          audio.playCrusher();
          triggerShake();
          let px = 0;
          let py = 0;
          if (block.dir === 'H') {
              px = newGrid === -block.size ? 0 : boardSize;
              py = (block.y + 0.5) * cellSize;
          } else {
              px = (block.x + 0.5) * cellSize;
              py = newGrid === -block.size ? 0 : boardSize;
          }
          createParticles(px, py, block.color || '#00ffff', 32);
          
          // Remove block from grid
          setBlocks(prev => prev.filter(b => b.id !== id));
      } else {
          setBlocks(prev => prev.map(b => {
             if (b.id !== id) return b;
             return { ...b, [b.dir === 'H' ? 'x' : 'y']: newGrid };
          }));
      }

      setMoves(m => m + 1);
  };`;

const newHandleMove = `  const handleMove = (id: number, newX: number, newY: number) => {
      const gridSize = gameMode === 'screw' ? 8 : 6;
      const boardSize = cellSize * gridSize;
      
      if (gameMode === 'classic' && moves === 0) {
          setHistory([blocks]);
      }

      const block = blocks.find(b => b.id === id);
      const isEscaping = gameMode === 'screw' && block && (
          newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize
      );

      setHistory(prev => [...prev, blocks]);

      if (isEscaping && block) {
          audio.playCrusher();
          triggerShake();
          let px = 0;
          let py = 0;
          if (newX < 0 || newX >= gridSize) {
              px = newX < 0 ? 0 : boardSize;
              py = (block.y + 0.5) * cellSize;
          } else {
              px = (block.x + 0.5) * cellSize;
              py = newY < 0 ? 0 : boardSize;
          }
          createParticles(px, py, block.color || '#00ffff', 32);
          
          setBlocks(prev => prev.filter(b => b.id !== id));
      } else {
          setBlocks(prev => prev.map(b => {
             if (b.id !== id) return b;
             return { ...b, x: newX, y: newY };
          }));
      }

      setMoves(m => m + 1);
  };`;

code = code.replace(oldHandleMove, newHandleMove);

fs.writeFileSync('src/App.tsx', code);
