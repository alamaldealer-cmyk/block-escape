import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace buyRemoveAds button
old_remove_ads = r'''                             <button 
                                 onClick={buyRemoveAds}
                                 className="relative z-10 px-4 py-2 border border\[#d400ff\] text\[#d400ff\] bg\[#d400ff\]/10 hover:bg\[#d400ff\]/20 hover:shadow-\[0_0_15px_rgba\(212,0,255,0\.3\)\] rounded font-black text-xs tracking-widest flex items-center gap-2 active:scale-95 transition-all"
                             >
                                 BUY
                             </button>'''

new_remove_ads = '''                             <button 
                                 onClick={buyRemoveAds}
                                 className="relative z-10 w-28 h-10 text-white font-black text-sm tracking-widest flex items-center justify-center active:scale-95 transition-all drop-shadow-[0_0_8px_rgba(212,0,255,0.6)]"
                                 style={{ backgroundImage: `url('/buybutton.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                             >
                                 BUY
                             </button>'''
                             
content = re.sub(old_remove_ads, new_remove_ads, content)

old_bundle = r'''                                 <button 
                                     onClick={\(\) => handleBundlePurchase\(bundle\)}
                                     className="relative z-10 w-full px-2 py-2 border rounded font-black text-xs tracking-widest flex items-center justify-center active:scale-95 transition-all text-white hover:bg-white/10"
                                     style={{ borderColor: bundle\.color, backgroundColor: `\$\{bundle\.color\}33`, textShadow: `0 0 5px \$\{bundle\.color\}` }}
                                 >
                                     BUY NOW
                                 </button>'''
                                 
new_bundle = '''                                 <button 
                                     onClick={() => handleBundlePurchase(bundle)}
                                     className="relative z-10 w-full h-11 text-white font-black text-sm tracking-widest flex items-center justify-center active:scale-95 transition-all drop-shadow-lg"
                                     style={{ backgroundImage: `url('/buybutton.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', textShadow: '0 2px 4px rgba(0,0,0,0.5)', filter: `drop-shadow(0 0 5px ${bundle.color})` }}
                                 >
                                     BUY NOW
                                 </button>'''

content = re.sub(old_bundle, new_bundle, content)

old_coins = r'''                                 <button 
                                     onClick={\(\) => handleCoinPurchase\(pack\)}
                                     className="relative z-10 w-full px-2 py-1\.5 border border\[#ffaa00\] text-white bg\[#ffaa00\]/30 hover:bg\[#ffaa00\]/50 hover:shadow-\[0_0_15px_rgba\(255,170,0,0\.5\)\] rounded font-black text-\[11px\] tracking-widest flex items-center justify-center mt-auto active:scale-95 transition-all"
                                     style={{ textShadow: `0 0 5px #ffaa00` }}
                                 >
                                     BUY
                                 </button>'''

new_coins = '''                                 <button 
                                     onClick={() => handleCoinPurchase(pack)}
                                     className="relative z-10 w-full h-10 text-white font-black text-sm tracking-widest flex items-center justify-center mt-auto active:scale-95 transition-all drop-shadow-md"
                                     style={{ backgroundImage: `url('/buybutton.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', textShadow: '0 2px 4px rgba(0,0,0,0.5)', filter: 'drop-shadow(0 0 5px #ffaa00)' }}
                                 >
                                     BUY
                                 </button>'''

content = re.sub(old_coins, new_coins, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
