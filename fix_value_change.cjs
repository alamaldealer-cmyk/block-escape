const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldValueChange = `        const handleValueChange = (latest: number) => {
            if (gameMode !== 'screw') {
                setCrushProgress(0);
                return;
            }
            const totalDistance = block.size * cellSize;
            if (totalDistance <= 0) return;

            let progress = 0;
            if (block.dir === 'H') {
                if (latest < 0) {
                    progress = Math.min(1, Math.max(0, -latest / totalDistance));
                } else {
                    const maxBoard = (gridSize - block.size) * cellSize;
                    if (latest > maxBoard) {
                        progress = Math.min(1, Math.max(0, (latest - maxBoard) / totalDistance));
                    }
                }
            } else {
                if (latest < 0) {
                    progress = Math.min(1, Math.max(0, -latest / totalDistance));
                } else {
                    const maxBoard = (gridSize - block.size) * cellSize;
                    if (latest > maxBoard) {
                        progress = Math.min(1, Math.max(0, (latest - maxBoard) / totalDistance));
                    }
                }
            }
            setCrushProgress(progress);
        };

        const val = block.dir === 'H' ? x : y;
        const unsubscribe = val.on("change", handleValueChange);
        handleValueChange(val.get());

        return () => unsubscribe();`;

const newValueChange = `        const updateProgress = () => {
            if (gameMode !== 'screw') {
                setCrushProgress(0);
                return;
            }
            const totalDistanceX = (block.dir === 'H' ? block.size : 1) * cellSize;
            const totalDistanceY = (block.dir === 'V' ? block.size : 1) * cellSize;
            if (totalDistanceX <= 0 || totalDistanceY <= 0) return;

            let progressX = 0;
            let progressY = 0;
            
            const currX = x.get();
            const currY = y.get();

            if (currX < 0) {
                progressX = Math.min(1, Math.max(0, -currX / totalDistanceX));
            } else {
                const maxBoardX = (gridSize - (block.dir === 'H' ? block.size : 1)) * cellSize;
                if (currX > maxBoardX) {
                    progressX = Math.min(1, Math.max(0, (currX - maxBoardX) / totalDistanceX));
                }
            }

            if (currY < 0) {
                progressY = Math.min(1, Math.max(0, -currY / totalDistanceY));
            } else {
                const maxBoardY = (gridSize - (block.dir === 'V' ? block.size : 1)) * cellSize;
                if (currY > maxBoardY) {
                    progressY = Math.min(1, Math.max(0, (currY - maxBoardY) / totalDistanceY));
                }
            }

            setCrushProgress(Math.max(progressX, progressY));
        };

        const unsubX = x.on("change", updateProgress);
        const unsubY = y.on("change", updateProgress);
        updateProgress();

        return () => { unsubX(); unsubY(); };`;

code = code.replace(oldValueChange, newValueChange);

fs.writeFileSync('src/App.tsx', code);
