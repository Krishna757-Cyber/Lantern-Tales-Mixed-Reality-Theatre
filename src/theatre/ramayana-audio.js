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

    // Multilingual & Gender Settings
    this.voiceGender = 'female'; // 'female' (Melodious Devi / Katha Vachika) | 'male' (Resonant Sutradhar)
    this.currentLang = 'hi';     // 'hi', 'en', 'sa', 'gu', 'bn', 'ta', 'te'

    // Voice caches
    this.voicesLoaded = false;
    this.voiceMap = {};
    this.hindiVoice = null;
    this.englishVoice = null;

    if (this.speechSynth) {
      this.initVoices();
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  setVoiceGender(gender = 'female') {
    this.voiceGender = (gender === 'male') ? 'male' : 'female';
  }

  setLanguage(lang = 'hi') {
    this.currentLang = lang || 'hi';
  }

  initVoices() {
    if (!this.speechSynth) return;
    const voices = this.speechSynth.getVoices() || [];
    if (!voices || voices.length === 0) return;

    // Helper to test if voice name implies female or male
    const isFemaleVoice = (v) => {
      const n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return /female|woman|girl|swara|neerja|dhwani|tanishaa|pallavi|shruti|kalpana|zira|priya|heera|aditi|kavya|samantha|victoria|karen|tessa|sangeeta|sita|anjali|deepa|hazel|catherine|linda|stephanie|helena/i.test(n);
    };

    const isMaleVoice = (v) => {
      const n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return /male|man|boy|madhur|prabhat|niranjan|bashkar|valluvar|mohan|hemant|david|ravi|mark|george|daniel|rishi|kumar|ajay|suresh|james|richard|alex|fred/i.test(n);
    };

    const isNatural = (v) => {
      const n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return /natural|neural|online|google|premium/i.test(n);
    };

    // Filter candidate voices for a language code with ranking
    const getBestVoice = (langPrefixes, targetGender) => {
      const matches = voices.filter(v => {
        const vl = (v.lang || '').toLowerCase().replace('_', '-');
        return langPrefixes.some(lp => vl === lp || vl.startsWith(lp));
      });
      if (matches.length === 0) return null;

      matches.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        if (targetGender === 'female') {
          if (isFemaleVoice(a)) scoreA += 15;
          if (isMaleVoice(a)) scoreA -= 10;
          if (isFemaleVoice(b)) scoreB += 15;
          if (isMaleVoice(b)) scoreB -= 10;
        } else {
          if (isMaleVoice(a)) scoreA += 15;
          if (isFemaleVoice(a)) scoreA -= 10;
          if (isMaleVoice(b)) scoreB += 15;
          if (isFemaleVoice(b)) scoreB -= 10;
        }

        if (isNatural(a)) scoreA += 5;
        if (isNatural(b)) scoreB += 5;

        if (langPrefixes.includes('en') || langPrefixes.includes('en-in')) {
          if (/in|india/i.test(a.lang) || /india|heera|neerja|prabhat|ravi/i.test(a.name)) scoreA += 3;
          if (/in|india/i.test(b.lang) || /india|heera|neerja|prabhat|ravi/i.test(b.name)) scoreB += 3;
        }

        return scoreB - scoreA;
      });

      return matches[0];
    };

    // Global default gender voices across all available system voices
    const allFemaleVoices = voices.filter(v => isFemaleVoice(v));
    const allMaleVoices = voices.filter(v => isMaleVoice(v));

    const defaultFemale = allFemaleVoices.find(v => isNatural(v)) || allFemaleVoices[0] || voices[0];
    const defaultMale = allMaleVoices.find(v => isNatural(v)) || allMaleVoices[0] || voices.find(v => v !== defaultFemale) || voices[0];

    // Language-specific voices
    const hiFemale = getBestVoice(['hi', 'hi-in'], 'female');
    const hiMale = getBestVoice(['hi', 'hi-in'], 'male');

    const enFemale = getBestVoice(['en-in', 'en-gb', 'en-us', 'en'], 'female') || defaultFemale;
    const enMale = getBestVoice(['en-in', 'en-gb', 'en-us', 'en'], 'male') || defaultMale;

    this.voiceMap = {
      hi: {
        female: hiFemale,
        male: hiMale
      },
      en: {
        female: enFemale,
        male: enMale
      },
      gu: {
        female: getBestVoice(['gu', 'gu-in'], 'female'),
        male: getBestVoice(['gu', 'gu-in'], 'male')
      },
      bn: {
        female: getBestVoice(['bn', 'bn-in', 'bn-bd'], 'female'),
        male: getBestVoice(['bn', 'bn-in', 'bn-bd'], 'male')
      },
      ta: {
        female: getBestVoice(['ta', 'ta-in', 'ta-lk'], 'female'),
        male: getBestVoice(['ta', 'ta-in', 'ta-lk'], 'male')
      },
      te: {
        female: getBestVoice(['te', 'te-in'], 'female'),
        male: getBestVoice(['te', 'te-in'], 'male')
      },
      sa: {
        female: getBestVoice(['sa', 'sa-in'], 'female') || hiFemale,
        male: getBestVoice(['sa', 'sa-in'], 'male') || hiMale
      }
    };

    this.defaultFemaleVoice = defaultFemale;
    this.defaultMaleVoice = defaultMale;

    this.hindiVoice = hiFemale || hiMale;
    this.englishVoice = enFemale || enMale || voices[0];

    this.voicesLoaded = true;
  }

  resumeAudioAndSpeech() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      try { this.audioCtx.resume(); } catch (e) {}
    }
    if (this.speechSynth) {
      try {
        if (this.speechSynth.paused) this.speechSynth.resume();
      } catch (e) {}
    }
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

  // Speak narration / dialogue via Web Speech API with 7 languages & female/male melodious voice matching
  speak(textOrObj, lang = null, isPuppet = false, onEnd = null) {
    if (!this.speechSynth || !this.isVoiceEnabled || !textOrObj) {
      if (typeof onEnd === 'function') onEnd();
      return;
    }

    // Always re-check voices if not yet cached or if newly loaded
    if (!this.voicesLoaded || (!this.defaultFemaleVoice && !this.defaultMaleVoice)) {
      this.initVoices();
    }

    const selectedLang = lang || this.currentLang || 'hi';
    const targetGender = this.voiceGender || 'female';

    let textToSpeak = '';
    let voiceToUse = null;
    let speakLang = 'en-US';

    // 1. First look up language-specific voices
    const langVoices = this.voiceMap ? this.voiceMap[selectedLang] : null;
    if (langVoices) {
      voiceToUse = langVoices[targetGender] || langVoices[targetGender === 'female' ? 'male' : 'female'];
    }

    // 2. If no voice exists for selectedLang, assign default voice matching targetGender
    if (!voiceToUse) {
      if (targetGender === 'female') {
        voiceToUse = this.voiceMap?.en?.female || this.defaultFemaleVoice || this.englishVoice;
      } else {
        voiceToUse = this.voiceMap?.en?.male || this.defaultMaleVoice || this.englishVoice;
      }
    }

    // 3. Inspect the actual capability of the chosen voice
    const voiceLang = (voiceToUse?.lang || '').toLowerCase();
    const voiceName = (voiceToUse?.name || '').toLowerCase();
    const voiceSupportsHindi = voiceLang.startsWith('hi') || /hindi|swara|madhur|kalpana|hemant/i.test(voiceName);

    if (typeof textOrObj === 'object') {
      if (selectedLang === 'hi' || selectedLang === 'sa') {
        if (voiceSupportsHindi) {
          // Native Hindi TTS is installed on system -> speak authentic Devanagari!
          textToSpeak = textOrObj[selectedLang] || textOrObj.hi || '';
          speakLang = 'hi-IN';
        } else {
          // English voice on system (e.g. Brave/Windows with Microsoft Zira or David):
          // MUST speak English narration so user hears loud, melodious voice instead of silence!
          textToSpeak = textOrObj.en || textOrObj.hi || '';
          speakLang = voiceToUse?.lang || 'en-US';
        }
      } else if (selectedLang === 'en') {
        textToSpeak = textOrObj.en || textOrObj.hi || '';
        speakLang = voiceToUse?.lang || 'en-US';
      } else {
        // Regional (gu, bn, ta, te):
        const regionalVoice = this.voiceMap?.[selectedLang]?.[targetGender];
        if (regionalVoice) {
          textToSpeak = textOrObj[selectedLang] || textOrObj.hi || textOrObj.en || '';
          speakLang = regionalVoice.lang || 'en-US';
        } else if (voiceSupportsHindi) {
          textToSpeak = textOrObj.hi || textOrObj.en || '';
          speakLang = 'hi-IN';
        } else {
          textToSpeak = textOrObj.en || textOrObj.hi || '';
          speakLang = voiceToUse?.lang || 'en-US';
        }
      }
    } else {
      textToSpeak = textOrObj;
      const hasDevanagari = /[\u0900-\u097F]/.test(textToSpeak);
      if (hasDevanagari && !voiceSupportsHindi) {
        speakLang = voiceToUse?.lang || 'en-US';
      } else if (hasDevanagari) {
        speakLang = 'hi-IN';
      } else {
        speakLang = voiceToUse?.lang || 'en-US';
      }
    }

    if (!textToSpeak) {
      if (typeof onEnd === 'function') onEnd();
      return;
    }

    try {
      this.resumeAudioAndSpeech();
      this.speechSynth.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }
      utterance.lang = speakLang;

      // Melodious Acoustic Pacing:
      // Female (👩 Devi / Katha Vachika): pitch 1.14 (sweet, bright, serene), rate 0.92
      // Male (👨 Sutradhar / Katha Vachak): pitch 0.90 (resonant, warm storytelling baritone), rate 0.93
      // Kathputli puppet dialogue: pitch 1.32
      if (isPuppet) {
        utterance.pitch = 1.32;
        utterance.rate = 0.98;
      } else if (targetGender === 'female') {
        utterance.pitch = 1.14;
        utterance.rate = 0.92;
      } else {
        utterance.pitch = 0.90;
        utterance.rate = 0.93;
      }

      utterance.volume = 1.0;

      utterance.onstart = () => {
        this.duckMusic(true);
      };

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        this.duckMusic(false);
        if (window._ltSpeechKeepAlive) {
          clearInterval(window._ltSpeechKeepAlive);
          window._ltSpeechKeepAlive = null;
        }
        if (typeof onEnd === 'function') onEnd();
      };

      utterance.onend = finish;
      utterance.onerror = (e) => {
        console.warn('[RamayanaAudio] Speech error event:', e?.error);
        finish();
      };

      // Retain global reference to avoid GC cutting speech off
      window._ltSpeechUtterance = utterance;
      this.currentUtterance = utterance;

      // Chrome keepalive: prevent long speech from pausing after 15s
      if (window._ltSpeechKeepAlive) clearInterval(window._ltSpeechKeepAlive);
      window._ltSpeechKeepAlive = setInterval(() => {
        if (this.speechSynth && this.speechSynth.speaking) {
          this.speechSynth.pause();
          this.speechSynth.resume();
        } else {
          clearInterval(window._ltSpeechKeepAlive);
          window._ltSpeechKeepAlive = null;
        }
      }, 5000);

      // CRITICAL: Call speak directly without setTimeout to preserve direct user gesture activation in Brave/Chrome!
      if (this.speechSynth.paused) {
        this.speechSynth.resume();
      }
      this.speechSynth.speak(utterance);
      if (this.speechSynth.paused) {
        this.speechSynth.resume();
      }
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
