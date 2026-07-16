import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

old_block = r'''                        \{\/\* Life Status Display \*\/\}
                        <div 
                            id="life-status-box"
                            className="absolute w-full flex flex-col items-center justify-center z-10"
                            style=\{\{ top: '35%', height: '22%' \}\}
                        >
                            <div className="flex items-center gap-\[4px\] sm:gap-\[6px\] justify-center w-full mt-6">
                                \{\[\.\.\.Array\(5\)\]\.map\(\(_, i\) => \(
                                    <Heart 
                                        key=\{i\} 
                                        className=\{`w-7 h-7 sm:w-8 sm:h-8 transition-all \$\{i < lives \? 'text-\\[#ff5e5e\\] fill-\\[#ff5e5e\\] drop-shadow-\\[0_0_8px_rgba\\(255,94,94,0\\.8\\)\\]' : 'text-white/10 fill-black/60'\} `\} 
                                    \/>
                                \)\)\}
                            <\/div>
                            
                            <div className="mt-3 text-\[#4db8ff\] font-bold tracking-widest text-\[11px\] sm:text-\[13px\] uppercase drop-shadow-sm">
                                \{lives\} LIVES REMAINING
                            <\/div>
                        <\/div>
                        
                        <div className="absolute w-full flex flex-col justify-center items-center z-20" style=\{\{ top: '59%', height: '35%' \}\}>
                            <button 
                                onClick=\{handleRestart\}
                                className="w-\[74%\] max-w-\[300px\] hover:scale-105 active:scale-95 transition-transform"
                                style=\{\{ margin: '2%' \}\}
                            >
                                <img src="/continue\.png" alt="Continue" className="w-full h-auto drop-shadow-md" \/>
                            <\/button>
                            <button 
                                onClick=\{handleRestart\}
                                className="w-\[74%\] max-w-\[300px\] hover:scale-105 active:scale-95 transition-transform"
                                style=\{\{ margin: '2%' \}\}
                            >
                                <img src="/tryagain\.png" alt="Try Again" className="w-full h-auto drop-shadow-md" \/>
                            <\/button>
                            <button 
                                onClick=\{onBack\}
                                className="w-\[74%\] max-w-\[300px\] hover:scale-105 active:scale-95 transition-transform"
                                style=\{\{ margin: '2%' \}\}
                            >
                                <img src="/mainmenu\.png" alt="Main Menu" className="w-full h-auto drop-shadow-md" \/>
                            <\/button>
                        <\/div>'''

new_block = '''                        {/* Life Status Display */}
                        <div 
                            id="life-status-box"
                            className="absolute w-full flex flex-col items-center justify-center z-10"
                            style={{ top: '44%', height: '14%' }}
                        >
                            <div className="flex items-center gap-[4px] sm:gap-[6px] justify-center w-full">
                                {[...Array(5)].map((_, i) => (
                                    <Heart 
                                        key={i} 
                                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${i < lives ? 'text-[#ff5e5e] fill-[#ff5e5e] drop-shadow-[0_0_8px_rgba(255,94,94,0.8)]' : 'text-white/10 fill-black/60'}`} 
                                    />
                                ))}
                            </div>
                            
                            <div className="mt-2 text-[#4db8ff] font-bold tracking-widest text-[11px] sm:text-[13px] uppercase drop-shadow-sm">
                                {lives} LIVES REMAINING
                            </div>
                        </div>
                        
                        <div className="absolute w-full flex flex-col justify-start items-center z-20" style={{ top: '63%', height: '32%', gap: '4%' }}>
                            <button 
                                onClick={handleRestart}
                                className="w-[74%] max-w-[300px] hover:scale-105 active:scale-95 transition-transform flex justify-center items-center"
                            >
                                <img src="/continue.png" alt="Continue" className="w-[95%] h-auto drop-shadow-md" />
                            </button>
                            <button 
                                onClick={handleRestart}
                                className="w-[74%] max-w-[300px] hover:scale-105 active:scale-95 transition-transform flex justify-center items-center"
                            >
                                <img src="/tryagain.png" alt="Try Again" className="w-[95%] h-auto drop-shadow-md" />
                            </button>
                            <button 
                                onClick={onBack}
                                className="w-[74%] max-w-[300px] hover:scale-105 active:scale-95 transition-transform flex justify-center items-center"
                            >
                                <img src="/mainmenu.png" alt="Main Menu" className="w-[95%] h-auto drop-shadow-md" />
                            </button>
                        </div>'''

text = text.replace(old_block, new_block)
if old_block not in text:
    print("Warning: Direct string replacement failed, trying regex.")
    text = re.sub(re.sub(r'\s+', r'\\s*', old_block.replace('[', '\\[').replace(']', '\\]').replace('{', '\\{').replace('}', '\\}').replace('(', '\\(').replace(')', '\\)')), new_block, text)

with open('src/App.tsx', 'w') as f:
    f.write(text)
