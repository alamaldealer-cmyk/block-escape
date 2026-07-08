const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/else if \(screen === 'game'\) \{\s*setCurrentLevel\(nextLevel\);\s*\}/g, 
  "else if (screen === 'game') {\n              setScreen('levels');\n          }");

fs.writeFileSync('src/App.tsx', code);
