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
      return /female|woman|girl|swara|neerja|dhwani|tanishaa|pallavi|shruti|kalpana|zira|priya|heera|aditi|kavya|samantha|victoria|karen|tessa|sangeeta|sita|anjali|deepa/i.test(n);
    };

    const isMaleVoice = (v) => {
      const n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return /male|man|boy|madhur|prabhat|niranjan|bashkar|valluvar|mohan|hemant|david|ravi|mark|george|daniel|rishi|kumar|ajay|suresh/i.test(n);
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
          if (isFemaleVoice(a)) scoreA += 10;
          if (isMaleVoice(a)) scoreA -= 6;
          if (isFemaleVoice(b)) scoreB += 10;
          if (isMaleVoice(b)) scoreB -= 6;
        } else {
          if (isMaleVoice(a)) scoreA += 10;
          if (isFemaleVoice(a)) scoreA -= 6;
          if (isMaleVoice(b)) scoreB += 10;
          if (isFemaleVoice(b)) scoreB -= 6;
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

    this.voiceMap = {
      hi: {
        female: getBestVoice(['hi', 'hi-in'], 'female'),
        male: getBestVoice(['hi', 'hi-in'], 'male')
      },
      en: {
        female: getBestVoice(['en-in', 'en-gb', 'en-us', 'en'], 'female'),
        male: getBestVoice(['en-in', 'en-gb', 'en-us', 'en'], 'male')
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
        female: getBestVoice(['sa', 'sa-in', 'hi', 'hi-in'], 'female'),
        male: getBestVoice(['sa', 'sa-in', 'hi', 'hi-in'], 'male')
      }
    };

    // Universal fallbacks
    this.hindiVoice = this.voiceMap.hi.female || this.voiceMap.hi.male || voices.find(v => (v.lang || '').startsWith('hi'));
    this.englishVoice = this.voiceMap.en.female || this.voiceMap.en.male || voices.find(v => (v.lang || '').startsWith('en')) || voices[0];

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

    // Refresh voices if not yet cached or if newly loaded
    if (!this.voicesLoaded) {
      this.initVoices();
    }

    const selectedLang = lang || this.currentLang || 'hi';
    const targetGender = this.voiceGender || 'female';

    // Map of language code to standard SpeechSynthesis lang tag
    const langTagMap = {
      hi: 'hi-IN',
      en: 'en-IN',
      gu: 'gu-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      sa: 'hi-IN' // Sanskrit chanted with sacred intonation via hi-IN
    };

    let textToSpeak = '';
    let voiceToUse = null;
    let speakLang = langTagMap[selectedLang] || 'en-US';

    if (typeof textOrObj === 'object') {
      // 1. Try to get native text for the requested language
      textToSpeak = textOrObj[selectedLang] || '';

      // 2. Look for best voice for [selectedLang][targetGender]
      const langVoices = this.voiceMap[selectedLang];
      if (langVoices) {
        voiceToUse = langVoices[targetGender] || langVoices[targetGender === 'female' ? 'male' : 'female'];
      }

      // 3. Fallback handling if no voice exists on the user's OS for selectedLang
      if (!voiceToUse) {
        const fallbackLang = (selectedLang === 'en') ? 'en' : 'hi';
        const fallbackVoices = this.voiceMap[fallbackLang] || this.voiceMap.en || {};
        voiceToUse = fallbackVoices[targetGender] || fallbackVoices[targetGender === 'female' ? 'male' : 'female'] || this.hindiVoice || this.englishVoice;

        if (!textToSpeak || (selectedLang !== 'hi' && selectedLang !== 'sa' && selectedLang !== 'en' && !this.voiceMap[selectedLang]?.[targetGender])) {
          textToSpeak = textOrObj.hi || textOrObj.en || textToSpeak;
          speakLang = textOrObj.hi ? 'hi-IN' : 'en-US';
        }
      }
    } else {
      textToSpeak = textOrObj;
      const langVoices = this.voiceMap[selectedLang];
      if (langVoices) {
        voiceToUse = langVoices[targetGender] || langVoices[targetGender === 'female' ? 'male' : 'female'];
      }
      if (!voiceToUse) {
        voiceToUse = (targetGender === 'female' ? this.voiceMap.en?.female : this.voiceMap.en?.male) || this.englishVoice;
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

      // Pitch & Rate tuning for Melodious, Human-like Voice:
      // Female (Devi / Katha Vachika): pitch 1.15 (sweet, bright, serene), rate 0.92
      // Male (Sutradhar): pitch 0.92 (warm, resonant baritone), rate 0.93
      // Kathputli puppet dialogue: pitch 1.32 (folklore whistle/boli accent)
      if (isPuppet) {
        utterance.pitch = 1.32;
        utterance.rate = 0.98;
      } else if (targetGender === 'female') {
        utterance.pitch = 1.15;
        utterance.rate = 0.92;
      } else {
        utterance.pitch = 0.92;
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

      // Retain global reference to avoid Chrome/V8 GC cutting off speech mid-sentence
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
      }, 10000);

      // Brief delay to allow speechSynth.cancel() to cleanly flush in Chromium
      setTimeout(() => {
        if (this.speechSynth) {
          if (this.speechSynth.paused) this.speechSynth.resume();
          this.speechSynth.speak(utterance);
        }
      }, 40);
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
