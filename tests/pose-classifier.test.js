import assert from 'node:assert';
import { classifyPose } from '../src/recognizer/poses.js';

console.log('🧪 Testing Pose Classifier...');

const synth = (ext, pinch) => {
  const j = [];
  for (let i = 0; i < 25; i++) j.push({ x: 0.5, y: 0.5 });
  j[0] = { x: 0.5, y: 0.8 }; // wrist
  const set = (tip, pip, on) => {
    j[tip] = { x: 0.5, y: on ? 0.2 : 0.75 };
    j[pip] = { x: 0.5, y: 0.5 };
  };
  set(8, 6, ext.i);
  set(12, 10, ext.m);
  set(16, 14, ext.r);
  set(20, 18, ext.p);
  j[4] = pinch ? { x: 0.52, y: 0.22 } : { x: ext.t ? 0.3 : 0.45, y: 0.6 };
  return j;
};

// Test Kindle (Open palm)
const kindleJoints = synth({ t: 1, i: 1, m: 1, r: 1, p: 1 }, false);
assert.strictEqual(classifyPose(kindleJoints).pose, 1, 'Should recognize Pose 1 (Kindle)');

// Test Beak (Pinch)
const beakJoints = synth({ t: 0, i: 1, m: 0, r: 0, p: 0 }, true);
assert.strictEqual(classifyPose(beakJoints).pose, 2, 'Should recognize Pose 2 (Beak)');

// Test Pebble (Clenched fist)
const pebbleJoints = synth({ t: 0, i: 0, m: 0, r: 0, p: 0 }, false);
assert.strictEqual(classifyPose(pebbleJoints).pose, 3, 'Should recognize Pose 3 (Pebble)');

// Test Guide (Point)
const guideJoints = synth({ t: 0, i: 1, m: 0, r: 0, p: 0 }, false);
assert.strictEqual(classifyPose(guideJoints).pose, 4, 'Should recognize Pose 4 (Guide)');

// Test Wings (Victory)
const wingsJoints = synth({ t: 0, i: 1, m: 1, r: 0, p: 0 }, false);
assert.strictEqual(classifyPose(wingsJoints).pose, 5, 'Should recognize Pose 5 (Wings)');

console.log('✅ All pose classifier tests passed successfully!');
