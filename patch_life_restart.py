import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Find the block in restart modal
restart_idx = content.find('showRestartConfirm &&')
if restart_idx != -1:
    start_tag = '<div className="absolute bottom-[28%]'
    end_tag = '</div>\n                        </div>'
    
    start_idx = content.find(start_tag, restart_idx)
    end_idx = content.find(end_tag, start_idx) + len(end_tag)
    
    if start_idx != -1 and end_idx != -1:
        new_html = """<div 
                            className="absolute w-full flex flex-col items-center justify-center z-20"
                            style={{ top: '52.5%', height: '12%', marginTop: '-30px' }}
                        >
                            <div className="flex items-center gap-[6px] sm:gap-[8px] justify-center w-full">
                                {[...Array(5)].map((_, i) => (
                                    <Heart 
                                        key={i} 
                                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 ${
                                            i < Math.max(0, lives - 1) 
                                                ? 'text-[#ff3131] fill-[#ff3131] drop-shadow-[0_0_8px_rgba(255,49,49,0.9)]' 
                                                : 'text-white/10 fill-transparent'
                                        }`} 
                                        strokeWidth={i < Math.max(0, lives - 1) ? 0 : 2}
                                    />
                                ))}
                            </div>
                            
                            <div className="mt-2 text-[#4db8ff] font-bold tracking-widest text-[11px] sm:text-[13px] uppercase drop-shadow-sm">
                                {Math.max(0, lives - 1)} LIVES REMAINING
                            </div>
                        </div>"""
        
        content = content[:start_idx] + new_html + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

