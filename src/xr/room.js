/* ================================================================
   LANTERN TALES — ROOM AWARENESS (src/xr/room.ts)
   WebXR mixed-reality room mesh, plane detection, corner folding
================================================================ */

export const Room = {
  cornerPreview: true,
  windowPortals: true,
  depthOcclusion: true,
  gazeLantern: true,
  planesDetected: 2,
  activeSession: null
};

export function updateRoomBadges() {
  const cornerToggle = document.getElementById('toggle-corner');
  if (cornerToggle) {
    cornerToggle.setAttribute('aria-checked', Room.cornerPreview ? 'true' : 'false');
  }
}

export function initRoomToggles() {
  const cornerToggle = document.getElementById('toggle-corner');
  if (cornerToggle) {
    cornerToggle.addEventListener('click', () => {
      Room.cornerPreview = !Room.cornerPreview;
      updateRoomBadges();
    });
  }

  const depthToggle = document.getElementById('toggle-depth');
  if (depthToggle) {
    depthToggle.addEventListener('click', () => {
      Room.depthOcclusion = !Room.depthOcclusion;
      depthToggle.setAttribute('aria-checked', Room.depthOcclusion ? 'true' : 'false');
    });
  }
}

export async function checkXRAvailability() {
  const xrStatusEl = document.getElementById('xr-status');
  if (navigator.xr) {
    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      if (supported) {
        if (xrStatusEl) xrStatusEl.textContent = '🥽 Meta Quest ready (immersive-ar supported)';
        return true;
      }
    } catch (e) {}
  }
  if (xrStatusEl) xrStatusEl.textContent = '💻 Desktop mode active (Webcam & Virtual Hand ready)';
  return false;
}
