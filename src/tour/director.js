/* ================================================================
   LANTERN TALES — TOUR DIRECTOR (src/tour/director.ts)
   90-second Director's Cut automated demonstration engine
================================================================ */

import { Stage, dropPebble, flyCrow } from '../stage/renderer.js';

export const Tour = {
  active: false,
  t: 0,
  idx: -1,
  steps: [
    {
      t: 0,
      icon: '◉',
      act: 'ACT 1 • OVERTURE',
      text: 'Welcome — settle in, hands in lap. The tour plays itself.',
      run() {
        Stage.lanternLit = false;
        Stage.water = 0.18;
      }
    },
    {
      t: 5,
      icon: '🕯️',
      act: 'ACT 1 • KINDLING',
      text: 'Kindle — an open palm wakes the lantern.',
      run() {
        Stage.lanternLit = true;
      }
    },
    {
      t: 15,
      icon: '◑',
      act: 'ACT 1 • THE BEAK',
      text: 'Beak — pinch, and a beak-shadow opens on the parchment.',
      run() {}
    },
    {
      t: 28,
      icon: '🦅',
      act: 'ACT 1 • BEAK BECOMES CROW',
      text: 'Crow — hold still… the beak shivers and lifts off as a crow.',
      run() {
        flyCrow();
      }
    },
    {
      t: 42,
      icon: '⬤',
      act: 'ACT 1 • RISING WATER',
      text: 'Pebbles — fists drop glowing stones. Watch the water rise.',
      run() {
        let n = 0;
        const iv = setInterval(() => {
          dropPebble();
          if (++n >= 4) clearInterval(iv);
        }, 700);
      }
    },
    {
      t: 65,
      icon: '🤝',
      act: 'ACT 1 • THE DUET',
      text: 'Duet — a stranger’s shadow hand reaches across your wall and meets yours.',
      run() {}
    },
    {
      t: 85,
      icon: '🏮',
      act: 'ACT 1 • FINALE',
      text: 'Finale — your wall remembers the stories told tonight.',
      run() {}
    }
  ]
};

export function startTour(onCaptionUpdate = null) {
  Tour.active = true;
  Tour.t = 0;
  Tour.idx = -1;
  const captionEl = document.getElementById('tour-caption');
  if (captionEl) captionEl.classList.remove('hidden');
}

export function stopTour(reason = '') {
  Tour.active = false;
  const captionEl = document.getElementById('tour-caption');
  if (captionEl) captionEl.classList.add('hidden');
}

export function updateTour(dt, onCaptionUpdate = null) {
  if (!Tour.active) return;
  Tour.t += dt;

  for (let i = Tour.steps.length - 1; i >= 0; i--) {
    if (Tour.t >= Tour.steps[i].t) {
      if (Tour.idx !== i) {
        Tour.idx = i;
        Tour.steps[i].run();
        if (typeof onCaptionUpdate === 'function') {
          onCaptionUpdate(Tour.steps[i], Tour.t);
        }
      }
      break;
    }
  }

  if (Tour.t >= 90) {
    stopTour('Tour completed.');
  }
}
