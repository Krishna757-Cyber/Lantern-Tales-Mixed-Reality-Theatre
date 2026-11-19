/* ================================================================
   LANTERN TALES — RAMAYANA PROCEDURAL AUDIO & NARRATION
   (src/theatre/ramayana-audio.js)
   Synthesizes classical Indian folk soundscapes (Tanpura, Dholak, Nagara,
   Shankh, Manjira) via Web Audio API + Web Speech API narration with
   voice-ducking and Kathputli Boli pitch modulation.
================================================================ */

export class RamayanaAudioManager {
  constructor() {
    this.audioCtx = null;
    this.masterMusicGain = null;
    this.droneGain = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.currentMood = 'devotional';
    this.currentTempo = 80;
    this.currentTaal = 'kaharwa';

    // Rhythm step sequencing
    this.step = 0;
    this.nextNoteTime = 0;
    this.rhythmTimer = null;

    // Speech narration
    this.speechSynth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isVoiceEnabled = true;
    this.currentUtterance = null;
    this.duckingActive = false;

    // Voice caches
    this.voicesLoaded = false;
    this.hindiVoice = null;
    this.englishVoice = null;

    if (this.speechSynth) {
      this.initVoices();
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.speechSynth) return;
    const voices = this.speechSynth.getVoices();
    if (!voices || voices.length === 0) return;

    // Look for native Indian voices first
    this.hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang === 'hi-IN') ||
                      voices.find(v => v.name.includes('Hindi') || v.name.includes('Kalpana') || v.name.includes('Hemant'));

    this.englishVoice = voices.find(v => v.lang === 'en-IN') ||
                        voices.find(v => v.lang.startsWith('en')) ||
                        voices[0];

    this.voicesLoaded = true;
  }

  initAudio() {
    if (this.audioCtx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();

        // Master music output bus
        this.masterMusicGain = this.audioCtx.createGain();
        this.masterMusicGain.gain.setValueAtTime(this.isMuted ? 0.0 : 0.28, this.audioCtx.currentTime);
        this.masterMusicGain.connect(this.audioCtx.destination);

        // Continuous Harmonium / Tanpura ambient drone
        this.startDrone();
      }
    } catch (e) {
      console.warn('[RamayanaAudio] Web Audio initialization:', e);
    }
  }

  startDrone() {
    if (!this.audioCtx || this.droneGain) return;
    const ctx = this.audioCtx;

    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.08, ctx.currentTime);
    this.droneGain.connect(this.masterMusicGain);

    // Fundamental Sa (C# / D at ~138 Hz) and Pa (A at ~207 Hz)
    const freqs = [138.59, 207.65, 277.18];
    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      osc.connect(filter);
      filter.connect(this.droneGain);
      osc.start();
    });
  }

  setMusicMood(musicConfig = {}) {
    this.currentTaal = musicConfig.taal || 'kaharwa';
    this.currentTempo = musicConfig.tempo || 80;
    this.currentMood = musicConfig.mood || 'devotional';

    if (!this.audioCtx) this.initAudio();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try { this.audioCtx.resume(); } catch (e) {}
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.nextNoteTime = this.audioCtx ? this.audioCtx.currentTime + 0.05 : 0;
      this.scheduleRhythm();
    }
  }

  scheduleRhythm() {
    if (!this.isPlaying || !this.audioCtx) return;
    const ctx = this.audioCtx;
    const scheduleAhead = 0.12;
    const secondsPerBeat = 60.0 / this.currentTempo;

    while (this.nextNoteTime < ctx.currentTime + scheduleAhead) {
      this.playBeat(this.step, this.nextNoteTime);
      this.nextNoteTime += secondsPerBeat * 0.5; // Eighth note resolution
      this.step = (this.step + 1) % 16;
    }

    this.rhythmTimer = setTimeout(() => this.scheduleRhythm(), 50);
  }

  playBeat(step, time) {
    if (!this.audioCtx || this.isMuted) return;

    // Pattern variation based on mood
    const isBattle = this.currentMood === 'battle';
    const isFestive = this.currentMood === 'festive';

    // Bass Dholak / Nagara hit on beats 0, 4, 8, 12
    if (step % 4 === 0) {
      this.triggerBassDrum(time, isBattle ? 'nagara' : 'dholak');
    }

    // Treble Slap / Chhati
    if (step % 2 === 1) {
      this.triggerTrebleSlap(time);
    }

    // Manjira chime on festive accents
    if ((isFestive || this.currentMood === 'devotional') && (step === 0 || step === 8)) {
      this.triggerManjira(time);
    }
  }

  triggerBassDrum(time, type = 'dholak') {
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = type === 'nagara' ? 110 : 88;
    const endFreq = type === 'nagara' ? 38 : 42;

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.14);

    gain.gain.setValueAtTime(type === 'nagara' ? 0.35 : 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  triggerTrebleSlap(time) {
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, time);
    osc.frequency.exponentialRampToValueAtTime(160, time + 0.06);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, time);
    filter.Q.setValueAtTime(4.0, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  triggerManjira(time) {
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2450, time);

    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);

    osc.connect(gain);
    gain.connect(this.masterMusicGain);
    osc.start(time);
    osc.stop(time + 0.48);
  }

  triggerShankh() {
    if (!this.audioCtx || this.isMuted) return;
    const ctx = this.audioCtx;
    const time = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // Sacred Conch call: upward swell to ~440 Hz
    osc.frequency.setValueAtTime(220, time);
    osc.frequency.exponentialRampToValueAtTime(440, time + 0.4);
    osc.frequency.setValueAtTime(440, time + 1.2);
    osc.frequency.exponentialRampToValueAtTime(330, time + 1.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, time);

    gain.gain.setValueAtTime(0.01, time);
    gain.gain.linearRampToValueAtTime(0.24, time + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 2.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterMusicGain);
    osc.start(time);
    osc.stop(time + 2.05);
  }

  // Volume ducking when narration speaks
  duckMusic(enable = true) {
    if (!this.audioCtx || !this.masterMusicGain) return;
    const target = this.isMuted ? 0.0 : (enable ? 0.09 : 0.28);
    const t = this.audioCtx.currentTime;
    this.masterMusicGain.gain.cancelScheduledValues(t);
    this.masterMusicGain.gain.linearRampToValueAtTime(target, t + 0.25);
    this.duckingActive = enable;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterMusicGain && this.audioCtx) {
      const target = muted ? 0.0 : (this.duckingActive ? 0.09 : 0.28);
      this.masterMusicGain.gain.setValueAtTime(target, this.audioCtx.currentTime);
    }
  }

  // Speak narration / dialogue via Web Speech API
  speak(text, lang = 'hi', isPuppet = false, onEnd = null) {
    if (!this.speechSynth || !this.isVoiceEnabled || !text) {
      if (typeof onEnd === 'function') onEnd();
      return;
    }

    try {
      this.speechSynth.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'hi' && this.hindiVoice) {
        utterance.voice = this.hindiVoice;
        utterance.lang = 'hi-IN';
      } else if (this.englishVoice) {
        utterance.voice = this.englishVoice;
        utterance.lang = 'en-IN';
      }

      // Sutradhar = normal pitch (~1.0); puppet dialogue = higher Kathputli Boli pitch (~1.35)
      utterance.pitch = isPuppet ? 1.38 : 1.02;
      utterance.rate = 0.95;

      utterance.onstart = () => {
        this.duckMusic(true);
      };

      utterance.onend = () => {
        this.duckMusic(false);
        if (typeof onEnd === 'function') onEnd();
      };

      utterance.onerror = () => {
        this.duckMusic(false);
        if (typeof onEnd === 'function') onEnd();
      };

      this.currentUtterance = utterance;
      this.speechSynth.speak(utterance);
    } catch (err) {
      console.warn('[RamayanaAudio] Speech synthesis fallback:', err);
      this.duckMusic(false);
      if (typeof onEnd === 'function') onEnd();
    }
  }

  stopAll() {
    this.isPlaying = false;
    if (this.rhythmTimer) {
      clearTimeout(this.rhythmTimer);
      this.rhythmTimer = null;
    }
    if (this.speechSynth) {
      try { this.speechSynth.cancel(); } catch (e) {}
    }
    this.duckMusic(false);
  }
}
