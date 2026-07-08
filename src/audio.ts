import levelfailedAudioUrl from "./levelfailed.mp3";
import bgmAudioUrl from './audio.mp3';
import brickscrushAudioUrl from "./brickscrush.mp3";

class NeonAudio {
    ctx: AudioContext | null = null;
    initialized = false;

    globalVolume = 1.0;
    
    globalGain: GainNode | null = null;
    sfxGain: GainNode | null = null;
    
    bgmElement: HTMLAudioElement | null = null;
    coinElement: HTMLAudioElement | null = null;
    starElement: HTMLAudioElement | null = null;
    levelfailedElement: HTMLAudioElement | null = null;
    brickscrushElement: HTMLAudioElement | null = null;

    init() {
        if (!this.initialized) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
                
                const savedVol = localStorage.getItem('neon_volume');
                if (savedVol !== null) {
                    this.globalVolume = parseFloat(savedVol);
                }

                this.globalGain = this.ctx.createGain();
                this.sfxGain = this.ctx.createGain();
                
                this.globalGain.gain.value = this.globalVolume;
                
                this.sfxGain.connect(this.globalGain);
                this.globalGain.connect(this.ctx.destination);

                this.initialized = true;
            }
            
            if (!this.bgmElement) {
                this.bgmElement = new Audio(bgmAudioUrl);
                this.bgmElement.loop = true;
                this.bgmElement.volume = this.globalVolume;
            }
            if (!this.coinElement) {
                this.coinElement = new Audio('/coinaudio.mp3');
                this.coinElement.preload = 'auto';
            }
            if (!this.starElement) {
                this.starElement = new Audio('/stars.mp3');
                this.starElement.preload = 'auto';
            }
            if (!this.levelfailedElement) {
                this.levelfailedElement = new Audio(levelfailedAudioUrl);
                this.levelfailedElement.preload = "auto";
            }
            if (!this.brickscrushElement) {
                this.brickscrushElement = new Audio(brickscrushAudioUrl);
                this.brickscrushElement.preload = "auto";
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setVolume(level: number) {
        this.globalVolume = level;
        if (this.globalGain && this.ctx) {
            this.globalGain.gain.setValueAtTime(level, this.ctx.currentTime);
        }
        if (this.bgmElement) {
            this.bgmElement.volume = level;
        }
        localStorage.setItem('neon_volume', level.toString());
    }

    playGameBGM() {
        this.init();
        if (this.bgmElement) {
            this.bgmElement.play().catch(e => console.log('BGM play prevented:', e));
        }
    }

    stopGameBGM() {
        if (this.bgmElement) {
            this.bgmElement.pause();
            this.bgmElement.currentTime = 0;
        }
    }

    playTap() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        osc.start(now);
        osc.stop(now + 0.05);
    }

    playSlide() {
        this.init();
        if (!this.ctx) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        // The satisfying futuristic "Thwock-tick"
        
        // 1. The metallic impact (thump)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(250, now);
        osc1.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        
        const filter1 = ctx.createBiquadFilter();
        filter1.type = 'lowpass';
        filter1.frequency.setValueAtTime(2000, now);
        filter1.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.3, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc1.connect(filter1);
        filter1.connect(gain1);
        gain1.connect(this.sfxGain!);
        
        osc1.start(now);
        osc1.stop(now + 0.1);
        
        // 2. The glassy transient
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1500, now);
        osc2.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.4, now + 0.002);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        
        osc2.connect(gain2);
        gain2.connect(this.sfxGain!);
        
        osc2.start(now);
        osc2.stop(now + 0.06);

        // 3. A delayed "click" for snapping into place
        const snapTime = now + 0.04;
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(2400, snapTime);
        osc3.frequency.exponentialRampToValueAtTime(1200, snapTime + 0.03);
        
        gain3.gain.setValueAtTime(0, snapTime);
        gain3.gain.linearRampToValueAtTime(0.2, snapTime + 0.002);
        gain3.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.03);
        
        osc3.connect(gain3);
        gain3.connect(this.sfxGain!);
        
        osc3.start(snapTime);
        osc3.stop(snapTime + 0.04);
    }

    playError() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        // Soft "thud" for invalid move or dropping back to place
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }


    playLevelFailed() {
        this.init();
        try {
            if (this.levelfailedElement) {
                const failSfx = this.levelfailedElement.cloneNode() as HTMLAudioElement;
                failSfx.volume = this.globalVolume;
                failSfx.play().catch(() => {});
            }
        } catch (e) {}
    }
    playWin() {
        this.init();
        
        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        // 1. Celebratory Chord Layer
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C major 7/9 vibes
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            
            osc.type = i % 2 === 0 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 0.5);
            
            const time = now + i * 0.05;
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 1.0);
            
            osc.start(time);
            osc.stop(time + 1.0);
        });

        // 2. High Shimmer Layer
        const shimmerOsc = ctx.createOscillator();
        const shimmerGain = ctx.createGain();
        shimmerOsc.type = 'sine';
        shimmerOsc.frequency.setValueAtTime(2000, now);
        shimmerOsc.frequency.linearRampToValueAtTime(4000, now + 0.3);
        
        shimmerGain.gain.setValueAtTime(0, now);
        shimmerGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
        shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(this.sfxGain!);
        shimmerOsc.start(now);
        shimmerOsc.stop(now + 0.4);
    }

    playSuccessSwell() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.6);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.4);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.6);
        
        osc.start(now);
        osc.stop(now + 0.6);
    }

    playCoinDrop() {
        this.init();
        
        try {
            if (this.coinElement) {
                const coinSfx = this.coinElement.cloneNode() as HTMLAudioElement;
                coinSfx.volume = this.globalVolume;
                coinSfx.play().catch(() => {});
            }
        } catch (e) {}

        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        // High pitched metallic ting
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.02); // Lowered volume
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playStar(index: number) {
        this.init();
        
        try {
            if (this.starElement) {
                const starSfx = this.starElement.cloneNode() as HTMLAudioElement;
                starSfx.volume = this.globalVolume;
                starSfx.play().catch(() => {});
            }
        } catch (e) {}

        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        // Progressive pitch based on star index
        const baseFreq = 880 + (index * 440); // A5, E6, A6 approx
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        osc.start(now);
        osc.stop(now + 0.3);

        // Add a secondary resonance for "sparkle"
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(this.sfxGain);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(baseFreq * 2.01, now);
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc2.start(now);
        osc2.stop(now + 0.15);
    }

    playCollect() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.1);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playShatter() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        // Multi-oscillator noise burst for shattering effect
        const count = 5;
        for (let i = 0; i < count; i++) {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g);
            g.connect(this.sfxGain);
            
            osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
            const freq = 400 + Math.random() * 800;
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(10, now + 0.2);
            
            g.gain.setValueAtTime(0.15 / count, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.15 + Math.random() * 0.1);
            
            osc.start(now);
            osc.stop(now + 0.3);
        }
        
        // Low thump
        const b = ctx.createOscillator();
        const bg = ctx.createGain();
        b.connect(bg);
        bg.connect(this.sfxGain);
        b.frequency.setValueAtTime(150, now);
        b.frequency.exponentialRampToValueAtTime(10, now + 0.15);
        bg.gain.setValueAtTime(0.3, now);
        bg.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        b.start(now);
        b.stop(now + 0.15);
    }

    playCrusher() {
        this.init();
        if (this.brickscrushElement) {
            this.brickscrushElement.currentTime = 0;
            this.brickscrushElement.volume = this.globalVolume;
            this.brickscrushElement.play().catch(e => console.log('brickscrush play prevented:', e));
        }
        if (!this.ctx || !this.sfxGain) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        
        // 1. Initial mechanical metal clack
        const clackOsc = ctx.createOscillator();
        const clackGain = ctx.createGain();
        clackOsc.type = 'triangle';
        clackOsc.frequency.setValueAtTime(600, now);
        clackOsc.frequency.linearRampToValueAtTime(100, now + 0.08);
        clackGain.gain.setValueAtTime(0.4, now);
        clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        clackOsc.connect(clackGain);
        clackGain.connect(this.sfxGain);
        clackOsc.start(now);
        clackOsc.stop(now + 0.08);

        // 2. Heavy hydraulic crunch (sub-bass grinding thump)
        const lowOsc = ctx.createOscillator();
        const lowGain = ctx.createGain();
        lowOsc.type = 'sawtooth';
        lowOsc.frequency.setValueAtTime(90, now);
        lowOsc.frequency.linearRampToValueAtTime(25, now + 0.35);
        
        const lowFilter = ctx.createBiquadFilter();
        lowFilter.type = 'lowpass';
        lowFilter.frequency.setValueAtTime(350, now);
        lowFilter.frequency.exponentialRampToValueAtTime(50, now + 0.35);
        
        lowGain.gain.setValueAtTime(0.55, now);
        lowGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        lowOsc.connect(lowFilter);
        lowFilter.connect(lowGain);
        lowGain.connect(this.sfxGain);
        lowOsc.start(now);
        lowOsc.stop(now + 0.35);

        // 3. Electric spark / mechanical grind screech (middle range crunch texture)
        const grindOsc = ctx.createOscillator();
        const grindGain = ctx.createGain();
        grindOsc.type = 'sawtooth';
        grindOsc.frequency.setValueAtTime(450, now);
        grindOsc.frequency.linearRampToValueAtTime(150, now + 0.28);
        
        const grindFilter = ctx.createBiquadFilter();
        grindFilter.type = 'bandpass';
        grindFilter.frequency.setValueAtTime(750, now);
        grindFilter.frequency.exponentialRampToValueAtTime(180, now + 0.28);
        grindFilter.Q.setValueAtTime(4, now);
        
        grindGain.gain.setValueAtTime(0.35, now);
        grindGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        
        grindOsc.connect(grindFilter);
        grindFilter.connect(grindGain);
        grindGain.connect(this.sfxGain);
        grindOsc.start(now);
        grindOsc.stop(now + 0.28);

        // 4. White noise-like shattering / air release hiss (Pshhh)
        const noiseOsc = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        noiseOsc.type = 'square';
        noiseOsc.frequency.setValueAtTime(8000, now);
        noiseOsc.frequency.exponentialRampToValueAtTime(600, now + 0.42);
        
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1500, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(300, now + 0.42);
        
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
        
        noiseOsc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        noiseOsc.start(now);
        noiseOsc.stop(now + 0.42);

        // 5. Short metal debris resonance
        const debrisOsc = ctx.createOscillator();
        const debrisGain = ctx.createGain();
        debrisOsc.type = 'sine';
        debrisOsc.frequency.setValueAtTime(1600, now + 0.08);
        debrisGain.gain.setValueAtTime(0, now);
        debrisGain.gain.setValueAtTime(0.1, now + 0.08);
        debrisGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        debrisOsc.connect(debrisGain);
        debrisGain.connect(this.sfxGain);
        debrisOsc.start(now);
        debrisOsc.stop(now + 0.22);
    }
}

export const audio = new NeonAudio();
