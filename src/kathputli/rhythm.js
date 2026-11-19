/* ================================================================
   LANTERN TALES — PROCEDURAL DHOLAK & MANJIRA RHYTHM ENGINE (src/kathputli/rhythm.js)
   Synthesizes folk Kaharwa Theka rhythmic cycles (Web Audio API)
   Adaptive tempo following hand speed + Marigold Taal Meter feedback
================================================================ */

export class KathputliRhythm {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.tempo = 92; // BPM
    this.currentStep = 0;
    this.nextNoteTime = 0;
    this.timerId = null;

    // Taal meter score (0 to 12 marigold petals)
    this.taalScore = 0;
    this.maxScore = 12;

    // Pattern: 8-beat Kaharwa folk pattern (Dha, Ge, Na, Tin, Na, Dha, Ge, Na)
    // 1: Dha (bass+treble), 2: Ge (bass), 3: Na (treble), 4: Tin (treble open),
    // 5: Na (treble), 6: Dha (bass+treble), 7: Ge (bass), 8: Na (treble + manjira)
    this.pattern = [
      { bass: true, treble: true, manjira: true },
      { bass: true, treble: false, manjira: false },
      { bass: false, treble: true, manjira: false },
      { bass: false, treble: true, manjira: false },
      { bass: false, treble: true, manjira: false },
      { bass: true, treble: true, manjira: false },
      { bass: true, treble: false, manjira: false },
      { bass: false, treble: true, manjira: true }
    ];
  }

  init() {
    if (this.audioCtx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    } catch (e) {
      console.warn('[KathputliRhythm] Web Audio not available:', e);
    }
  }

  start() {
    if (!this.audioCtx) this.init();
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      try { this.audioCtx.resume(); } catch (e) {}
    }
    this.isPlaying = true;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  // Adjust tempo based on puppeteer hand velocity (0.5 to 2.5)
  setSpeedMultiplier(speedMultiplier = 1.0) {
    const targetBpm = 86 + Math.min(48, Math.max(0, (speedMultiplier - 1.0) * 45));
    // Smooth lerp tempo
    this.tempo += (targetBpm - this.tempo) * 0.15;
  }

  scheduler() {
    if (!this.isPlaying || !this.audioCtx) return;
    const scheduleAheadTime = 0.1;
    while (this.nextNoteTime < this.audioCtx.currentTime + scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      const secondsPerBeat = 60.0 / this.tempo / 2; // 8th notes
      this.nextNoteTime += secondsPerBeat;
      this.currentStep = (this.currentStep + 1) % this.pattern.length;
    }
    this.timerId = setTimeout(() => this.scheduler(), 35);
  }

  scheduleNote(stepIndex, time) {
    const beat = this.pattern[stepIndex];
    if (beat.bass) this.playDholakBass(time);
    if (beat.treble) this.playDholakTreble(time);
    if (beat.manjira) this.playManjira(time);

    // Pulse UI beat indicator
    if (typeof window !== 'undefined') {
      const dot = document.getElementById(`taal-dot-${stepIndex}`);
      if (dot) {
        dot.classList.add('active-beat');
        setTimeout(() => dot.classList.remove('active-beat'), 180);
      }
    }
  }

  // Synthesize open/closed bass stroke (Bayan)
  playDholakBass(time) {
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Pitch drops rapidly to emulate leather tension relaxation
    osc.frequency.setValueAtTime(125, time);
    osc.frequency.exponentialRampToValueAtTime(58, time + 0.14);

    gain.gain.setValueAtTime(0.42, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.20);
  }

  // Synthesize crisp rim stroke (Dayan)
  playDholakTreble(time) {
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, time);
    osc.frequency.exponentialRampToValueAtTime(260, time + 0.08);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.Q.setValueAtTime(4, time);

    gain.gain.setValueAtTime(0.28, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.11);
  }

  // Synthesize ringing brass cymbal (Manjira)
  playManjira(time) {
    const ctx = this.audioCtx;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(3280, time);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(4920, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.48);
    osc2.stop(time + 0.48);
  }

  // Check if player's pluck landed on the beat
  checkBeatHit() {
    if (!this.audioCtx) return false;
    const now = this.audioCtx.currentTime;
    const beatWindow = 0.085; // 85ms forgiveness window
    const diff = Math.abs(now - (this.nextNoteTime - (60.0 / this.tempo / 2)));
    if (diff < beatWindow) {
      this.taalScore = Math.min(this.maxScore, this.taalScore + 1);
      this.renderTaalMeter();
      return true;
    }
    return false;
  }

  renderTaalMeter() {
    if (typeof document === 'undefined') return;
    const meter = document.getElementById('taal-marigold-ring');
    if (!meter) return;
    const petals = meter.querySelectorAll('.taal-marigold-petal');
    petals.forEach((p, idx) => {
      p.classList.toggle('bloomed', idx < this.taalScore);
    });
  }
}
