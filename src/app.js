/* ================================================================
   LANTERN TALES — MAIN APPLICATION ENTRYPOINT (src/app.ts)
   Orchestrates frontend subsystems, WebXR, Three.js, Canvas & WebSocket
================================================================ */

import { initThemeManager, openTheme } from './theme/theme-manager.js';
import { POSES, classifyPose } from './recognizer/poses.js';
import { VirtualInput, initVirtualInput, setVirtualPose } from './input/virtual.js';
import { WebcamInput, requestWebcamStream, stopWebcamStream } from './input/webcam.js';
import { Stage, initStage, updateStage, drawStage, dropPebble, flyCrow } from './stage/renderer.js';
import { Tour, startTour, stopTour, updateTour } from './tour/director.js';
import { Room, initRoomToggles, checkXRAvailability, updateRoomBadges } from './xr/room.js';
import { initHeroScene } from './hero/hero-scene.js';
import { initTheatreView } from './theatre/theatre-app.js';
import { Multiplayer, connectToRoom, sendHandUpdate } from './network/multiplayer.js';
import { VIEWS, currentView, setView, initNavigation } from './ui/navigation.js';
import { FLAGS, initFlagsDrawer, openFlags } from './ui/flags-drawer.js';
import { runSmokeTest } from './ui/smoke-test.js';

// Global toast system
export function toast(msg, type = 'info') {
  const container = document.getElementById('toasts');
  if (!container) return;
  const d = document.createElement('div');
  d.className = 'text-[13px] px-4 py-3 rounded-xl border shadow-xl ' +
    (type === 'warn' ? 'bg-vermilion text-white border-vermilion' : 'bg-parchment text-ink border-parchment');
  d.textContent = msg;
  container.appendChild(d);
  setTimeout(() => {
    d.style.opacity = '0';
    d.style.transition = '0.4s';
    setTimeout(() => d.remove(), 400);
  }, 3200);
}

// Stage canvas and context
const stageCanvas = document.getElementById('stage');
const ctx = stageCanvas ? stageCanvas.getContext('2d') : null;

function sizeStage() {
  if (!stageCanvas) return;
  const wrap = document.getElementById('stage-wrap');
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  stageCanvas.width = rect.width * dpr;
  stageCanvas.height = Math.max(420, rect.width * 0.62) * dpr;
  stageCanvas.style.height = `${Math.max(420, rect.width * 0.62)}px`;
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', () => {
  if (currentView === 'play') sizeStage();
});

// Pose button handlers on stage
function selectPose(poseNum) {
  setVirtualPose(poseNum);
  document.querySelectorAll('.pose-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.pose) === poseNum);
  });
  const hudPose = document.getElementById('hud-pose');
  if (hudPose) hudPose.textContent = poseNum;
  const badge = document.getElementById('pose-badge');
  if (badge) badge.textContent = `Pose ${poseNum} • ${POSES[poseNum]?.name || 'Kindle'}`;
}

// FPS counter
let fpsFrames = 0, lastFpsTime = performance.now(), currentFps = 60;
function tickFPS(now) {
  fpsFrames++;
  if (now - lastFpsTime >= 1000) {
    currentFps = Math.round((fpsFrames * 1000) / (now - lastFpsTime));
    fpsFrames = 0;
    lastFpsTime = now;
    const hudFps = document.getElementById('hud-fps');
    const fpsText = document.getElementById('fps-text');
    if (hudFps) hudFps.textContent = currentFps;
    if (fpsText) fpsText.textContent = `${currentFps} fps`;
  }
}

// Main Render Loop
let lastLoopTime = performance.now();
function appLoop(now) {
  requestAnimationFrame(appLoop);
  tickFPS(now);

  const dt = Math.min((now - lastLoopTime) / 1000, 0.05);
  lastLoopTime = now;

  if (currentView === 'play' && ctx && stageCanvas) {
    updateTour(dt, (step) => {
      const tourText = document.getElementById('tour-text');
      const tourIcon = document.getElementById('tour-icon');
      if (tourText) tourText.textContent = step.text;
      if (tourIcon) tourIcon.textContent = step.icon;
    });

    updateStage(dt, now);

    const activeHand = WebcamInput.active && WebcamInput.hand.present
      ? WebcamInput.hand
      : VirtualInput.hand;

    // Send hand coordinates to multiplayer peers
    if (Multiplayer.connected) {
      sendHandUpdate(activeHand);
    }

    const wrap = document.getElementById('stage-wrap');
    const width = wrap ? wrap.getBoundingClientRect().width : stageCanvas.width;
    const height = parseFloat(stageCanvas.style.height) || width * 0.62;

    const companionHand = Multiplayer.connected && Multiplayer.remoteHand.present
      ? Multiplayer.remoteHand
      : null;

    drawStage(ctx, width, height, now, activeHand, companionHand, {
      cornerPreview: Room.cornerPreview
    });
  }
}

// Global Keyboard Bindings
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, select, textarea')) return;
  const k = e.key;

  if (k >= '1' && k <= '8') {
    if (currentView !== 'play') setView('play', sizeStage);
    selectPose(parseInt(k));
  } else if (k === 't' || k === 'T') {
    Tour.active ? stopTour('Tour stopped.') : startTour();
  } else if (k === 'p' || k === 'P') {
    const drawer = document.getElementById('theme-drawer');
    openTheme(drawer ? drawer.classList.contains('translate-x-full') : true);
  } else if (k === 'c' || k === 'C') {
    document.body.classList.toggle('cinema');
  } else if (k === '?') {
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
      helpModal.classList.remove('hidden');
      helpModal.classList.add('flex');
    }
  } else if (k === 'Escape') {
    openTheme(false);
    openFlags(false);
    document.body.classList.remove('cinema');
    const helpModal = document.getElementById('help-modal');
    if (helpModal) {
      helpModal.classList.add('hidden');
      helpModal.classList.remove('flex');
    }
    if (Tour.active) stopTour('Tour exited.');
  }
});

// Bootstrapping the entire application
window.addEventListener('DOMContentLoaded', async () => {
  console.log('🏮 [Lantern Tales] Initializing modular full-stack client...');

  initThemeManager(toast);
  initFlagsDrawer(toast);
  initRoomToggles();
  updateRoomBadges();
  initNavigation(sizeStage);
  initStage();

  if (stageCanvas) {
    initVirtualInput(stageCanvas, selectPose);
  }

  // Camera permissions
  const btnAllowCam = document.getElementById('btn-allow-cam');
  const btnNoCam = document.getElementById('btn-no-cam');
  const permScreen = document.getElementById('perm-screen');
  const webcamVideo = document.getElementById('webcam-video');

  if (webcamVideo) {
    WebcamInput.videoEl = webcamVideo;
  }

  if (btnAllowCam) {
    btnAllowCam.addEventListener('click', async () => {
      const ok = await requestWebcamStream();
      if (ok) {
        toast('📷 Webcam connected (on-device vision)');
        if (permScreen) permScreen.classList.add('hidden');
      } else {
        toast('Camera unavailable — mouse fallback active', 'warn');
        if (permScreen) permScreen.classList.add('hidden');
      }
    });
  }

  if (btnNoCam && permScreen) {
    btnNoCam.addEventListener('click', () => {
      permScreen.classList.add('hidden');
      toast('🖱️ Using mouse & touch virtual hand');
    });
  }

  const webcamBtn = document.getElementById('webcam-btn');
  if (webcamBtn) {
    webcamBtn.addEventListener('click', () => {
      setView('play', sizeStage);
      if (permScreen) {
        permScreen.classList.remove('hidden');
        permScreen.classList.add('flex');
      }
    });
  }

  // Tour buttons
  const btnTourNav = document.getElementById('btn-tour-nav');
  if (btnTourNav) {
    btnTourNav.addEventListener('click', () => {
      setView('play', sizeStage);
      startTour();
    });
  }

  // Pose button listeners
  document.querySelectorAll('.pose-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectPose(parseInt(btn.dataset.pose));
    });
  });

  document.querySelectorAll('.try-pose').forEach(btn => {
    btn.addEventListener('click', () => {
      setView('play', sizeStage);
      selectPose(parseInt(btn.dataset.pose));
    });
  });

  // Pebble and fly triggers
  const pebbleBtn = document.getElementById('btn-drop-pebble');
  if (pebbleBtn) pebbleBtn.addEventListener('click', dropPebble);

  const flyBtn = document.getElementById('btn-fly-crow');
  if (flyBtn) flyBtn.addEventListener('click', flyCrow);

  // Smoke test button
  const smokeBtn = document.getElementById('btn-smoke');
  const smokeLog = document.getElementById('smoke-log');
  if (smokeBtn && smokeLog) {
    smokeBtn.addEventListener('click', () => runSmokeTest(smokeLog, toast));
  }

  // Help modal close
  const closeHelpBtn = document.getElementById('btn-close-help');
  if (closeHelpBtn) {
    closeHelpBtn.addEventListener('click', () => {
      const helpModal = document.getElementById('help-modal');
      if (helpModal) {
        helpModal.classList.add('hidden');
        helpModal.classList.remove('flex');
      }
    });
  }

  // 3D Hero scene
  const heroCanvas = document.getElementById('hero-canvas');
  const heroContainer = document.getElementById('hero');
  if (heroCanvas && heroContainer) {
    initHeroScene(heroCanvas, heroContainer, toast);
  }

  // 3D Rang Manch Virtual Theatre
  initTheatreView(toast);

  // Connect to Multiplayer WebSocket
  connectToRoom('STAGE1', 'host');

  // Check WebXR
  checkXRAvailability();

  sizeStage();
  requestAnimationFrame(appLoop);

  // URL flags & routing checks
  const params = new URLSearchParams(window.location.search);
  if (params.get('theatre') === '1') {
    setTimeout(() => {
      setView('theatre');
      toast('🏮 Welcome to Rang Manch: The Virtual Theatre!');
    }, 300);
  } else if (params.get('tour') === '1') {
    setTimeout(() => {
      setView('play', sizeStage);
      startTour();
    }, 500);
  }

  console.log('✨ [Lantern Tales] All modules loaded and active.');
});
