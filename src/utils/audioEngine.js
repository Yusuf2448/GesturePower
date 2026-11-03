// Synthesized Web Audio API sound generator for GesturePower SFX & BGM

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.sfxVolume = 0.5;
    this.bgmVolume = 0.2;
    this.bgmNode = null;
    this.bgmGain = null;
    this.isBgmPlaying = false;
    this.initialized = false;
  }

  // Initialize Web Audio context upon user interaction
  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : this.bgmVolume;
    }
  }

  setSfxVolume(vol) {
    this.sfxVolume = vol;
  }

  setBgmVolume(vol) {
    this.bgmVolume = vol;
    if (this.bgmGain && !this.isMuted) {
      this.bgmGain.gain.value = this.bgmVolume;
    }
  }

  // Play power activation sound transition
  playPowerActivation(powerId) {
    if (!this.initialized || this.isMuted) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Play specific power effect sound
  playPowerEffect(powerId) {
    if (!this.initialized || this.isMuted) return;
    this.resume();

    const now = this.ctx.currentTime;

    switch (powerId) {
      case 'orb': {
        // Continuous hum/whoosh
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(180, now + 0.2);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      case 'lightning': {
        // Crackling zap sound (noise + high freq sweep)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.15);
        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'blast': {
        // Deep explosion impact
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
        gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      }
      case 'laser': {
        // Precision laser pew
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case 'portal': {
        // Ethereal cosmic swoosh
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.3);
        gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
      default:
        break;
    }
  }

  // Synthesize background ambient music loop
  startBgm() {
    if (!this.initialized || this.isBgmPlaying) return;
    this.resume();

    try {
      const now = this.ctx.currentTime;
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, now);
      this.bgmGain.connect(this.ctx.destination);

      // Low drone frequency
      const drone1 = this.ctx.createOscillator();
      const drone2 = this.ctx.createOscillator();

      drone1.type = 'sine';
      drone1.frequency.setValueAtTime(55, now); // A1 note
      drone2.type = 'triangle';
      drone2.frequency.setValueAtTime(110, now); // A2 note

      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.3, now);

      drone1.connect(droneGain);
      drone2.connect(droneGain);
      droneGain.connect(this.bgmGain);

      drone1.start(now);
      drone2.start(now);

      this.bgmNodes = [drone1, drone2];
      this.isBgmPlaying = true;
    } catch (e) {
      console.warn('Failed to start BGM', e);
    }
  }

  stopBgm() {
    if (this.bgmNodes) {
      this.bgmNodes.forEach(n => {
        try { n.stop(); } catch(e) {}
      });
      this.bgmNodes = null;
    }
    this.isBgmPlaying = false;
  }
}

export const audioEngine = new AudioEngine();
