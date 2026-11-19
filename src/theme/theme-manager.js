/* ================================================================
   LANTERN TALES — THEME MANAGER MODULE
   Manages Dark, Light, Presets & Custom Studio State
================================================================ */

export const THEME_PRESETS = {
  dark: {
    name: 'Dark',
    icon: '🌑',
    ink: '#0B0A10',
    amber: '#FFB347',
    parchment: '#F4E8D0',
    vermilion: '#C8462B',
    indigo: '#10132A',
    display: 'Fraunces',
    body: 'Inter'
  },
  light: {
    name: 'Light',
    icon: '🌕',
    ink: '#2C1A0E',
    amber: '#D4820A',
    parchment: '#FFFAF0',
    vermilion: '#B03020',
    indigo: '#E8EAF6',
    display: 'Fraunces',
    body: 'Inter'
  },
  vermilion: {
    name: 'Vermilion',
    icon: '🔴',
    ink: '#1A0808',
    amber: '#FF9F43',
    parchment: '#FDF5E6',
    vermilion: '#E74C3C',
    indigo: '#2D0C15',
    display: 'Crimson Pro',
    body: 'DM Sans'
  },
  jade: {
    name: 'Jade',
    icon: '🌿',
    ink: '#08140E',
    amber: '#6EE7B7',
    parchment: '#E8F5E9',
    vermilion: '#E67E22',
    indigo: '#092218',
    display: 'Lora',
    body: 'Inter'
  },
  moon: {
    name: 'Moon',
    icon: '🌙',
    ink: '#080914',
    amber: '#93C5FD',
    parchment: '#F0F4F8',
    vermilion: '#EC4899',
    indigo: '#1E1B4B',
    display: 'Josefin Sans',
    body: 'DM Sans'
  }
};

export const PRESET_KEYS = ['dark', 'light', 'vermilion', 'jade', 'moon'];

export let currentThemeMode = 'dark';
export let customThemeConfig = {
  ink: '#0B0A10',
  amber: '#FFB347',
  parchment: '#F4E8D0',
  vermilion: '#C8462B',
  indigo: '#10132A',
  display: 'Fraunces',
  body: 'Inter'
};

export function getThemeState() {
  return { currentThemeMode, customThemeConfig };
}

export function loadSavedTheme() {
  try {
    const savedMode = localStorage.getItem('lt_theme');
    if (savedMode && (THEME_PRESETS[savedMode] || savedMode === 'custom')) {
      currentThemeMode = savedMode;
    }
    const savedCustom = JSON.parse(localStorage.getItem('lt_custom_theme') || 'null');
    if (savedCustom) {
      Object.assign(customThemeConfig, savedCustom);
    }
  } catch (e) {
    console.warn('[Theme] Error loading from localStorage:', e);
  }
}

export function openTheme(open) {
  const drawer = document.getElementById('theme-drawer');
  if (!drawer) return;
  drawer.classList.toggle('translate-x-full', !open);
  drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
  if (open) {
    const closeBtn = document.getElementById('btn-close-theme');
    if (closeBtn) closeBtn.focus();
  }
}

export function applyTheme(mode, notify = false, toastFn = null) {
  currentThemeMode = mode;
  try {
    localStorage.setItem('lt_theme', mode);
  } catch (e) {}

  const root = document.documentElement;

  if (mode === 'custom') {
    root.setAttribute('data-theme', 'custom');
    root.style.setProperty('--ink', customThemeConfig.ink);
    root.style.setProperty('--amber', customThemeConfig.amber);
    root.style.setProperty('--parchment', customThemeConfig.parchment);
    root.style.setProperty('--vermilion', customThemeConfig.vermilion);
    root.style.setProperty('--indigo', customThemeConfig.indigo);
    root.style.setProperty('--font-display', customThemeConfig.display);
    root.style.setProperty('--font-body', customThemeConfig.body);

    const iconEl = document.getElementById('theme-icon');
    const nameEl = document.getElementById('theme-name');
    const mobEl = document.getElementById('btn-theme-mobile');
    const badgeEl = document.getElementById('custom-badge');

    if (iconEl) iconEl.textContent = '🎨';
    if (nameEl) nameEl.textContent = 'Custom';
    if (mobEl) mobEl.textContent = '🎨 Custom Theme';
    if (badgeEl) {
      badgeEl.textContent = 'Active in Custom';
      badgeEl.className = 'text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber text-ink font-bold';
    }

    document.querySelectorAll('.theme-preset-btn').forEach(btn => {
      btn.classList.remove('border-amber', 'bg-amber/10');
    });
  } else {
    // Clear inline overrides so CSS preset styles take effect
    root.style.removeProperty('--ink');
    root.style.removeProperty('--amber');
    root.style.removeProperty('--parchment');
    root.style.removeProperty('--vermilion');
    root.style.removeProperty('--indigo');
    root.style.removeProperty('--font-display');
    root.style.removeProperty('--font-body');

    root.setAttribute('data-theme', mode);
    const preset = THEME_PRESETS[mode] || THEME_PRESETS.dark;

    const iconEl = document.getElementById('theme-icon');
    const nameEl = document.getElementById('theme-name');
    const mobEl = document.getElementById('btn-theme-mobile');
    const badgeEl = document.getElementById('custom-badge');

    if (iconEl) iconEl.textContent = preset.icon;
    if (nameEl) nameEl.textContent = preset.name;
    if (mobEl) mobEl.textContent = `${preset.icon} ${preset.name} Theme`;
    if (badgeEl) {
      badgeEl.textContent = 'Preset Mode';
      badgeEl.className = 'text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-parchment/15 text-parchment/70';
    }

    document.querySelectorAll('.theme-preset-btn').forEach(btn => {
      const active = btn.dataset.themeSet === mode;
      btn.classList.toggle('border-amber', active);
      btn.classList.toggle('bg-amber/10', active);
    });

    // Populate pickers with active preset colors
    ['ink', 'amber', 'parchment', 'vermilion', 'indigo'].forEach(k => {
      const pEl = document.getElementById(`picker-${k}`);
      const vEl = document.getElementById(`val-color-${k}`);
      if (pEl) pEl.value = preset[k];
      if (vEl) vEl.textContent = preset[k];
    });

    const dispSel = document.getElementById('select-font-display');
    const bodySel = document.getElementById('select-font-body');
    if (dispSel) dispSel.value = preset.display;
    if (bodySel) bodySel.value = preset.body;
  }

  if (notify && typeof toastFn === 'function') {
    toastFn(`Theme → ${mode.toUpperCase()}`);
  }
}

export function cycleTheme(toastFn = null) {
  const curIdx = PRESET_KEYS.indexOf(currentThemeMode);
  const nextIdx = (curIdx + 1) % PRESET_KEYS.length;
  applyTheme(PRESET_KEYS[nextIdx], true, toastFn);
}

export function initThemeManager(toastFn = null) {
  loadSavedTheme();
  applyTheme(currentThemeMode, false, toastFn);

  // Wire up theme toggles and buttons
  const toggleBtn = document.getElementById('btn-theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', e => {
      if (e.shiftKey) openTheme(true);
      else cycleTheme(toastFn);
    });
  }

  const customBtn = document.getElementById('btn-theme-customize');
  if (customBtn) {
    customBtn.addEventListener('click', () => openTheme(true));
  }

  const mobThemeBtn = document.getElementById('btn-theme-mobile');
  if (mobThemeBtn) {
    mobThemeBtn.addEventListener('click', () => cycleTheme(toastFn));
  }

  const mobCustomBtn = document.getElementById('btn-theme-custom-mobile');
  if (mobCustomBtn) {
    mobCustomBtn.addEventListener('click', () => {
      const mobMenu = document.getElementById('mobile-menu');
      if (mobMenu) mobMenu.classList.add('hidden');
      openTheme(true);
    });
  }

  const closeThemeBtn = document.getElementById('btn-close-theme');
  if (closeThemeBtn) {
    closeThemeBtn.addEventListener('click', () => openTheme(false));
  }

  document.querySelectorAll('.theme-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themeSet, true, toastFn);
    });
  });

  ['ink', 'amber', 'parchment', 'vermilion', 'indigo'].forEach(key => {
    const picker = document.getElementById(`picker-${key}`);
    const valLabel = document.getElementById(`val-color-${key}`);
    if (!picker) return;
    picker.addEventListener('input', e => {
      const val = e.target.value;
      if (valLabel) valLabel.textContent = val;
      customThemeConfig[key] = val;
      try {
        localStorage.setItem('lt_custom_theme', JSON.stringify(customThemeConfig));
      } catch (err) {}
      applyTheme('custom', false, toastFn);
    });
  });

  const fontDispSelect = document.getElementById('select-font-display');
  if (fontDispSelect) {
    fontDispSelect.addEventListener('change', e => {
      customThemeConfig.display = e.target.value;
      try {
        localStorage.setItem('lt_custom_theme', JSON.stringify(customThemeConfig));
      } catch (err) {}
      applyTheme('custom', false, toastFn);
    });
  }

  const fontBodySelect = document.getElementById('select-font-body');
  if (fontBodySelect) {
    fontBodySelect.addEventListener('change', e => {
      customThemeConfig.body = e.target.value;
      try {
        localStorage.setItem('lt_custom_theme', JSON.stringify(customThemeConfig));
      } catch (err) {}
      applyTheme('custom', false, toastFn);
    });
  }

  const resetBtn = document.getElementById('btn-theme-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      customThemeConfig = {
        ink: '#0B0A10',
        amber: '#FFB347',
        parchment: '#F4E8D0',
        vermilion: '#C8462B',
        indigo: '#10132A',
        display: 'Fraunces',
        body: 'Inter'
      };
      try {
        localStorage.removeItem('lt_custom_theme');
      } catch (err) {}
      applyTheme('dark', true, toastFn);
    });
  }

  const saveBtn = document.getElementById('btn-theme-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      openTheme(false);
      if (typeof toastFn === 'function') {
        toastFn('🎨 Theme preferences saved ✓');
      }
    });
  }
}
