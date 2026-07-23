with open('src/App.tsx', 'r') as f:
    content = f.read()

old_restart_life = """                        <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-3/4 max-w-[200px]">
                            <div className="flex items-center justify-center gap-2 mb-1 relative z-10 w-full py-1 px-3 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm shadow-md">
                                <Heart className="w-3.5 h-3.5 text-[#ff5e5e] fill-[#ff5e5e] drop-shadow-[0_0_5px_rgba(255,94,94,0.5)]" />
                                <span className="text-white/80 font-black tracking-widest uppercase text-[10px] drop-shadow-md">Life Cost</span>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-sm relative z-10 font-mono w-full bg-black/60 rounded-xl py-2 border border-[#ff5e5e]/20 shadow-[0_0_15px_rgba(255,94,94,0.15)]">
                                <span className="text-white font-bold text-xl drop-shadow-md">{lives}</span>
                                <ArrowRight className="w-4 h-4 text-[#ff5e5e]/80" />
                                <span className="text-[#ff5e5e] font-black text-2xl drop-shadow-[0_0_10px_rgba(255,94,94,0.6)]">{Math.max(0, lives - 1)}</span>
                            </div>
                        </div>"""

hearts_html = """                        <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
                            <div className="flex items-center gap-[6px] justify-center w-full mb-[8px]">
                                {[...Array(5)].map((_, i) => (
                                    <Heart 
                                        key={i} 
                                        className={`w-6 h-6 transition-all duration-300 ${
                                            i < Math.max(0, lives - 1) 
                                                ? 'text-[#ff5e5e] fill-[#ff5e5e] drop-shadow-[0_0_8px_rgba(255,94,94,0.8)]' 
                                                : 'text-white/10 fill-transparent'
                                        }`} 
                                        strokeWidth={i < Math.max(0, lives - 1) ? 0 : 2}
                                    />
                                ))}
                            </div>
                            <div className="text-[#3b82f6] text-[10px] font-black tracking-[0.15em] uppercase drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]">
                                {Math.max(0, lives - 1)} LIVES REMAINING
                            </div>
                        </div>"""

if old_restart_life in content:
    # First occurrence is restart, second is quit (actually order depends on where they are in file)
    # Let's just find them based on the surrounding code.
    
    restart_idx = content.find('showRestartConfirm &&')
    if restart_idx != -1:
        restart_life_idx = content.find(old_restart_life, restart_idx)
        content = content[:restart_life_idx] + hearts_html + content[restart_life_idx + len(old_restart_life):]
        
    quit_idx = content.find('showQuitConfirm &&')
    if quit_idx != -1:
        quit_life_idx = content.find(old_restart_life, quit_idx)
        if quit_life_idx != -1:
            content = content[:quit_life_idx] + '' + content[quit_life_idx + len(old_restart_life):]

with open('src/App.tsx', 'w') as f:
    f.write(content)

