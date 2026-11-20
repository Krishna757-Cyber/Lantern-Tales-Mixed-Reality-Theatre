/* ================================================================
   LANTERN TALES — RANG MANCH VIRTUAL THEATRE APP (src/theatre/theatre-app.js)
   Integrates 3D Haveli Hall, Tabletop MR, Kathputli rigs, voice & rhythm
   Supports Quest 3 hands-only, webcam and desktop mouse fallbacks
================================================================ */

import { KathputliRig } from '../kathputli/rig.js';
import { AnarkaliDancer } from '../kathputli/puppets/dancer.js';
import { GhodiHorse } from '../kathputli/puppets/horse.js';
import { SavarRider } from '../kathputli/puppets/rider.js';
import { SaperaSnake } from '../kathputli/puppets/snake.js';
import { AmarSinghHero } from '../kathputli/puppets/hero.js';
import { KathputliController } from '../kathputli/controls.js';
import { KathputliVoice } from '../kathputli/voice.js';
import { KathputliRhythm } from '../kathputli/rhythm.js';
import { RangManchHall } from './hall.js';
import { TableTheatre } from './tableTheatre.js';
import { TheatreTransition } from './transition.js';
import { BackstageWorkshop } from '../workshop/workshop.js';
import { FLAGS } from '../app/flags.js';
import { RamayanaKathaPlayer } from './ramayana-katha.js';

export let activeTheatre = null;

export function initTheatreView(toastFn = null) {
  const canvas = document.getElementById('theatre-stage-canvas');
  const container = document.getElementById('theatre-stage-wrap');
  if (!canvas || !container || typeof THREE === 'undefined') return;

  try {
    const initialW = container.clientWidth || 800;
    const initialH = container.clientHeight || Math.round(initialW * (9 / 16)) || 450;
    const initialAspect = (initialW > 0 && initialH > 0) ? (initialW / initialH) : (16 / 9);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, initialAspect, 0.1, 100);
    camera.position.set(0, 1.4, 3.8);
    camera.lookAt(0, 1.1, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(initialW, initialH);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Environments
    const hall = new RangManchHall(THREE, scene);
    let table = null;
    let isVRMode = true;
    let ramayanaPlayer = null;

    // Puppet
    let currentPuppet = new AnarkaliDancer({ scale: 1.0 });
    let puppetMesh = currentPuppet.buildThreeMesh(THREE);
    if (puppetMesh) scene.add(puppetMesh);

    const controller = new KathputliController(currentPuppet, { mode: 'mouse' });
    const voice = new KathputliVoice();
    const rhythm = new KathputliRhythm();
    const transition = new TheatreTransition();
    const workshop = new BackstageWorkshop();

    let isAudioPlaying = false;

    // Track mouse / cursor over stage
    container.addEventListener('pointermove', (e) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      controller.updateFromMouse(nx, ny, false);
      rhythm.setSpeedMultiplier(1.0 + Math.abs(nx) * 0.7);
    });

    container.addEventListener('pointerdown', () => {
      voice.playSqueak('nod', currentPuppet.headTilt);
      if (rhythm.checkBeatHit()) {
        voice.spawnIconBubble('✨');
        if (typeof toastFn === 'function') {
          toastFn('🌼 Auspicious Beat Hit! Taal meter advanced.');
        }
      }
    });

    // Performance action buttons
    document.getElementById('btn-stage-spin')?.addEventListener('click', () => {
      currentPuppet.skirtAngularVelocity += 7.5;
      voice.playSqueak('spin', 0.25);
      if (typeof toastFn === 'function') {
        toastFn('🌸 Anarkali performs a swift Kathak pirouette!');
      }
    });

    document.getElementById('btn-stage-curtain')?.addEventListener('click', () => {
      if (hall.curtain.isOpen) {
        hall.curtain.close();
        if (typeof toastFn === 'function') toastFn('🎪 Curtain drawn.');
      } else {
        hall.curtain.open();
        hall.triggerApplause();
        voice.playSqueak('bow', -0.3);
        if (typeof toastFn === 'function') toastFn('👏 Audience applauds the Kathputli troupe!');
      }
    });

    // Immersion toggle dropdown
    document.getElementById('select-theatre-immersion')?.addEventListener('change', (e) => {
      const mode = e.target.value;
      if (mode === 'ramayana') {
        const ramBtn = document.querySelector('.theatre-act-btn[data-act="ramayana"]');
        if (ramBtn) ramBtn.click();
        return;
      }
      transition.fadeDissolve(isVRMode ? 'VR' : 'MR', mode, 600, () => {
        if (mode === 'table') {
          isVRMode = false;
          hall.group.visible = false;
          if (!table) {
            table = new TableTheatre(THREE);
            scene.add(table.group);
          }
          table.group.visible = true;
        } else {
          isVRMode = true;
          if (table) table.group.visible = false;
          hall.group.visible = true;
        }
      });
    });

    // Audio toggle
    document.getElementById('btn-toggle-theatre-audio')?.addEventListener('click', () => {
      isAudioPlaying = !isAudioPlaying;
      const icon = document.getElementById('theatre-audio-icon');
      if (isAudioPlaying) {
        rhythm.start();
        ramayanaPlayer?.audioManager.setMuted(false);
        if (icon) icon.textContent = '🔊';
        if (typeof toastFn === 'function') toastFn('🥁 Dholak & Manjira rhythm started.');
      } else {
        rhythm.stop();
        ramayanaPlayer?.audioManager.setMuted(true);
        if (icon) icon.textContent = '🔇';
        if (typeof toastFn === 'function') toastFn('🔇 Rhythm paused.');
      }
    });

    // Act switcher
    const actMeta = {
      anarkali: {
        badge: 'Active Act • Anarkali Nritya',
        title: "The Court Dancer's Pirouette",
        desc: 'Curtain parts, Anarkali salutes the court, dances to the dholak beat with swirling rani-pink skirt and ghungroo bells.'
      },
      ghodi: {
        badge: 'Active Act • Ghodi aur Savar',
        title: 'The Prancing Mare of Marwar',
        desc: 'Two-puppet piece: the Marwari horse prances across the desert dunes while the rider bows and salutes.'
      },
      sapera: {
        badge: 'Active Act • Sapera',
        title: "The Melodic Serpent's Dance",
        desc: 'Gourd flute drone plays peacefully; emerald cloth serpent emerges from its basket and bows in gentle harmony.'
      },
      amarsingh: {
        badge: 'Active Act • Amar Singh Rathore',
        title: 'The Legend of Nagaur',
        desc: 'Heroic folk hero with saffron turban and wooden shield stands firm in loyalty, taking a bow of honour.'
      },
      mela: {
        badge: 'Active Act • Mela Night',
        title: 'The Desert Fair Finale',
        desc: 'Festive carnival lights kindle; three puppets perform a duet with guest or ghost partner amid a marigold shower.'
      },
      ramayana: {
        badge: 'Active Act • Ramayana Katha',
        title: 'Ramayana Katha — The Complete Folk Performance',
        desc: 'Auto-playing 7-chapter epic told in 38 scenes with Rajasthani wooden string puppets, procedural backdrops, bilingual narration, and classical taals.'
      }
    };

    document.querySelectorAll('.theatre-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const actId = btn.dataset.act;
        document.querySelectorAll('.theatre-act-btn').forEach(b => {
          b.className = 'theatre-act-btn px-3 py-1.5 rounded-xl text-xs font-medium text-parchment hover:bg-parchment/10 shrink-0';
        });
        btn.className = 'theatre-act-btn px-3 py-1.5 rounded-xl text-xs font-medium bg-amber text-ink font-bold shrink-0';

        const meta = actMeta[actId];
        if (meta) {
          const badgeEl = document.getElementById('act-badge');
          const titleEl = document.getElementById('act-title');
          const descEl = document.getElementById('act-desc');
          if (badgeEl) badgeEl.textContent = meta.badge;
          if (titleEl) titleEl.textContent = meta.title;
          if (descEl) descEl.textContent = meta.desc;
        }

        // Special handling for Ramayana Katha
        if (actId === 'ramayana') {
          if (puppetMesh) scene.remove(puppetMesh);
          if (!ramayanaPlayer) {
            ramayanaPlayer = new RamayanaKathaPlayer(THREE, scene, hall, toastFn);
            ramayanaPlayer.mountUI(container);
          }
          ramayanaPlayer.play();
          if (typeof toastFn === 'function') {
            toastFn('📜 Starting Ramayana Katha — The Living Folk Lore');
          }
          return;
        } else {
          // Teardown Ramayana player when switching back to individual acts
          if (ramayanaPlayer) {
            ramayanaPlayer.teardown();
            ramayanaPlayer = null;
          }
        }

        // Swap puppet model
        if (puppetMesh) scene.remove(puppetMesh);
        switch (actId) {
          case 'ghodi':
            currentPuppet = new GhodiHorse();
            break;
          case 'sapera':
            currentPuppet = new SaperaSnake();
            break;
          case 'amarsingh':
            currentPuppet = new AmarSinghHero();
            break;
          case 'mela':
          case 'anarkali':
          default:
            currentPuppet = new AnarkaliDancer();
        }
        puppetMesh = currentPuppet.buildThreeMesh(THREE);
        if (puppetMesh) scene.add(puppetMesh);
        controller.rig = currentPuppet;

        voice.playSqueak('greet', 0);
        if (typeof toastFn === 'function') {
          toastFn(`🎭 Show Act Loaded: ${meta?.title || actId}`);
        }
      });
    });

    // Workshop save button
    document.getElementById('btn-save-troupe')?.addEventListener('click', () => {
      const headVal = document.getElementById('workshop-head')?.value;
      const turbanVal = document.getElementById('workshop-turban')?.value;
      const skirtVal = document.getElementById('workshop-skirt')?.value;

      workshop.setPart('headId', headVal);
      workshop.setPart('turbanId', turbanVal);
      workshop.setPart('skirtId', skirtVal);

      const saved = workshop.saveCurrentToShelf('My Assembled Kathputli');
      if (typeof toastFn === 'function') {
        toastFn('🪵 Custom Kathputli saved to the Troupe Shelf!');
      }

      // Live update current puppet to assembled config
      if (puppetMesh) scene.remove(puppetMesh);
      currentPuppet = workshop.assemblePuppet();
      puppetMesh = currentPuppet.buildThreeMesh(THREE);
      if (puppetMesh) scene.add(puppetMesh);
      controller.rig = currentPuppet;
      voice.playSqueak('spin', 0.3);
    });

    // Resize handler with robust fallback for hidden containers
    function onResize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const w = Math.round(rect.width) || container.clientWidth || 800;
      const h = Math.round(rect.height) || container.clientHeight || Math.round(w * (9 / 16)) || 450;
      if (w > 50 && h > 50) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(w, h);
      }
    }
    window.addEventListener('resize', onResize);
    onResize();

    // Render loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const elapsed = clock.elapsedTime;

      if (isVRMode) {
        hall.update(dt, elapsed);
      } else if (table) {
        table.update(dt, elapsed);
      }

      if (ramayanaPlayer && !ramayanaPlayer.isDisposed) {
        ramayanaPlayer.update(dt, elapsed);
      } else {
        currentPuppet.update(dt);
      }
      renderer.render(scene, camera);
    }
    animate();
    hall.curtain.open();

    // Route change cleanup & resize activation
    window.addEventListener('viewchange', (e) => {
      if (e.detail?.view === 'theatre') {
        onResize();
        requestAnimationFrame(() => {
          onResize();
          renderer.render(scene, camera);
        });
        setTimeout(onResize, 50);
        setTimeout(onResize, 150);
        setTimeout(onResize, 350);
      } else {
        if (ramayanaPlayer && !ramayanaPlayer.isDisposed) {
          ramayanaPlayer.pause();
          ramayanaPlayer.audioManager.stopAll();
        }
      }
    });

    activeTheatre = {
      hall,
      table,
      puppet: currentPuppet,
      controller,
      voice,
      rhythm,
      resize: onResize
    };
  } catch (err) {
    console.warn('[RangManchApp] Fallback:', err);
  }
}
