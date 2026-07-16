import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

text = re.sub(
    r'<div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style=\{\{ backgroundColor: bundle\.color \}\} />',
    '',
    text
)

text = re.sub(
    r'className="relative z-10 w-\[200px\] h-11 text-white font-black text-sm tracking-widest flex items-center justify-center active:scale-95 transition-all drop-shadow-lg"\s*style=\{\{ backgroundImage: `url\(\'/buybutton\.png\'\)`, backgroundSize: \'100% 100%\', backgroundPosition: \'center\', backgroundRepeat: \'no-repeat\', textShadow: \'0 2px 4px rgba\(0,0,0,0\.5\)\', filter: `drop-shadow\(0 0 5px \$\{bundle\.color\}\)` \}\}',
    '''className="relative z-10 w-[150px] h-11 text-white font-black text-sm tracking-widest flex items-center justify-center active:scale-95 transition-all"
                                     style={{ backgroundImage: `url('/buybutton.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}''',
    text
)

with open('src/App.tsx', 'w') as f:
    f.write(text)
