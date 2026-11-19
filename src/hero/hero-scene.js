/* ================================================================
   LANTERN TALES — THREE.JS HERO SCENE (src/hero/hero-scene.ts)
   Real-time 3D shadow projection, volumetric lantern, dust motes
   Featuring the mythical Unicorn paper-cut shadow puppet
================================================================ */

export function initHeroScene(canvasEl, containerEl, toastFn = null) {
  if (!canvasEl || !containerEl || typeof THREE === 'undefined') return;

  try {
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, containerEl.clientWidth / containerEl.clientHeight, 0.1, 100);
    cam.position.set(0, 1.2, 3.6);
    cam.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Parchment back-wall
    const wallGeo = new THREE.PlaneGeometry(12, 7);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xF4E8D0, roughness: 0.92, metalness: 0.05 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 1, -1.2);
    wall.receiveShadow = true;
    scene.add(wall);

    // Overhead Brass Lantern Spotlight
    const spot = new THREE.SpotLight(0xFFB347, 2.4, 12, Math.PI / 4, 0.6, 1.2);
    spot.position.set(-1.4, 2.4, 1.4);
    spot.target = wall;
    spot.castShadow = true;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    spot.shadow.bias = -0.001;
    scene.add(spot);

    const ambient = new THREE.AmbientLight(0x1a1224, 0.85);
    scene.add(ambient);

    // ==========================================
    // UNICORN SHADOW PUPPET (Paper-cut Silhouette)
    // ==========================================
    const unicornGroup = new THREE.Group();
    const puppetMat = new THREE.MeshStandardMaterial({
      color: 0x0B0A10,
      roughness: 0.85,
      metalness: 0.1
    });

    // 1. Unicorn Bust Silhouette Shape
    const unicornShape = new THREE.Shape();
    // Neck base
    unicornShape.moveTo(-0.28, -0.45);
    // Crest of neck (arched gracefully)
    unicornShape.bezierCurveTo(-0.28, -0.15, -0.22, 0.12, -0.12, 0.35);
    // Base of Ear
    unicornShape.lineTo(-0.14, 0.58); // Ear tip
    unicornShape.lineTo(-0.05, 0.45); // Ear front base
    // Forehead
    unicornShape.lineTo(0.04, 0.44); // Horn root
    // Bridge of nose / muzzle
    unicornShape.bezierCurveTo(0.18, 0.36, 0.30, 0.28, 0.42, 0.18);
    // Muzzle tip & nostril
    unicornShape.bezierCurveTo(0.44, 0.14, 0.42, 0.08, 0.35, 0.07);
    // Lower lip & chin
    unicornShape.bezierCurveTo(0.26, 0.06, 0.18, 0.03, 0.08, 0.08); // Jaw curve
    // Throat curve
    unicornShape.bezierCurveTo(0.02, -0.04, 0.08, -0.22, 0.16, -0.45); // Front of chest
    unicornShape.closePath();

    // Traditional Wayang Kulit Cutouts (Holes for light to pass through)
    // Eye cutout hole
    const eyeHole = new THREE.Path();
    eyeHole.absellipse(0.12, 0.26, 0.032, 0.018, 0.25, 0, Math.PI * 2, true);
    unicornShape.holes.push(eyeHole);

    // Decorative Star Perforations on the neck
    const starHole1 = new THREE.Path();
    starHole1.absarc(-0.06, 0.12, 0.025, 0, Math.PI * 2, true);
    unicornShape.holes.push(starHole1);

    const starHole2 = new THREE.Path();
    starHole2.absarc(-0.12, -0.08, 0.022, 0, Math.PI * 2, true);
    unicornShape.holes.push(starHole2);

    const starHole3 = new THREE.Path();
    starHole3.absarc(-0.02, -0.25, 0.02, 0, Math.PI * 2, true);
    unicornShape.holes.push(starHole3);

    const extrudeSettings = {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012
    };
    const unicornGeo = new THREE.ExtrudeGeometry(unicornShape, extrudeSettings);
    const unicornMesh = new THREE.Mesh(unicornGeo, puppetMat);
    unicornMesh.castShadow = true;
    unicornMesh.receiveShadow = false;
    unicornGroup.add(unicornMesh);

    // 2. The Golden Spiral Horn (Alicorn)
    const hornGeo = new THREE.ConeGeometry(0.038, 0.58, 16);
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0xFFB347,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x4a2c06
    });
    const hornMesh = new THREE.Mesh(hornGeo, hornMat);
    hornMesh.position.set(0.16, 0.52, 0.02);
    hornMesh.rotation.z = -0.72; // Angled proudly forward
    hornMesh.castShadow = true;
    unicornGroup.add(hornMesh);

    // Horn spiral ridge rings
    for (let r = 1; r <= 3; r++) {
      const ringGeo = new THREE.TorusGeometry(0.032 - r * 0.007, 0.008, 6, 16);
      const ringMesh = new THREE.Mesh(ringGeo, hornMat);
      ringMesh.position.set(0.08 + r * 0.06, 0.44 + r * 0.06, 0.02);
      ringMesh.rotation.z = -0.72;
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.castShadow = true;
      unicornGroup.add(ringMesh);
    }

    // 3. Second Layered Ear for 3D depth
    const ear2Geo = new THREE.ConeGeometry(0.035, 0.2, 4);
    const ear2Mesh = new THREE.Mesh(ear2Geo, puppetMat);
    ear2Mesh.position.set(-0.06, 0.42, -0.04);
    ear2Mesh.rotation.z = 0.22;
    ear2Mesh.castShadow = true;
    unicornGroup.add(ear2Mesh);

    // 4. Flowing Layered Mane Locks
    for (let m = 0; m < 4; m++) {
      const maneShape = new THREE.Shape();
      maneShape.moveTo(0, 0);
      maneShape.quadraticCurveTo(-0.16, -0.04, -0.22, -0.16);
      maneShape.quadraticCurveTo(-0.10, -0.10, 0, -0.07);
      maneShape.closePath();
      const maneGeo = new THREE.ExtrudeGeometry(maneShape, { depth: 0.025, bevelEnabled: false });
      const maneMesh = new THREE.Mesh(maneGeo, puppetMat);
      maneMesh.position.set(-0.15 - m * 0.04, 0.28 - m * 0.14, 0.015 * (m % 2 ? 1 : -1));
      maneMesh.castShadow = true;
      unicornGroup.add(maneMesh);
    }

    // 5. Traditional Puppet Control Rod (brass & bamboo)
    const rodGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.75, 8);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x82541e, metalness: 0.5, roughness: 0.5 });
    const rodMesh = new THREE.Mesh(rodGeo, rodMat);
    rodMesh.position.set(-0.05, -0.65, 0.02);
    rodMesh.castShadow = true;
    unicornGroup.add(rodMesh);

    // 6. Magical Stardust Sparkles around Horn Tip
    const sparkleCount = 30;
    const sparkleGeo = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      sparklePos[i * 3] = 0.35 + (Math.random() - 0.5) * 0.22;
      sparklePos[i * 3 + 1] = 0.72 + (Math.random() - 0.5) * 0.22;
      sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 0.22;
    }
    sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xFFE082,
      size: 0.038,
      transparent: true,
      opacity: 0.85
    });
    const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
    unicornGroup.add(sparkles);

    unicornGroup.position.set(0.4, 0.95, 0.4);
    unicornGroup.scale.set(1.15, 1.15, 1.15);
    scene.add(unicornGroup);

    // Floating Dust Particles
    const dustCount = 140;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 8;
      dustPositions[i * 3 + 1] = Math.random() * 4;
      dustPositions[i * 3 + 2] = Math.random() * 3 - 1;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0xffc477, size: 0.03, transparent: true, opacity: 0.6 });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ==========================================
    // DYNAMIC 3D THEME LIGHTING & COLOR ADAPTATION
    // ==========================================
    const THEME_3D_PALETTES = {
      dark: { wall: 0xF4E8D0, spot: 0xFFB347, ambient: 0x14121f, puppet: 0x0B0A10, dust: 0xFFC477 },
      light: { wall: 0xFFFDF9, spot: 0xF6B26B, ambient: 0xF4ECE0, puppet: 0x2C1A0E, dust: 0xD4820A },
      vermilion: { wall: 0xFDF5E6, spot: 0xFF9F43, ambient: 0x3D1616, puppet: 0x1E0A0A, dust: 0xFF9F43 },
      jade: { wall: 0xE8F5E9, spot: 0x6EE7B7, ambient: 0x183D2B, puppet: 0x091811, dust: 0x6EE7B7 },
      moon: { wall: 0xF0F4F8, spot: 0x93C5FD, ambient: 0x1C1F4D, puppet: 0x0B0C1E, dust: 0x93C5FD }
    };

    function syncHeroTheme() {
      const mode = document.documentElement.getAttribute('data-theme') || 'dark';
      const pal = THEME_3D_PALETTES[mode] || THEME_3D_PALETTES.dark;
      if (wallMat) wallMat.color.setHex(pal.wall);
      if (spot) spot.color.setHex(pal.spot);
      if (ambient) ambient.color.setHex(pal.ambient);
      if (puppetMat) puppetMat.color.setHex(pal.puppet);
      if (dustMat) dustMat.color.setHex(pal.dust);
    }

    const themeObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          syncHeroTheme();
        }
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('themechange', syncHeroTheme);
    syncHeroTheme();

    let mouseX = 0, mouseY = 0;
    containerEl.addEventListener('pointermove', (e) => {
      const rect = containerEl.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    containerEl.addEventListener('pointerdown', () => {
      spot.intensity = 3.4;
      unicornGroup.position.y += 0.12;
      unicornGroup.rotation.z -= 0.1;
      setTimeout(() => { spot.intensity = 2.4; }, 400);
      if (typeof toastFn === 'function') {
        toastFn('🦄 The mythical Unicorn shadow awakens!');
      }
    });

    function onResize() {
      const w = containerEl.clientWidth || window.innerWidth;
      const h = containerEl.clientHeight || window.innerHeight;
      if (w <= 0 || h <= 0) return;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.render(scene, cam);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('heroresize', onResize);
    window.addEventListener('viewchange', (e) => {
      if (!e.detail || e.detail.view === 'home') {
        setTimeout(onResize, 50);
        setTimeout(onResize, 200);
      }
    });

    // Staggered initial layout stabilization
    onResize();
    requestAnimationFrame(onResize);
    setTimeout(onResize, 100);
    setTimeout(onResize, 300);

    const clock = new THREE.Clock();
    let isVisible = true;

    new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) {
        onResize();
      }
    }, { threshold: 0.05 }).observe(containerEl);

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      unicornGroup.position.x += (mouseX * 1.5 - unicornGroup.position.x) * 0.08;
      unicornGroup.position.y += (1 + mouseY * 0.9 - unicornGroup.position.y) * 0.08;
      unicornGroup.rotation.z = mouseX * 0.18 + Math.sin(elapsed * 2.2) * 0.03;
      unicornGroup.rotation.y = mouseX * 0.12;

      sparkles.rotation.y = elapsed * 1.5;

      spot.intensity = 2.2 + Math.sin(elapsed * 9) * 0.15;
      dust.rotation.y = elapsed * 0.02;

      renderer.render(scene, cam);
    }
    animate();
  } catch (err) {
    console.warn('[HeroScene] Fallback:', err);
  }
}
