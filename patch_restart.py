import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace showRestartConfirm modal
restart_match = re.search(r'\{showRestartConfirm && \(\n\s*<motion\.div.*?</motion\.div>\n\s*\)\}', content, re.DOTALL)
if restart_match:
    restart_replacement = """{showRestartConfirm && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[360px] flex flex-col items-center justify-center"
                    >
                        <img src="/restartgame.png" alt="Restart Game" className="w-full h-auto drop-shadow-[0_0_30px_rgba(255,170,0,0.3)]" />
                        <div className="absolute bottom-[10%] left-0 w-full flex justify-center gap-3 px-8">
                            <button 
                                onClick={() => { audio.playTap(); setShowRestartConfirm(false); }}
                                className="flex-1 hover:brightness-110 active:scale-95 transition-all focus:outline-none"
                            >
                                <img src="/cancelbutton.png" alt="Cancel" className="w-full h-auto drop-shadow-md" />
                            </button>
                            <button 
                                onClick={() => { handleRestart(); }}
                                className="flex-1 hover:brightness-110 active:scale-95 transition-all focus:outline-none"
                            >
                                <img src="/confirmbutton.png" alt="Confirm" className="w-full h-auto drop-shadow-md" />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}"""
    content = content.replace(restart_match.group(0), restart_replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)

print(f"Replaced restart modal: {bool(restart_match)}")
