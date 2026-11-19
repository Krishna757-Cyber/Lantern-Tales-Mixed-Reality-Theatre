import assert from 'node:assert';
import { encodeKathputliFrame, decodeKathputliFrame } from '../src/net/kathputliFrames.js';

console.log('🧪 Testing Kathputli Network Frame Protocol...');

// Test 1: Byte Budget Check (Strictly <= 32 bytes)
const testState = {
  x: 0.345,
  y: 1.625,
  z: -0.412,
  roll: 0.28,
  pitch: -0.15,
  yaw: 0.52,
  pluckHead: true,
  pluckLeft: false,
  pluckRight: true,
  pluckWaist: false,
  isDancing: true,
  timestamp: 12345678,
  puppetTypeId: 1
};

const buffer = encodeKathputliFrame(testState);
assert(buffer instanceof ArrayBuffer, 'Encoded frame must be an ArrayBuffer');
assert(buffer.byteLength <= 32, `Frame size ${buffer.byteLength} exceeds 32-byte budget`);
console.log(`📦 Kathputli frame binary size: ${buffer.byteLength} bytes (Budget: 32 bytes)`);

// Test 2: Roundtrip Precision Decoding
const decoded = decodeKathputliFrame(buffer);

// Position precision check (within 2mm)
assert(Math.abs(decoded.x - testState.x) < 0.002, `X error too large: ${decoded.x} vs ${testState.x}`);
assert(Math.abs(decoded.y - testState.y) < 0.002, `Y error too large: ${decoded.y} vs ${testState.y}`);
assert(Math.abs(decoded.z - testState.z) < 0.002, `Z error too large: ${decoded.z} vs ${testState.z}`);

// Angle precision check (within 0.03 rad)
assert(Math.abs(decoded.roll - testState.roll) < 0.03, `Roll error: ${decoded.roll} vs ${testState.roll}`);
assert(Math.abs(decoded.pitch - testState.pitch) < 0.03, `Pitch error: ${decoded.pitch} vs ${testState.pitch}`);
assert(Math.abs(decoded.yaw - testState.yaw) < 0.03, `Yaw error: ${decoded.yaw} vs ${testState.yaw}`);

// Bitmask flags check
assert.strictEqual(decoded.pluckHead, true, 'Head pluck bit must match');
assert.strictEqual(decoded.pluckLeft, false, 'Left pluck bit must match');
assert.strictEqual(decoded.pluckRight, true, 'Right pluck bit must match');
assert.strictEqual(decoded.pluckWaist, false, 'Waist pluck bit must match');
assert.strictEqual(decoded.isDancing, true, 'Dancing bit must match');
assert.strictEqual(decoded.timestamp, testState.timestamp, 'Timestamp must match');
assert.strictEqual(decoded.puppetTypeId, 1, 'Puppet type id must match');

console.log('✅ All network frame protocol tests passed within precision bounds!');
