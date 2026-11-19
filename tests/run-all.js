import { spawnSync } from 'node:child_process';

console.log('====================================================');
console.log('       LANTERN TALES (CHHAYA) — TEST SUITE          ');
console.log('====================================================');

const tests = [
  'tests/pose-classifier.test.js',
  'tests/theme.test.js',
  'tests/api.test.js',
  'tests/strings.spec.js',
  'tests/controls.spec.js',
  'tests/kframes.spec.js',
  'tests/acts-kathputli.spec.js'
];

let allPassed = true;

for (const t of tests) {
  console.log(`\n▶ Running: ${t}`);
  const result = spawnSync('node', [t], { stdio: 'inherit' });
  if (result.status !== 0) {
    allPassed = false;
    console.error(`❌ ${t} failed with exit code ${result.status}`);
  }
}

if (allPassed) {
  console.log('\n====================================================');
  console.log('🎉 ALL SUITES PASSED — 100% GREEN! Ready for judging.');
  console.log('====================================================');
  process.exit(0);
} else {
  console.error('\n❌ SOME TESTS FAILED');
  process.exit(1);
}
