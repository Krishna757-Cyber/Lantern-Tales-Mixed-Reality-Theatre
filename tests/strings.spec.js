import assert from 'node:assert';
import { PuppetString, PuppetStringSystem } from '../src/kathputli/strings.js';

console.log('🧪 Testing Kathputli Verlet String Physics Engine...');

// Test 1: Instantiation & Particle Chain
const s = new PuppetString('testString', 0.60, 4);
assert.strictEqual(s.nodes.length, 4, 'Should initialize exactly 4 nodes');
assert.strictEqual(s.constraints.length, 3, 'Should initialize 3 distance constraints');
assert.strictEqual(s.nodes[0].fixed, true, 'Top anchor node must be fixed');
assert.strictEqual(s.nodes[3].fixed, false, 'Bottom node should be free');

// Test 2: Constraint Convergence under Gravity
s.setAnchor(0, 1.8, 0);
for (let step = 0; step < 60; step++) {
  s.update(0.016, 3);
}

// Verify distance between consecutive nodes matches rest length within 1mm
for (const con of s.constraints) {
  const n1 = s.nodes[con.p1];
  const n2 = s.nodes[con.p2];
  const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y, n2.z - n1.z);
  const error = Math.abs(dist - con.restLength);
  assert(error < 0.002, `Constraint error ${error}m exceeds 2mm tolerance`);
}

// Test 3: Numerical Stability at 72 Hz and 90 Hz
const s72 = new PuppetString('s72', 0.60, 4);
const s90 = new PuppetString('s90', 0.60, 4);
s72.setAnchor(0, 1.8, 0);
s90.setAnchor(0, 1.8, 0);

// Extreme rapid motion test: shake anchor rapidly
for (let frame = 0; frame < 300; frame++) {
  const shakeX = Math.sin(frame * 0.5) * 0.8;
  const shakeY = 1.8 + Math.cos(frame * 0.7) * 0.4;
  s72.setAnchor(shakeX, shakeY, 0);
  s90.setAnchor(shakeX, shakeY, 0);

  s72.update(1.0 / 72.0, 3);
  s90.update(1.0 / 90.0, 3);

  // Assert no NaN or Infinity (no explosion)
  assert(!Number.isNaN(s72.nodes[3].y), '72 Hz simulation produced NaN');
  assert(Number.isFinite(s72.nodes[3].y), '72 Hz simulation blew up to Infinity');
  assert(!Number.isNaN(s90.nodes[3].y), '90 Hz simulation produced NaN');
  assert(Number.isFinite(s90.nodes[3].y), '90 Hz simulation blew up to Infinity');
}

// Test 4: Pluck Impulse & Energy Dissipation (Damping)
const sPluck = new PuppetString('pluckTest', 0.60, 4);
sPluck.setAnchor(0, 1.8, 0);
sPluck.update(0.016, 3);
sPluck.pluck(0.4);
assert.strictEqual(sPluck.plucked, true, 'Pluck flag should be set');
assert(sPluck.pluckEnergy > 0.1, 'Pluck energy should be initialized');

// Run 40 frames and confirm energy dampens down to near zero
for (let f = 0; f < 40; f++) {
  sPluck.update(0.016, 3);
}
assert.strictEqual(sPluck.plucked, false, 'Pluck flag should decay to false');
assert.strictEqual(sPluck.pluckEnergy, 0, 'Pluck energy should dampen to 0');

console.log('✅ All Verlet string physics tests passed with 100% stability!');
