import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace the coin pack div definition
old_coin_div = r'<div key=\{pack\.id\} className="bg-\[#050b14\]/90 p-3 border border-\[#ffaa00\] shadow-\[0_0_15px_rgba\(255,170,0,0\.3\)\] rounded-xl flex flex-col items-center justify-between relative overflow-hidden group hover:shadow-\[0_0_25px_rgba\(255,170,0,0\.5\)\] transition-all">\s*<div className="absolute inset-0 bg-\[#ffaa00\]/10 group-hover:bg-\[#ffaa00\]/20 transition-colors" />'

new_coin_div = '''<div key={pack.id} className="p-5 flex flex-col items-center justify-between relative transition-all"
                                 style={{ backgroundImage: `url('/inappcoinbackground.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '180px' }}>'''

text = re.sub(old_coin_div, new_coin_div, text)

# Modify the coin buy button to remove drop shadow filter and set width
old_coin_btn = r'className="relative z-10 w-full h-10 text-white font-black text-sm tracking-widest flex items-center justify-center mt-auto active:scale-95 transition-all drop-shadow-md"\s*style=\{\{ backgroundImage: `url\(\'/buybutton\.png\'\)`, backgroundSize: \'100% 100%\', backgroundPosition: \'center\', backgroundRepeat: \'no-repeat\', textShadow: \'0 2px 4px rgba\(0,0,0,0\.5\)\', filter: \'drop-shadow\(0 0 5px #ffaa00\)\' \}\}'

new_coin_btn = '''className="relative z-10 w-[150px] h-10 text-white font-black text-sm tracking-widest flex items-center justify-center mt-auto active:scale-95 transition-all"
                                    style={{ backgroundImage: `url('/buybutton.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}'''

text = re.sub(old_coin_btn, new_coin_btn, text)

with open('src/App.tsx', 'w') as f:
    f.write(text)
