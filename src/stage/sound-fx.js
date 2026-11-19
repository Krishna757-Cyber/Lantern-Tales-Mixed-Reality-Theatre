/* ================================================================
   LANTERN TALES — STAGE PROCEDURAL SOUND FX ENGINE
   (src/stage/sound-fx.js)
   Synthesizes authentic folk acoustic feedback (temple bells, water
   splashes, fire kindle, stone drops, wing whooshes, sunrise drone)
   using zero external audio files via the Web Audio API.
================================================================ */

export const StageAudio = {
  ctx: null,
  masterGain: null,
  enabled: true,

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch (e) {
      console.warn('[StageAudio] Web Audio initialization:', e);
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  toggle() {
    this.enabled = !this.enabled;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.enabled ? 0.35 : 0.0, this.ctx.currentTime);
    }
    return this.enabled;
  },

  // 1. KINDLE: Warm fire whoosh with resonant bell shimmer
  playKindle() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Fire whoosh (filtered white noise)
    const bufSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);

    // Warm bell tone
    const osc = ctx.createOscillator();
    const bellGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now); // Solfeggio 528Hz love/transformation
    bellGain.gain.setValueAtTime(0.2, now);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.connect(bellGain);
    bellGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.8);
  },

  // 2. BEAK: Crisp paper snap & wooden puppet click
  playBeak() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(840, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.09);
  },

  // 3. PEBBLE: Water splash & pitcher bloop
  playPebble() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Resonating water bloop (pitch bending upward)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.35);

    // Secondary subtle splash droplet
    setTimeout(() => {
      if (!this.ctx) return;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1200, this.ctx.currentTime);
      gain2.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(this.ctx.currentTime);
      osc2.stop(this.ctx.currentTime + 0.15);
    }, 60);
  },

  // 4. GUIDE: Shimmering stardust celestial chime
  playGuide() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    [659.25, 783.99, 987.77, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.15, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + i * 0.05);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.04);
      osc.stop(now + 0.7);
    });
  },

  // 5. WINGS: Flapping feather whoosh
  playWings() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  },

  // 6. SUNRISE: Regal harmonic tanpura chord (Sa-Pa)
  playSunrise() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Sa, Pa, high Sa chords
    [146.83, 220.00, 293.66, 440.00].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 1.2);
    });
  },

  // 7. MEET / DUET: Harmonious dual bell resonance
  playMeet() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    [392.00, 523.25].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.2, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.05);
      osc.stop(now + 1.0);
    });
  },

  // 8. BLOOM: Grand temple bell & cascading chimes
  playBloom() {
    if (!this.enabled) return;
    this.init();
    this.resume();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Low temple gong
    const gong = ctx.createOscillator();
    const gongGain = ctx.createGain();
    gong.type = 'triangle';
    gong.frequency.setValueAtTime(220, now);
    gongGain.gain.setValueAtTime(0.35, now);
    gongGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    gong.connect(gongGain);
    gongGain.connect(this.masterGain);
    gong.start(now);
    gong.stop(now + 1.5);

    // Cascading sparkles
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    pentatonic.forEach((freq, idx) => {
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(freq, now + idx * 0.08);
      chimeGain.gain.setValueAtTime(0.12, now + idx * 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 + idx * 0.08);
      chime.connect(chimeGain);
      chimeGain.connect(this.masterGain);
      chime.start(now + idx * 0.08);
      chime.stop(now + 1.2);
    });
  }
};
