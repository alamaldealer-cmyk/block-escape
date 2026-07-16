import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

old_fail_screen = r'''\{hasFailed && !hasWon && !showRefillModal && \(
                <motion\.div 
                    initial=\{\{ opacity: 0 \}\} 
                    animate=\{\{ opacity: 1 \}\} 
                    exit=\{\{ opacity: 0 \}\}
                    className="fixed inset-0 z-\[240\] bg-black/90 backdrop-blur-sm flex items-center justify-center"
                >
                    <div className="relative w-full max-w-\[500px\] mx-auto flex flex-col items-center justify-center min-h-\[500px\]"
                         style=\{\{ backgroundImage: `url\('/levelfailed\.png'\)`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' \}\}>
                        
                        \{\/\* Life Status Display \*\/\}
                        <div 
                            id="life-status-box"
                            className="absolute w-full flex flex-col items-center justify-center z-10"
                            style=\{\{ top: '44%' \}\}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-\[2px\] w-4 bg-\[#ff5e5e\]/80" \/>
                                <span className="text-\[#ff5e5e\] font-black tracking-widest uppercase text-sm drop-shadow-md">Life Lost<\/span>
                                <div className="h-\[2px\] w-4 bg-\[#ff5e5e\]/80" \/>
                            <\/div>
                            
                            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5">
                                \{\[\.\.\.Array\(5\)\]\.map\(\(_, i\) => \(
                                    <Heart 
                                        key=\{i\} 
                                        className=\{`w-6 h-6 transition-all \$\{i < lives \? 'text-\\[#ff5e5e\\] fill-\\[#ff5e5e\\] drop-shadow-\\[0_0_8px_rgba\\(255,94,94,0\\.8\\)\\]' : 'text-white/20 fill-black/50'\} `\} 
                                    \/>
                                \)\)\}
                            <\/div>
                            
                            <div className="mt-2 text-\[#4db8ff\] font-bold tracking-widest text-\[11px\] uppercase drop-shadow-sm">
                                \{lives\} Lives Remaining
                            <\/div>
                        <\/div>
                        
                        <div className="absolute w-full flex flex-col justify-center items-center gap-3 z-20" style=\{\{ top: '65%' \}\}>
                            <button 
                                onClick=\{handleRestart\}
                                className="w-\[65%\] max-w-\[260px\] hover:scale-105 active:scale-95 transition-transform"
                            >
                                <img src="/Continue\.png" alt="Continue" className="w-full h-auto drop-shadow-lg" \/>
                            <\/button>
                            <button 
                                onClick=\{handleRestart\}
                                className="w-\[65%\] max-w-\[260px\] hover:scale-105 active:scale-95 transition-transform"
                            >
                                <img src="/tryagain\.png" alt="Try Again" className="w-full h-auto drop-shadow-lg" \/>
                            <\/button>
                            <button 
                                onClick=\{onBack\}
                                className="w-\[65%\] max-w-\[260px\] hover:scale-105 active:scale-95 transition-transform"
                            >
                                <img src="/mainmenu\.png" alt="Main Menu" className="w-full h-auto drop-shadow-lg" \/>
                            <\/button>
                        <\/div>
                    <\/div>
                <\/motion\.div>
            \)}'''

new_fail_screen = '''{hasFailed && !hasWon && !showRefillModal && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[240] bg-black/90 backdrop-blur-sm flex items-center justify-center"
                >
                    <div className="relative w-full max-w-[500px] mx-auto flex flex-col items-center justify-center aspect-[3/4]"
                         style={{ backgroundImage: `url('/levelfailed.png')`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                        
                        {/* Life Status Display */}
                        <div 
                            id="life-status-box"
                            className="absolute w-full flex flex-col items-center justify-center z-10"
                            style={{ top: '40.5%' }}
                        >
                            <div className="flex items-center gap-[6px] justify-center w-full mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Heart 
                                        key={i} 
                                        className={`w-7 h-7 md:w-8 md:h-8 transition-all ${i < lives ? 'text-[#ff5e5e] fill-[#ff5e5e] drop-shadow-[0_0_8px_rgba(255,94,94,0.8)]' : 'text-white/10 fill-black/60'}`} 
                                    />
                                ))}
                            </div>
                            
                            <div className="mt-[18px] text-[#4db8ff] font-bold tracking-widest text-[12px] uppercase drop-shadow-sm">
                                {lives} LIVES REMAINING
                            </div>
                        </div>
                        
                        <div className="absolute w-full flex flex-col justify-center items-center z-20" style={{ top: '61.5%', gap: '14px' }}>
                            <button 
                                onClick={handleRestart}
                                className="w-[68%] max-w-[280px] hover:scale-105 active:scale-95 transition-transform"
                            >
                                <img src="/continue.png" alt="Continue" className="w-full h-auto" />
                            </button>
                            <button 
                                onClick={handleRestart}
                                className="w-[68%] max-w-[280px] hover:scale-105 active:scale-95 transition-transform"
                            >
                                <img src="/tryagain.png" alt="Try Again" className="w-full h-auto" />
                            </button>
                            <button 
                                onClick={onBack}
                                className="w-[68%] max-w-[280px] hover:scale-105 active:scale-95 transition-transform"
                            >
                                <img src="/mainmenu.png" alt="Main Menu" className="w-full h-auto" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}'''

text = text.replace(old_fail_screen, new_fail_screen)
# Just in case there are regex issues, let's use string replace for this. It might not match exactly due to whitespace or trailing characters, so I'll use a regex that handles whitespace gracefully if replace fails.
if old_fail_screen not in text:
    print("Warning: Direct string replacement failed, trying regex.")
    text = re.sub(re.sub(r'\s+', r'\\s*', old_fail_screen.replace('[', '\\[').replace(']', '\\]').replace('{', '\\{').replace('}', '\\}').replace('(', '\\(').replace(')', '\\)')), new_fail_screen, text)

with open('src/App.tsx', 'w') as f:
    f.write(text)
