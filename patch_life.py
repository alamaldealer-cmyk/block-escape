import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

life_html = """
                        <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-3/4 max-w-[200px]">
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

restart_pattern = r'(<img src="/restartgame\.png" alt="Restart Game".*?/>)'
if re.search(restart_pattern, content):
    content = re.sub(restart_pattern, r'\1' + life_html, content)

quit_pattern = r'(<img src="/quitgame\.png" alt="Quit Game".*?/>)'
if re.search(quit_pattern, content):
    content = re.sub(quit_pattern, r'\1' + life_html, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

