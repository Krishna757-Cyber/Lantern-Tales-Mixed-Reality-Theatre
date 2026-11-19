import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const actsDir = join(__dirname, '..', 'src', 'story', 'acts');

console.log('🧪 Testing Kathputli Folk Show JSON Acts...');

const expectedActIds = ['anarkali', 'ghodi', 'sapera', 'amarsingh', 'mela'];

for (const actId of expectedActIds) {
  const filePath = join(actsDir, `${actId}.json`);
  const content = readFileSync(filePath, 'utf8');
  const act = JSON.parse(content);

  // 1. Root structure
  assert.strictEqual(act.id, actId, `Act ID mismatch: ${act.id}`);
  assert(act.title && typeof act.title === 'string', 'Act must have valid title');
  assert(act.durationSeconds >= 180, 'Each act must be 3 to 4 minutes (>= 180s)');
  assert(Array.isArray(act.beats), 'Act must have a beats array');
  assert.strictEqual(act.beats.length, 5, `Each act must have exactly 5 performance beats (found ${act.beats.length})`);

  // 2. Validate performance beats
  for (let b = 0; b < act.beats.length; b++) {
    const beat = act.beats[b];
    assert.strictEqual(beat.beat, b + 1, `Beat index should be sequential (expected ${b + 1})`);
    assert(beat.name && typeof beat.name === 'string', 'Beat must have a name');
    assert(beat.instructionIcon && typeof beat.instructionIcon === 'string', 'Beat must have an instructionIcon');
    assert(beat.targetAction && typeof beat.targetAction === 'string', 'Beat must define targetAction');
    assert(beat.soundCue && typeof beat.soundCue === 'string', 'Beat must define soundCue');
  }

  // 3. Meet the Maker card validation
  assert(act.meetTheMaker, 'Act must conclude with a "Meet the Maker" card');
  assert(act.meetTheMaker.artisanCraft, 'Maker card must specify artisan craft technique');
  assert(act.meetTheMaker.description, 'Maker card must describe the handmade craft');
  assert(act.meetTheMaker.communityDedication, 'Maker card must credit the Bhat community tradition');

  console.log(`  ✓ Validated act: "${act.title}" (${act.beats.length} beats, Maker card verified)`);
}

console.log('✅ All 5 Kathputli folk show acts conform to schema with cultural care!');
