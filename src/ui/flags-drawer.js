/* ================================================================
   LANTERN TALES — FEATURE FLAGS DRAWER (src/ui/flags-drawer.ts)
   Live toggling of runtime features & exports flags.ts code
================================================================ */

export const FLAG_DEFS = [
  ['webcamMode', 'Webcam Mode (MediaPipe, on-device)', true],
  ['autoTour', "Director's Cut auto-tour (?tour=1)", true],
  ['showcaseSite', 'Showcase site and stage views', true],
  ['theatre', 'Rang Manch Virtual Theatre (?theatre=1)', true],
  ['backstageWorkshop', 'Backstage Kathputli Workshop', true],
  ['duetMultiplayer', 'Two-Player Puppet Duet', true],
  ['cornerFold', 'Corner fold bend (XR + preview)', true],
  ['windowPortals', 'Window moon/sun portals', true],
  ['depthOcclusion', 'Depth occlusion (soft edge)', true],
  ['gazeLantern', 'Gaze-following lantern', true]
];

export let FLAGS = {};
try {
  FLAGS = JSON.parse(localStorage.getItem('lt_flags') || '{}');
} catch (e) {
  FLAGS = {};
}
FLAG_DEFS.forEach(([k, , d]) => {
  if (!(k in FLAGS)) FLAGS[k] = d;
});

export function saveFlags() {
  try {
    localStorage.setItem('lt_flags', JSON.stringify(FLAGS));
  } catch (e) {}
  renderFlagsCode();
}

export function openFlags(open) {
  const drawer = document.getElementById('flags-drawer');
  if (!drawer) return;
  drawer.classList.toggle('translate-x-full', !open);
  drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open) {
    const closeBtn = document.getElementById('btn-close-flags');
    if (closeBtn) closeBtn.focus();
  }
}

export function renderFlagsCode() {
  const code = `// src/app/flags.ts — each feature flagged\nexport const FLAGS = {\n${FLAG_DEFS.map(
    ([k]) => `  ${k}: ${FLAGS[k] ? 'true ' : 'false'},`
  ).join('\n')}\n} as const;`;

  const drawerCode = document.getElementById('flags-code-drawer');
  if (drawerCode) drawerCode.textContent = code;
}

export function initFlagsDrawer(toastFn = null) {
  const listEl = document.getElementById('flags-list');
  if (listEl) {
    listEl.innerHTML = '';
    FLAG_DEFS.forEach(([k, label]) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between gap-3 bg-ink/60 border border-parchment/10 rounded-xl px-4 py-3';
      row.innerHTML = `<div><p class="text-sm font-semibold font-mono text-amber">${k}</p><p class="text-xs text-parchment/60">${label}</p></div>`;

      const toggle = document.createElement('div');
      toggle.className = 'toggle';
      toggle.setAttribute('role', 'switch');
      toggle.setAttribute('tabindex', '0');
      toggle.setAttribute('aria-checked', FLAGS[k] ? 'true' : 'false');
      toggle.setAttribute('aria-label', k);

      const flip = () => {
        FLAGS[k] = !FLAGS[k];
        toggle.setAttribute('aria-checked', FLAGS[k] ? 'true' : 'false');
        saveFlags();
        if (typeof toastFn === 'function') {
          toastFn(`Flag ${k} → ${FLAGS[k] ? 'ON' : 'OFF'}`);
        }
      };

      toggle.addEventListener('click', flip);
      toggle.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          flip();
        }
      });

      row.appendChild(toggle);
      listEl.appendChild(row);
    });
  }

  const openBtn = document.getElementById('btn-flags');
  const closeBtn = document.getElementById('btn-close-flags');
  if (openBtn) openBtn.addEventListener('click', () => openFlags(true));
  if (closeBtn) closeBtn.addEventListener('click', () => openFlags(false));

  renderFlagsCode();
}
