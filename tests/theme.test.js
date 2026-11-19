import assert from 'node:assert';
import { THEME_PRESETS, PRESET_KEYS } from '../src/theme/theme-manager.js';

console.log('🧪 Testing Theme System...');

assert(PRESET_KEYS.length === 5, 'Should have 5 core theme presets');
assert(THEME_PRESETS.dark, 'Should have dark preset');
assert(THEME_PRESETS.light, 'Should have light preset');
assert(THEME_PRESETS.vermilion, 'Should have vermilion preset');
assert(THEME_PRESETS.jade, 'Should have jade preset');
assert(THEME_PRESETS.moon, 'Should have moon preset');

assert.strictEqual(THEME_PRESETS.dark.ink, '#0B0A10', 'Dark ink should be #0B0A10');
assert.strictEqual(THEME_PRESETS.light.ink, '#2C1A0E', 'Light ink should be #2C1A0E');
assert.strictEqual(THEME_PRESETS.vermilion.vermilion, '#E74C3C', 'Vermilion preset should have royal crimson accent');

console.log('✅ All theme system tests passed successfully!');
