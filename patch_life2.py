import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# For restart
restart_pattern = r'(\{\s*showRestartConfirm &&.*?</motion\.div>\n\s*</motion\.div>\n\s*\})'
match = re.search(restart_pattern, content, re.DOTALL)
if match:
    block = match.group(1)
    
    # Replace the life box with hearts
    life_box_pattern = r'<div className="absolute bottom-\[30%\].*?</div>\s*</div>\s*</div>'
    
    hearts_html = """<div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
                            <div className="flex items-center gap-1 sm:gap-1.5 justify-center w-full mb-1">
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
    
    new_block = re.sub(life_box_pattern, hearts_html, block, flags=re.DOTALL)
    content = content.replace(block, new_block)

# For quit
quit_pattern = r'(\{\s*showQuitConfirm &&.*?</motion\.div>\n\s*</motion\.div>\n\s*\})'
match_quit = re.search(quit_pattern, content, re.DOTALL)
if match_quit:
    block_quit = match_quit.group(1)
    life_box_pattern_quit = r'<div className="absolute bottom-\[30%\].*?</div>\s*</div>\s*</div>'
    new_block_quit = re.sub(life_box_pattern_quit, '', block_quit, flags=re.DOTALL)
    content = content.replace(block_quit, new_block_quit)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print(f"Replaced restart modal: {bool(match)}")
print(f"Replaced quit modal: {bool(match_quit)}")
