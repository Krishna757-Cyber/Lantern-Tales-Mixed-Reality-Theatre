/* ================================================================
   LANTERN TALES — NAVIGATION & ROUTER MODULE (src/ui/navigation.ts)
   Hash routing, view switching, accessibility announcements
================================================================ */

export const VIEWS = ['home', 'play', 'theatre', 'poses', 'stories', 'judges'];
export let currentView = 'home';

export function setView(viewName, onStageResize = null) {
  if (!VIEWS.includes(viewName)) viewName = 'home';
  currentView = viewName;

  VIEWS.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.toggle('active', v === viewName);
  });

  document.querySelectorAll('.nav-link[data-view]').forEach(btn => {
    const active = btn.dataset.view === viewName;
    if (btn.closest('nav')) {
      btn.classList.toggle('text-amber', active);
    }
  });

  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) mobileMenu.classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    history.replaceState(null, '', `#/${viewName}`);
  } catch (e) {}

  if (viewName === 'play' && typeof onStageResize === 'function') {
    requestAnimationFrame(onStageResize);
  } else if (viewName === 'home') {
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('viewchange', { detail: { view: 'home' } }));
      window.dispatchEvent(new Event('resize'));
    });
  }
  window.dispatchEvent(new CustomEvent('viewchange', { detail: { view: viewName } }));

  announceView(viewName);
}

function announceView(v) {
  const names = {
    home: 'Home',
    play: 'Play stage',
    theatre: 'Rang Manch Virtual Theatre',
    poses: 'Pose guide',
    stories: 'Stories & Credits',
    judges: 'Judges readme'
  };
  let liveRegion = document.getElementById('sr-live');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-live';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-9999px';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = (names[v] || v) + ' shown.';
}

export function initNavigation(onStageResize = null) {
  document.querySelectorAll('.nav-link[data-view]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setView(btn.dataset.view, onStageResize);
    });
  });

  const mobBtn = document.getElementById('btn-mobile-menu');
  if (mobBtn) {
    mobBtn.addEventListener('click', () => {
      const mobMenu = document.getElementById('mobile-menu');
      if (mobMenu) {
        mobMenu.classList.toggle('hidden');
        mobBtn.setAttribute('aria-expanded', mobMenu.classList.contains('hidden') ? 'false' : 'true');
      }
    });
  }

  // Initial route handling
  let initial = 'home';
  try {
    const m = (location.hash || '').match(/#\/(\w+)/);
    if (m && VIEWS.includes(m[1])) initial = m[1];
  } catch (e) {}
  setView(initial, onStageResize);
}
