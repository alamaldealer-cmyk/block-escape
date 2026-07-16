import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

old_coin_div = r'''<div key=\{pack\.id\} className="p-4 pt-\[4\.5rem\] flex flex-col items-center justify-end relative transition-all"
                                 style=\{\{ backgroundImage: `url\('/inappcoinbackground\.png'\)`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '220px' \}\}>
                                 <span className="font-black text-\[#fff2d4\] tracking-widest text-2xl relative z-10 mb-0" style=\{\{ textShadow: `0 0 15px #ffaa00` \}\}>\{pack\.coins\.toLocaleString\(\)\}</span>
                                 <span className="text-\[#ffaa00\] font-bold tracking-widest text-\[10px\] relative z-10 mb-3">COINS</span>
                                 
                                 <button 
                                     onClick=\{\(\) => handleCoinPurchase\(pack\)\}
                                    className="relative z-10 w-\[140px\] h-\[38px\] text-white font-black text-sm tracking-widest flex items-center justify-center active:scale-95 transition-all"
                                    style=\{\{ backgroundImage: `url\('/buybutton\.png'\)`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', textShadow: '0 2px 4px rgba\(0,0,0,0\.5\)' \}\}
                                >
                                    BUY
                                </button>
                             </div>'''

new_coin_div = '''<div key={pack.id} className="p-3 py-4 flex flex-col items-center justify-between relative transition-all aspect-square"
                                 style={{ backgroundImage: `url('/inappcoinbackground.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                                 <div className="w-12 h-12 rounded-full bg-[#0a0500]/80 border-2 border-[#ffaa00] flex items-center justify-center shadow-[0_0_15px_rgba(255,170,0,0.5)] mt-1 relative z-10 overflow-hidden">
                                     <div className="absolute inset-0 bg-[#ffaa00]/20 animate-pulse" />
                                     <Coins className="w-6 h-6 text-[#ffaa00] relative z-10 drop-shadow-[0_0_5px_rgba(255,170,0,1)]" />
                                 </div>
                                 
                                 <div className="flex flex-col items-center z-10 my-1">
                                     <span className="font-black text-[#fff2d4] tracking-widest text-[22px] relative z-10 leading-none" style={{ textShadow: `0 0 10px #ffaa00` }}>{pack.coins.toLocaleString()}</span>
                                     <div className="flex items-center gap-2 mt-2">
                                         <div className="h-[1px] w-4 bg-[#ffaa00]/60" />
                                         <span className="text-[#ffaa00] font-bold tracking-widest text-[10px] relative z-10 leading-none">COINS</span>
                                         <div className="h-[1px] w-4 bg-[#ffaa00]/60" />
                                     </div>
                                 </div>
                                 
                                 <button 
                                     onClick={() => handleCoinPurchase(pack)}
                                    className="relative z-10 w-[130px] h-[36px] text-white font-black text-sm tracking-widest flex items-center justify-center active:scale-95 transition-all mb-1"
                                    style={{ backgroundImage: `url('/buybutton.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                                >
                                    BUY
                                </button>
                             </div>'''

text = re.sub(old_coin_div, new_coin_div, text)

with open('src/App.tsx', 'w') as f:
    f.write(text)
