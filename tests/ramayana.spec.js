import assert from 'node:assert';
import { RAMAYANA_KANDS, RAMAYANA_SCENES } from '../src/story/ramayanaScript.js';
import { RAMAYANA_PUPPET_CLASSES, createRamayanaPuppet } from '../src/kathputli/puppets/ramayana-puppets.js';
import { FLAGS } from '../src/app/flags.js';

console.log('🧪 Testing Ramayana Katha Feature & Script Data...');

// 1. Feature Flag Verification
assert.strictEqual(FLAGS.ramayanaKatha, true, 'FLAGS.ramayanaKatha must be true');
console.log('  ✓ Verified ramayanaKatha feature flag is active');

// 2. Validate Kands
assert.strictEqual(RAMAYANA_KANDS.length, 7, 'Ramayana must have 7 Kands');
for (let i = 0; i < 7; i++) {
  const kand = RAMAYANA_KANDS[i];
  assert.strictEqual(kand.id, i + 1);
  assert(kand.nameEn && typeof kand.nameEn === 'string', 'Kand must have English name');
  assert(kand.nameHi && typeof kand.nameHi === 'string', 'Kand must have Hindi name');
}
console.log('  ✓ Verified 7 Kands metadata (Bal Kand through Uttara & Return)');

// 3. Validate Scenes
assert(RAMAYANA_SCENES.length >= 35, `Expected 35-45 scenes, found ${RAMAYANA_SCENES.length}`);
const validBackdrops = [
  'ayodhya-palace', 'swayamvar-hall', 'panchavati', 'kishkindha',
  'ocean-setu', 'golden-lanka', 'ashok-vatika', 'battlefield', 'diya-ayodhya'
];

for (let s = 0; s < RAMAYANA_SCENES.length; s++) {
  const scene = RAMAYANA_SCENES[s];
  assert(scene.id, `Scene ${s} missing id`);
  assert(scene.kand, `Scene ${s} missing kand`);
  assert(scene.kandIndex >= 1 && scene.kandIndex <= 7, `Scene ${s} invalid kandIndex: ${scene.kandIndex}`);
  assert(scene.titleEn, `Scene ${s} missing English title`);
  assert(scene.titleHi, `Scene ${s} missing Hindi title`);
  assert(scene.narrationEn, `Scene ${s} missing English narration`);
  assert(scene.narrationHi, `Scene ${s} missing Hindi narration`);
  assert(validBackdrops.includes(scene.backdrop), `Scene ${s} unrecognized backdrop: ${scene.backdrop}`);
  assert(Array.isArray(scene.actors) && scene.actors.length > 0, `Scene ${s} must have at least 1 actor`);
  assert(scene.durationMs >= 12000, `Scene ${s} durationMs must be >= 12000ms`);

  // Validate actors
  for (const actor of scene.actors) {
    assert(RAMAYANA_PUPPET_CLASSES[actor.puppet], `Actor references invalid puppet: ${actor.puppet}`);
    assert(['left', 'right', 'center'].includes(actor.enterFrom), `Actor enterFrom invalid: ${actor.enterFrom}`);
  }
}
console.log(`  ✓ Verified all ${RAMAYANA_SCENES.length} scenes (titles, bilingual narrations, actors, backdrops)`);

// 4. Validate Puppets Factory & Rigs
const testCharacters = ['ram', 'sita', 'lakshman', 'hanuman', 'ravan', 'dasharath', 'sutradhar', 'maricha', 'jatayu'];
for (const charId of testCharacters) {
  const puppet = createRamayanaPuppet(charId);
  assert(puppet, `Failed to create puppet for ${charId}`);
  assert(puppet.colors, `Puppet ${charId} missing colors`);
  assert(puppet.stringSystem, `Puppet ${charId} missing stringSystem`);

  puppet.setPose('bow');
  assert.strictEqual(puppet.currentPose, 'bow');
  puppet.setPose('aim-bow');
  assert.strictEqual(puppet.currentPose, 'aim-bow');
  puppet.setPose('celebrate');
  assert.strictEqual(puppet.currentPose, 'celebrate');
}
console.log('  ✓ Verified Ramayana Kathputli character family and pose kinematics');

// 5. Validate Multilingual Database (7 Languages across 38 Scenes)
import { MULTILINGUAL_SCENES, SUPPORTED_LANGUAGES, getSceneNarration } from '../src/story/ramayana-multilingual.js';
assert.strictEqual(SUPPORTED_LANGUAGES.length, 7, 'Must support 7 languages');
const requiredLangCodes = ['hi', 'en', 'sa', 'gu', 'bn', 'ta', 'te'];
requiredLangCodes.forEach(code => {
  assert(SUPPORTED_LANGUAGES.some(l => l.code === code), `Missing required language code: ${code}`);
});

for (const scene of RAMAYANA_SCENES) {
  assert(MULTILINGUAL_SCENES[scene.id], `Missing multilingual entry for scene ${scene.id}`);
  const m = MULTILINGUAL_SCENES[scene.id];
  for (const code of requiredLangCodes) {
    assert(m[code] && typeof m[code] === 'string' && m[code].length > 10,
      `Scene ${scene.id} missing narration text for language ${code}`);
    const queried = getSceneNarration(scene.id, code);
    assert.strictEqual(queried, m[code], `getSceneNarration failed for ${scene.id} in ${code}`);
  }
}
console.log('  ✓ Verified 7-language multilingual database (Hindi, English, Sanskrit, Gujarati, Bengali, Tamil, Telugu)');

console.log('✅ Ramayana Katha feature test suite passed with 100% compliance!');
