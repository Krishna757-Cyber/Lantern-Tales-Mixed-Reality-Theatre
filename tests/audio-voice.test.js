import assert from 'node:assert';
import { RamayanaAudioManager } from '../src/theatre/ramayana-audio.js';

console.log('🧪 Testing Ramayana Audio Voice Resolution & Fallbacks...');

// Mock speech synthesis for Node environment
class MockSpeechSynthesis {
  constructor(mockVoices) {
    this.voices = mockVoices;
    this.speaking = false;
    this.paused = false;
    this.spokenUtterances = [];
  }
  getVoices() {
    return this.voices;
  }
  speak(utterance) {
    this.speaking = true;
    this.spokenUtterances.push(utterance);
    if (utterance.onstart) utterance.onstart();
  }
  cancel() {
    this.speaking = false;
    this.spokenUtterances = [];
  }
  resume() {
    this.paused = false;
  }
  pause() {
    this.paused = true;
  }
}

global.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
    this.voice = null;
    this.lang = '';
    this.pitch = 1.0;
    this.rate = 1.0;
    this.volume = 1.0;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
  }
};

// SCENARIO 1: Windows Browser with ONLY English voices (e.g. Brave on Windows: Zira & David)
const mockEnglishOnlyVoices = [
  { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US', voiceURI: 'David' },
  { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', voiceURI: 'Zira' }
];

global.window = {
  speechSynthesis: new MockSpeechSynthesis(mockEnglishOnlyVoices)
};

const audioMgr1 = new RamayanaAudioManager();
audioMgr1.speechSynth = global.window.speechSynthesis;
audioMgr1.initVoices();

// Test 1: Female voice selection on English-only browser
audioMgr1.setVoiceGender('female');
assert.strictEqual(audioMgr1.voiceGender, 'female');

const sceneText = {
  hi: 'सरयू के पावन तट पर महाराजा दशरथ ने यज्ञ किया।',
  en: 'In ancient Ayodhya, King Dasharath performs a sacred yagya.'
};

// When Hindi is chosen but machine only has English voices:
// It must select Zira (female), and speak English text so it is NOT silent!
audioMgr1.speak(sceneText, 'hi');
const utt1 = global.window.speechSynthesis.spokenUtterances[0];
assert(utt1, 'Utterance must be spoken');
assert.strictEqual(utt1.voice.name, 'Microsoft Zira Desktop - English (United States)');
assert.strictEqual(utt1.text, sceneText.en, 'Must speak English text so English voice produces sound!');
assert(utt1.pitch > 1.0, 'Female voice must have uplifting melodious pitch > 1.0');
console.log('  ✓ Verified Female voice (Zira) safely falls back to English text and is audible');

// Test 2: Male voice selection on English-only browser
audioMgr1.setVoiceGender('male');
assert.strictEqual(audioMgr1.voiceGender, 'male');

audioMgr1.speak(sceneText, 'hi');
const utt2 = global.window.speechSynthesis.spokenUtterances[0];
assert(utt2, 'Utterance must be spoken');
assert.strictEqual(utt2.voice.name, 'Microsoft David Desktop - English (United States)');
assert.strictEqual(utt2.text, sceneText.en, 'Must speak English text so English voice produces sound!');
assert(utt2.pitch < 1.0, 'Male voice must have deep baritone pitch < 1.0');
console.log('  ✓ Verified Male voice (David) safely falls back to English text and is audible');

// SCENARIO 2: Browser with Native Hindi Voices (e.g. Edge with Swara and Madhur)
const mockHindiAndEnglishVoices = [
  { name: 'Microsoft Swara Online (Natural) - Hindi (India)', lang: 'hi-IN', voiceURI: 'Swara' },
  { name: 'Microsoft Madhur Online (Natural) - Hindi (India)', lang: 'hi-IN', voiceURI: 'Madhur' },
  { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US', voiceURI: 'David' },
  { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', voiceURI: 'Zira' }
];

global.window.speechSynthesis = new MockSpeechSynthesis(mockHindiAndEnglishVoices);
const audioMgr2 = new RamayanaAudioManager();
audioMgr2.speechSynth = global.window.speechSynthesis;
audioMgr2.initVoices();

// Test 3: Native Hindi Female voice
audioMgr2.setVoiceGender('female');
audioMgr2.speak(sceneText, 'hi');
const utt3 = global.window.speechSynthesis.spokenUtterances[0];
assert.strictEqual(utt3.voice.name, 'Microsoft Swara Online (Natural) - Hindi (India)');
assert.strictEqual(utt3.text, sceneText.hi, 'Must speak Devanagari text when native Hindi voice exists!');
assert.strictEqual(utt3.lang, 'hi-IN');
console.log('  ✓ Verified Native Hindi Female voice (Swara) speaks authentic Devanagari Hindi');

// Test 4: Native Hindi Male voice
audioMgr2.setVoiceGender('male');
audioMgr2.speak(sceneText, 'hi');
const utt4 = global.window.speechSynthesis.spokenUtterances[0];
assert.strictEqual(utt4.voice.name, 'Microsoft Madhur Online (Natural) - Hindi (India)');
assert.strictEqual(utt4.text, sceneText.hi, 'Must speak Devanagari text when native Hindi voice exists!');
assert.strictEqual(utt4.lang, 'hi-IN');
console.log('  ✓ Verified Native Hindi Male voice (Madhur) speaks authentic Devanagari Hindi');

console.log('✅ All audio voice fallback & gender tests passed with 100% success!');
if (global.window?._ltSpeechKeepAlive) clearInterval(global.window._ltSpeechKeepAlive);
process.exit(0);
