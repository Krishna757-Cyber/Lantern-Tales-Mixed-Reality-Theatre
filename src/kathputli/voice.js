/* ================================================================
   LANTERN TALES — PROCEDURAL BOLI REED VOICE (src/kathputli/voice.js)
   Authentic Rajasthani puppet reed squeak synthesis (Web Audio API)
   Band-passed sawtooth with pitch glides mapped to head tilt
   Zero synthesized words; universal icon speech-bubble visual cues
================================================================ */

export class KathputliVoice {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.lastTriggerTime = 0;
    this.activeCues = [];
  }

  init() {
    if (this.audioCtx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    } catch (e) {
      console.warn('[KathputliVoice] Web Audio not available:', e);
    }
  }

  // Squeak expression types: 'greet' | 'nod' | 'spin' | 'bow' | 'cheer'
  playSqueak(expression = 'greet', headTilt = 0) {
    if (!this.audioCtx) this.init();
    if (!this.audioCtx || this.audioCtx.state === 'suspended') {
      try { this.audioCtx?.resume(); } catch (e) {}
    }

    const now = performance.now();
    if (now - this.lastTriggerTime < 90) return; // Rate limiter
    this.lastTriggerTime = now;

    const ctx = this.audioCtx;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Traditional Boli Acoustic Profile:
    // High-pitched harmonic buzz from vibrating bamboo/reed membrane
    osc.type = 'sawtooth';

    // Bandpass resonance creates the nasality of the mouth whistle
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(6.5, t);

    // Pitch modulation based on head tilt (-1.0 to 1.0)
    const baseFreq = 820 + headTilt * 240;

    let duration = 0.14;
    let icon = '🎶';

    switch (expression) {
      case 'greet': // Double upward chirp
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, t + 0.08);
        filter.frequency.setValueAtTime(baseFreq * 1.2, t);
        duration = 0.12;
        icon = '✨';
        break;

      case 'nod': // Sharp agreement squeak
        osc.frequency.setValueAtTime(baseFreq * 1.15, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.85, t + 0.10);
        filter.frequency.setValueAtTime(baseFreq, t);
        duration = 0.10;
        icon = '🏮';
        break;

      case 'spin': // Playful trill
        osc.frequency.setValueAtTime(baseFreq * 1.25, t);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, t + 0.06);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.1, t + 0.15);
        filter.frequency.setValueAtTime(baseFreq * 1.4, t);
        duration = 0.16;
        icon = '🌸';
        break;

      case 'bow': // Gentle soft acknowledgment
        osc.frequency.setValueAtTime(baseFreq * 0.95, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, t + 0.18);
        filter.frequency.setValueAtTime(baseFreq * 0.85, t);
        duration = 0.18;
        icon = '🤝';
        break;

      default:
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.2, t + 0.10);
        filter.frequency.setValueAtTime(baseFreq, t);
        icon = '🎶';
    }

    // Fast envelope: snappy attack & short release
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);

    // Display visual icon cue
    this.spawnIconBubble(icon);
  }

  // Creates floating paper speech bubble above the puppet
  spawnIconBubble(icon) {
    if (typeof document === 'undefined') return;
    const stageWrap = document.getElementById('theatre-stage-wrap') || document.body;
    if (!stageWrap) return;

    const bubble = document.createElement('div');
    bubble.className = 'kathputli-speech-bubble';
    bubble.textContent = icon;
    bubble.style.position = 'absolute';
    bubble.style.left = '50%';
    bubble.style.top = '28%';
    bubble.style.transform = 'translate(-50%, -50%) scale(0.6)';
    bubble.style.opacity = '0';
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = '80';
    bubble.style.fontSize = '26px';
    bubble.style.background = 'rgba(253, 245, 230, 0.95)';
    bubble.style.border = '2px solid #E3A018';
    bubble.style.borderRadius = '50%';
    bubble.style.width = '44px';
    bubble.style.height = '44px';
    bubble.style.display = 'grid';
    bubble.style.placeItems = 'center';
    bubble.style.boxShadow = '0 6px 20px rgba(227, 160, 24, 0.35)';
    bubble.style.transition = 'transform 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.3s ease';

    stageWrap.appendChild(bubble);

    requestAnimationFrame(() => {
      bubble.style.opacity = '1';
      bubble.style.transform = `translate(${(-50 + (Math.random() - 0.5) * 30)}%, -85%) scale(1.15)`;
    });

    setTimeout(() => {
      bubble.style.opacity = '0';
      bubble.style.transform = `translate(-50%, -120%) scale(0.8)`;
      setTimeout(() => bubble.remove(), 350);
    }, 900);
  }
}
