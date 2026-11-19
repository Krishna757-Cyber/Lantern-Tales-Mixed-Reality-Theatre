import assert from 'node:assert';
import { KathputliRig } from '../src/kathputli/rig.js';
import { KathputliController } from '../src/kathputli/controls.js';

console.log('🧪 Testing Kathputli Hand Tracking & Controls...');

// Test 1: Instantiation & Target Crossbar
const rig = new KathputliRig({ name: 'AnarkaliTest' });
const controller = new KathputliController(rig, { mode: 'hands' });

assert.strictEqual(controller.mode, 'hands');
assert(rig.stringSystem.getString('head'), 'Head string must exist on rig');

// Test 2: Hand Coordinates Mapping
const mockHand = {
  present: true,
  x: 0.75, // Off-center right
  y: 0.20, // High hand
  z: -0.4,
  wristRoll: 0.35,
  isPinching: false,
  pinchDistance: 0.08
};

controller.updateFromHand(mockHand, null, 0.016);
assert(rig.crossbar.x > 0.2, 'Crossbar X should map to right side');
assert(rig.crossbar.y > 1.6, 'High hand Y should lift crossbar up');
assert(Math.abs(rig.crossbar.roll - 0.35 * 0.8) < 0.01, 'Crossbar roll should follow wrist roll');

// Test 3: Pinch to Pluck Triggering
// Frame 1: Pinch start
mockHand.isPinching = true;
mockHand.pinchDistance = 0.01;
controller.updateFromHand(mockHand, null, 0.016);
assert.strictEqual(controller.wasPinching, true);

// Advance time slightly to satisfy debouncer
controller.lastPluckTime = -1000;

// Frame 2: Pinch release (triggers pluck)
mockHand.isPinching = false;
mockHand.pinchDistance = 0.06;
controller.updateFromHand(mockHand, null, 0.016);
assert.strictEqual(rig.nodProgress, 1.0, 'Pinch release should set nodProgress on puppet rig');

// Test 4: Mouse Fallback Controller
controller.updateFromMouse(0.4, 0.8, false, 0.016);
assert(rig.crossbar.x > 0.3, 'Mouse X should drive crossbar');
assert(rig.crossbar.y > 1.5, 'Mouse Y should lift crossbar');

// Test 5: Ghost Playback Updates
controller.updateGhost(2.5);
assert(Number.isFinite(rig.crossbar.x), 'Ghost crossbar X must be finite');
assert(Number.isFinite(rig.crossbar.y), 'Ghost crossbar Y must be finite');

console.log('✅ All hand controller and fallback tests passed successfully!');
