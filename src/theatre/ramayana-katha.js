/* ================================================================
   LANTERN TALES — RAMAYANA KATHA PLAYER CONTROLLER
   (src/theatre/ramayana-katha.js)
   Orchestrates 38 auto-playing scenes, 7 Kands, 20 puppet actors,
   procedural backdrops, Web Speech narration, subtitles, and player UI.
================================================================ */

import { RAMAYANA_KANDS, RAMAYANA_SCENES } from '../story/ramayanaScript.js';
import { createRamayanaPuppet } from '../kathputli/puppets/ramayana-puppets.js';
import { RamayanaStageManager } from './ramayana-stage.js';
import { RamayanaAudioManager } from './ramayana-audio.js';

const STORAGE_KEY = 'lantern_tales_ramayana_last_scene';

export class RamayanaKathaPlayer {
  constructor(THREE, scene, hall, toastFn = null) {
    this.THREE = THREE;
    this.scene = scene;
    this.hall = hall;
    this.toast = toastFn || console.log;

    this.stageManager = new RamayanaStageManager(THREE, scene);
    this.audioManager = new RamayanaAudioManager();

    // Playback state
    this.currentIndex = 0;
    this.isPlaying = false;
    this.speed = 1.0;
    this.language = 'both'; // 'hi', 'en', 'both'
    this.showCaptions = true;
    this.sceneTimer = null;
    this.sceneStartTime = 0;
    this.currentPuppetActors = []; // { puppet, mesh, actorConfig }
    this.activePuppetMeshGroup = new THREE.Group();
    this.scene.add(this.activePuppetMeshGroup);

    // DOM Elements (Katha Player Bar & Subtitle Strip)
    this.playerContainer = null;
    this.subtitleElement = null;
    this.progressBar = null;
    this.chapterSelect = null;
    this.playBtn = null;

    this.keyboardHandler = null;
    this.isDisposed = false;

    this.initSavedState();
  }

  initSavedState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < RAMAYANA_SCENES.length) {
          this.savedIndex = idx;
        }
      }
    } catch (e) {}
  }

  saveProgress(idx) {
    try {
      localStorage.setItem(STORAGE_KEY, idx.toString());
    } catch (e) {}
  }

  // Setup DOM Player Controls Overlay
  mountUI(containerEl) {
    if (!containerEl) return;
    this.playerContainer = containerEl;

    // Check if player UI already injected
    if (document.getElementById('ramayana-katha-bar')) {
      document.getElementById('ramayana-katha-bar').classList.remove('hidden');
      return;
    }

    const bar = document.createElement('div');
    bar.id = 'ramayana-katha-bar';
    bar.className = 'w-full mt-3 p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-amber/30 text-parchment flex flex-col gap-2.5 transition-all shadow-xl';

    bar.innerHTML = `
      <!-- Top Row: Progress Bar & Chapter Select -->
      <div class="flex items-center gap-3">
        <!-- Chapter Select -->
        <select id="ramayana-chapter-select" class="bg-black/70 border border-amber/40 rounded-xl px-2.5 py-1 text-xs font-mono text-amber focus:outline-none cursor-pointer">
          ${RAMAYANA_KANDS.map(k => `<option value="${k.id}">${k.id}. ${k.nameHi} (${k.nameEn})</option>`).join('')}
        </select>

        <!-- Progress Track (Seekable) -->
        <div id="ramayana-progress-wrap" class="flex-1 h-3 rounded-full bg-parchment/15 cursor-pointer relative overflow-hidden group">
          <div id="ramayana-progress-fill" class="h-full bg-gradient-to-r from-amber to-vermilion rounded-full w-0 transition-[width] duration-300"></div>
        </div>

        <!-- Scene Index Badge -->
        <span id="ramayana-scene-counter" class="text-[11px] font-mono text-parchment/70 whitespace-nowrap">
          1 / ${RAMAYANA_SCENES.length}
        </span>
      </div>

      <!-- Bottom Row: Transport & Toggles -->
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
        <!-- Transport Buttons -->
        <div class="flex items-center gap-2">
          <button id="ramayana-btn-prev" class="btn-ghost px-2.5 py-1 rounded-lg border border-parchment/20 text-xs hover:border-amber" title="Previous Scene (←)">
            ⏮️ Prev
          </button>
          <button id="ramayana-btn-play" class="px-4 py-1.5 rounded-xl bg-amber text-ink font-bold hover:brightness-110 shadow-md flex items-center gap-1.5" title="Play / Pause (Space)">
            <span id="ramayana-play-icon">▶️</span>
            <span id="ramayana-play-text">Play Katha</span>
          </button>
          <button id="ramayana-btn-next" class="btn-ghost px-2.5 py-1 rounded-lg border border-parchment/20 text-xs hover:border-amber" title="Next Scene (→)">
            Next ⏭️
          </button>
          ${this.savedIndex > 0 ? `
            <button id="ramayana-btn-resume" class="px-2.5 py-1 rounded-lg bg-vermilion/20 text-vermilion border border-vermilion/40 text-[11px] font-mono hover:bg-vermilion/30">
              🔖 Resume (${this.savedIndex + 1})
            </button>
          ` : ''}
        </div>

        <!-- Settings: Speed, Language, Voice, Captions -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Speed -->
          <select id="ramayana-speed-select" class="bg-black/60 border border-parchment/20 rounded-lg px-2 py-1 text-[11px] font-mono text-parchment">
            <option value="0.75">0.75x</option>
            <option value="1.0" selected>1.0x</option>
            <option value="1.25">1.25x</option>
          </select>

          <!-- Language -->
          <button id="ramayana-btn-lang" class="btn-ghost px-2.5 py-1 rounded-lg border border-parchment/20 text-[11px] font-mono" title="Toggle Language">
            🌐 <span id="ramayana-lang-label">हिन्दी + Eng</span>
          </button>

          <!-- Voice Narration -->
          <button id="ramayana-btn-voice" class="btn-ghost px-2.5 py-1 rounded-lg border border-parchment/20 text-[11px] font-mono text-amber" title="Toggle Narrator Voice">
            🎙️ <span id="ramayana-voice-label">Voice ON</span>
          </button>

          <!-- Subtitles -->
          <button id="ramayana-btn-cc" class="btn-ghost px-2 py-1 rounded-lg border border-parchment/20 text-[11px] font-mono text-amber" title="Toggle Captions (C)">
            [CC]
          </button>
        </div>
      </div>
    `;

    // Subtitle Ribbon Overlay on 3D Stage Wrap
    const stageWrap = document.getElementById('theatre-stage-wrap');
    if (stageWrap && !document.getElementById('ramayana-subtitles-ribbon')) {
      const sub = document.createElement('div');
      sub.id = 'ramayana-subtitles-ribbon';
      sub.className = 'absolute bottom-16 left-6 right-6 z-20 pointer-events-none flex flex-col items-center justify-end text-center';
      sub.innerHTML = `
        <div id="ramayana-subtitle-box" class="bg-black/85 backdrop-blur-md px-6 py-3 rounded-2xl border border-amber/40 shadow-2xl max-w-3xl transition-opacity duration-300" aria-live="polite">
          <div id="ramayana-sub-hi" class="font-display text-base sm:text-lg text-amber font-semibold leading-snug tracking-wide"></div>
          <div id="ramayana-sub-en" class="font-sans text-xs sm:text-sm text-parchment/90 mt-1 leading-normal italic"></div>
        </div>
      `;
      stageWrap.appendChild(sub);
      this.subtitleElement = sub;
    }

    containerEl.parentNode.insertBefore(bar, containerEl.nextSibling);

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.playBtn = document.getElementById('ramayana-btn-play');
    this.chapterSelect = document.getElementById('ramayana-chapter-select');

    this.playBtn?.addEventListener('click', () => this.togglePlay());
    document.getElementById('ramayana-btn-prev')?.addEventListener('click', () => this.prevScene());
    document.getElementById('ramayana-btn-next')?.addEventListener('click', () => this.nextScene());

    document.getElementById('ramayana-btn-resume')?.addEventListener('click', () => {
      if (this.savedIndex >= 0) {
        this.goToScene(this.savedIndex);
        this.play();
        this.toast(`📜 Resumed Ramayana Katha at scene ${this.savedIndex + 1}`);
        document.getElementById('ramayana-btn-resume')?.remove();
      }
    });

    this.chapterSelect?.addEventListener('change', (e) => {
      const kandId = parseInt(e.target.value, 10);
      const targetSceneIdx = RAMAYANA_SCENES.findIndex(s => s.kandIndex === kandId);
      if (targetSceneIdx !== -1) {
        this.goToScene(targetSceneIdx);
      }
    });

    // Seek in progress bar
    document.getElementById('ramayana-progress-wrap')?.addEventListener('click', (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetIdx = Math.min(RAMAYANA_SCENES.length - 1, Math.floor(frac * RAMAYANA_SCENES.length));
      this.goToScene(targetIdx);
    });

    // Speed toggle
    document.getElementById('ramayana-speed-select')?.addEventListener('change', (e) => {
      this.speed = parseFloat(e.target.value) || 1.0;
      this.toast(`⚡ Katha speed: ${this.speed}x`);
      if (this.isPlaying) {
        this.resetSceneTimer();
      }
    });

    // Language toggle
    document.getElementById('ramayana-btn-lang')?.addEventListener('click', () => {
      const modes = ['both', 'hi', 'en'];
      const nextIdx = (modes.indexOf(this.language) + 1) % modes.length;
      this.language = modes[nextIdx];
      const labels = { both: 'हिन्दी + Eng', hi: 'केवल हिन्दी', en: 'English Only' };
      const lbl = document.getElementById('ramayana-lang-label');
      if (lbl) lbl.textContent = labels[this.language];
      this.toast(`🌐 Subtitles: ${labels[this.language]}`);
      this.updateSubtitles();
    });

    // Voice narration toggle
    document.getElementById('ramayana-btn-voice')?.addEventListener('click', () => {
      this.audioManager.isVoiceEnabled = !this.audioManager.isVoiceEnabled;
      const lbl = document.getElementById('ramayana-voice-label');
      const btn = document.getElementById('ramayana-btn-voice');
      if (lbl && btn) {
        if (this.audioManager.isVoiceEnabled) {
          lbl.textContent = 'Voice ON';
          btn.classList.add('text-amber');
          this.toast('🎙️ Narrator voice enabled.');
        } else {
          lbl.textContent = 'Voice OFF';
          btn.classList.remove('text-amber');
          this.audioManager.speechSynth?.cancel();
          this.toast('🔇 Subtitles only (Voice paused).');
        }
      }
    });

    // Captions toggle
    document.getElementById('ramayana-btn-cc')?.addEventListener('click', () => {
      this.toggleCaptions();
    });

    // Global Keyboard shortcuts
    this.keyboardHandler = (e) => {
      if (e.target.matches('input, select, textarea')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.prevScene();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.nextScene();
      } else if (e.key === 'c' || e.key === 'C') {
        this.toggleCaptions();
      }
    };
    document.addEventListener('keydown', this.keyboardHandler);
  }

  toggleCaptions() {
    this.showCaptions = !this.showCaptions;
    const box = document.getElementById('ramayana-subtitle-box');
    const btn = document.getElementById('ramayana-btn-cc');
    if (box) box.style.opacity = this.showCaptions ? '1' : '0';
    if (btn) btn.classList.toggle('text-amber', this.showCaptions);
    this.toast(this.showCaptions ? '💬 Captions ON' : '💬 Captions OFF');
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    const playIcon = document.getElementById('ramayana-play-icon');
    const playText = document.getElementById('ramayana-play-text');
    if (playIcon) playIcon.textContent = '⏸️';
    if (playText) playText.textContent = 'Pause';

    this.renderCurrentScene();
  }

  pause() {
    this.isPlaying = false;
    const playIcon = document.getElementById('ramayana-play-icon');
    const playText = document.getElementById('ramayana-play-text');
    if (playIcon) playIcon.textContent = '▶️';
    if (playText) playText.textContent = 'Play Katha';

    if (this.sceneTimer) {
      clearTimeout(this.sceneTimer);
      this.sceneTimer = null;
    }
    this.audioManager.speechSynth?.pause();
  }

  nextScene() {
    if (this.currentIndex < RAMAYANA_SCENES.length - 1) {
      this.goToScene(this.currentIndex + 1);
    } else {
      this.toast('🙏 Siyavar Ramchandra ki Jai! Katha Completed.');
      this.pause();
      this.hall.curtain?.close();
    }
  }

  prevScene() {
    if (this.currentIndex > 0) {
      this.goToScene(this.currentIndex - 1);
    }
  }

  goToScene(index) {
    if (index < 0 || index >= RAMAYANA_SCENES.length) return;
    const prevKand = RAMAYANA_SCENES[this.currentIndex]?.kandIndex;
    const nextKand = RAMAYANA_SCENES[index]?.kandIndex;

    this.currentIndex = index;
    this.saveProgress(index);

    // If crossing Kand chapter boundary, brief curtain gesture
    if (prevKand !== nextKand && this.hall?.curtain) {
      this.hall.curtain.close();
      setTimeout(() => {
        this.hall.curtain.open();
        this.hall.triggerApplause?.();
      }, 700);
    }

    if (this.isPlaying) {
      this.renderCurrentScene();
    } else {
      this.renderCurrentScene(false);
    }
  }

  renderCurrentScene(autoAdvance = true) {
    if (this.isDisposed) return;
    const sceneData = RAMAYANA_SCENES[this.currentIndex];
    if (!sceneData) return;

    // 1. Update Backdrop & Procedural 3D Environment
    this.stageManager.setBackdrop(sceneData.backdrop);

    // 2. Spawn and Position Puppets for this scene
    this.spawnScenePuppets(sceneData.actors);

    // 3. Update Audio Music Mood & Sound Effects
    this.audioManager.setMusicMood(sceneData.music);
    if (sceneData.sfx) {
      this.stageManager.triggerEffect(sceneData.sfx);
      if (sceneData.sfx.includes('shankh')) {
        this.audioManager.triggerShankh();
      }
    }

    // 4. Update Subtitles & Active Act Cards
    this.updateSubtitles();
    this.updateActiveActCard(sceneData);
    this.updateUIProgress();

    // 5. Speak Narration
    const speechText = this.language === 'en' ? sceneData.narrationEn : sceneData.narrationHi;
    const speechLang = this.language === 'en' ? 'en' : 'hi';

    this.audioManager.speak(speechText, speechLang, false, () => {
      // If puppet dialogue exists, speak with higher Kathputli Boli pitch
      if (sceneData.dialogue && sceneData.dialogue.length > 0) {
        const dlg = sceneData.dialogue[0];
        const dlgText = this.language === 'en' ? dlg.textEn : dlg.textHi;
        this.audioManager.speak(dlgText, speechLang, true);
      }
    });

    // 6. Schedule Auto-Advance
    if (this.sceneTimer) clearTimeout(this.sceneTimer);
    if (autoAdvance && this.isPlaying) {
      const duration = (sceneData.durationMs || 16000) / this.speed;
      this.sceneStartTime = performance.now();
      this.sceneTimer = setTimeout(() => {
        this.nextScene();
      }, duration);
    }
  }

  spawnScenePuppets(actors = []) {
    const THREE = this.THREE;
    // Clear existing puppet actors from active stage group
    while (this.activePuppetMeshGroup.children.length > 0) {
      const child = this.activePuppetMeshGroup.children[0];
      this.activePuppetMeshGroup.remove(child);
    }
    this.currentPuppetActors = [];

    actors.forEach((actorConfig, idx) => {
      const puppet = createRamayanaPuppet(actorConfig.puppet, { scale: 1.05 });
      const mesh = puppet.buildThreeMesh(THREE);
      if (mesh) {
        // Entrance coordinates from stage wings or ceiling strings
        let startX = actorConfig.x || 0;
        let startY = puppet.position.y;
        if (actorConfig.enterFrom === 'left') {
          startX = -2.8 - idx * 0.35;
        } else if (actorConfig.enterFrom === 'right') {
          startX = 2.8 + idx * 0.35;
        } else if (actorConfig.enterFrom === 'center') {
          startY = 2.4; // Descends on strings from above
        }

        mesh.position.set(startX, startY, 0);
        puppet.setPose(actorConfig.pose || 'idle');
        this.activePuppetMeshGroup.add(mesh);

        // Calculate natural stage facing angle (facing towards center / partner)
        let targetRotY = 0;
        if (actorConfig.x < -0.1) targetRotY = 0.28;
        else if (actorConfig.x > 0.1) targetRotY = -0.28;

        this.currentPuppetActors.push({
          puppet,
          mesh,
          config: actorConfig,
          startX,
          startY,
          targetX: actorConfig.x || 0,
          targetY: puppet.position.y,
          targetRotY,
          action: actorConfig.action || actorConfig.pose || 'idle'
        });
      }
    });
  }

  updateSubtitles() {
    const sceneData = RAMAYANA_SCENES[this.currentIndex];
    if (!sceneData) return;

    const hiEl = document.getElementById('ramayana-sub-hi');
    const enEl = document.getElementById('ramayana-sub-en');

    if (hiEl) {
      hiEl.style.display = (this.language === 'both' || this.language === 'hi') ? 'block' : 'none';
      hiEl.textContent = sceneData.narrationHi;
    }
    if (enEl) {
      enEl.style.display = (this.language === 'both' || this.language === 'en') ? 'block' : 'none';
      enEl.textContent = sceneData.narrationEn;
    }
  }

  updateActiveActCard(sceneData) {
    const badgeEl = document.getElementById('act-badge');
    const titleEl = document.getElementById('act-title');
    const descEl = document.getElementById('act-desc');

    if (badgeEl) badgeEl.textContent = `📜 Ramayana Katha • ${sceneData.kand} (${this.currentIndex + 1}/${RAMAYANA_SCENES.length})`;
    if (titleEl) titleEl.textContent = `${sceneData.titleHi} — ${sceneData.titleEn}`;
    if (descEl) descEl.textContent = sceneData.narrationEn;

    // Pulse Taal meter on beats
    const taalMeter = document.getElementById('theatre-taal-meter');
    if (taalMeter) {
      taalMeter.classList.add('scale-110');
      setTimeout(() => taalMeter.classList.remove('scale-110'), 250);
    }
  }

  updateUIProgress() {
    const progressFill = document.getElementById('ramayana-progress-fill');
    const counter = document.getElementById('ramayana-scene-counter');
    const chapterSel = document.getElementById('ramayana-chapter-select');

    const pct = ((this.currentIndex + 1) / RAMAYANA_SCENES.length) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (counter) counter.textContent = `${this.currentIndex + 1} / ${RAMAYANA_SCENES.length}`;

    const currentKand = RAMAYANA_SCENES[this.currentIndex]?.kandIndex;
    if (chapterSel && currentKand && chapterSel.value != currentKand) {
      chapterSel.value = currentKand.toString();
    }
  }

  resetSceneTimer() {
    if (!this.isPlaying) return;
    if (this.sceneTimer) clearTimeout(this.sceneTimer);
    const sceneData = RAMAYANA_SCENES[this.currentIndex];
    const duration = (sceneData?.durationMs || 16000) / this.speed;
    this.sceneTimer = setTimeout(() => {
      this.nextScene();
    }, duration);
  }

  // Called inside main RAF animation loop
  update(dt, elapsed) {
    this.stageManager.update(dt, elapsed);

    const now = performance.now();
    const sceneElapsed = this.sceneStartTime > 0 ? (now - this.sceneStartTime) / 1000 : 0;
    const sceneData = RAMAYANA_SCENES[this.currentIndex];
    const durationSec = (sceneData?.durationMs || 16000) / (1000 * this.speed);
    const sceneProgress = Math.min(1.0, sceneElapsed / durationSec);

    // Entrance duration: 1.8 seconds with ease-out quad interpolation
    const entranceDuration = 1.8;
    const isEntering = sceneElapsed < entranceDuration;
    const enterT = isEntering ? Math.min(1.0, sceneElapsed / entranceDuration) : 1.0;
    const easeT = 1.0 - (1.0 - enterT) * (1.0 - enterT);

    this.currentPuppetActors.forEach((actor, idx) => {
      const { puppet, mesh, startX, startY, targetX, targetY, targetRotY, action } = actor;

      puppet.update(dt);

      if (isEntering) {
        // Smoothly walk in from wings with rhythmic string step bounce
        mesh.position.x = startX + (targetX - startX) * easeT;
        const stepBounce = Math.abs(Math.sin(sceneElapsed * 10.0 + idx)) * 0.06;
        mesh.position.y = (startY + (targetY - startY) * easeT) + stepBounce;
        mesh.rotation.z = Math.sin(sceneElapsed * 10.0 + idx) * 0.08;
        mesh.rotation.y = (targetX > startX ? 0.35 : -0.35) * (1.0 - easeT) + targetRotY * easeT;
      } else {
        // Arrived at mark: execute full choreographed performance
        mesh.position.x = targetX;
        mesh.rotation.y = targetRotY;

        // Specialized character action & gestures
        if (typeof puppet.animateChoreography === 'function') {
          puppet.animateChoreography(action, sceneProgress, elapsed);
        }

        mesh.position.y = puppet.position.y;
        mesh.rotation.z = puppet.rotation.z;
        mesh.rotation.x = puppet.rotation.x;
      }
    });
  }

  teardown() {
    this.isDisposed = true;
    this.pause();
    this.audioManager.stopAll();

    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
    }

    // Hide UI
    const bar = document.getElementById('ramayana-katha-bar');
    if (bar) bar.classList.add('hidden');
    const sub = document.getElementById('ramayana-subtitles-ribbon');
    if (sub) sub.remove();

    // Clear 3D objects
    this.stageManager.clearEffects();
    while (this.activePuppetMeshGroup.children.length > 0) {
      const child = this.activePuppetMeshGroup.children[0];
      this.activePuppetMeshGroup.remove(child);
    }
    this.scene.remove(this.activePuppetMeshGroup);
  }
}
