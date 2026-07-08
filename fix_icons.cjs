const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    /import \{ .*?\} from 'lucide-react';/,
    match => {
        if (!match.includes('Move,')) {
            return match.replace('MoveHorizontal,', 'MoveHorizontal, Move,');
        }
        return match;
    }
);

code = code.replace(
    /\{gameMode === 'screw' && \(\s*<div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 z-20">\s*\{block.dir === 'H' \? \(\s*<MoveHorizontal.*?\/>\s*\) : \(\s*<MoveVertical.*?\/>\s*\)\}\s*<\/div>\s*\)\}/s,
    `{gameMode === 'screw' && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 z-20">
                       <Move className="w-5 h-5 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                   </div>
               )}`
);

fs.writeFileSync('src/App.tsx', code);
