/* ================================================================
   LANTERN TALES — PROCEDURAL RAMAYANA 3D STAGE & VISUAL EFFECTS
   (src/theatre/ramayana-stage.js)
   Renders 9 authentic cultural backdrops and cinematic stage effects
   Zero external texture downloads — 100% procedural Three.js geometry
   Maintains steady 60 FPS budget on Meta Quest standalone
================================================================ */

export class RamayanaStageManager {
  constructor(THREE, scene) {
    this.THREE = THREE;
    this.scene = scene;
    this.currentBackdropName = null;
    this.backdropGroup = new THREE.Group();
    this.scene.add(this.backdropGroup);

    this.effectsGroup = new THREE.Group();
    this.scene.add(this.effectsGroup);

    // Active particle systems & animations
    this.activeEffects = [];
    this.diyaMeshes = [];
    this.floatingStones = [];
    this.fireParticles = null;
    this.arrowTrails = [];

    // Performance budget
    this.maxParticles = 60;
    this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Set backdrop procedurally
  setBackdrop(name) {
    if (this.currentBackdropName === name) return;
    this.currentBackdropName = name;

    const THREE = this.THREE;
    // Clear previous backdrop geometry
    while (this.backdropGroup.children.length > 0) {
      const obj = this.backdropGroup.children[0];
      this.backdropGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }

    // Clear active temporary scene effects
    this.clearEffects();

    switch (name) {
      case 'ayodhya-palace':
        this.buildAyodhyaPalace();
        break;
      case 'swayamvar-hall':
        this.buildSwayamvarHall();
        break;
      case 'panchavati':
        this.buildPanchavati();
        break;
      case 'kishkindha':
        this.buildKishkindha();
        break;
      case 'ocean-setu':
        this.buildOceanSetu();
        break;
      case 'golden-lanka':
        this.buildGoldenLanka();
        break;
      case 'ashok-vatika':
        this.buildAshokVatika();
        break;
      case 'battlefield':
        this.buildBattlefield();
        break;
      case 'diya-ayodhya':
        this.buildDiyaAyodhya();
        break;
      default:
        this.buildAyodhyaPalace();
    }
  }

  // 1. Ayodhya Palace: Golden sandstone carved arches and royal chandeliers
  buildAyodhyaPalace() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    // Atmospheric warm Rajasthani Haveli evening palette (rich & non-overexposed)
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x482E22, roughness: 0.92 });
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x6E442D, roughness: 0.86 });
    const jaliMat = new THREE.MeshStandardMaterial({ color: 0x18121C, roughness: 0.95 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xC69224, metalness: 0.72, roughness: 0.35 });
    const redSilkMat = new THREE.MeshStandardMaterial({ color: 0x6E121E, roughness: 0.78 });

    // Background wall with rich dark sandstone
    const wallGeo = new THREE.BoxGeometry(7.0, 3.8, 0.1);
    const wall = new THREE.Mesh(wallGeo, stoneMat);
    wall.position.set(0, 1.8, -1.9);
    g.add(wall);

    // Deep atmospheric jali window in the center behind the puppets for high-contrast puppet silhouette
    const centerJaliGeo = new THREE.BoxGeometry(3.6, 2.6, 0.02);
    const centerJali = new THREE.Mesh(centerJaliGeo, jaliMat);
    centerJali.position.set(0, 1.6, -1.84);
    g.add(centerJali);

    // Flanking Royal Sandstone Pillars
    for (let x of [-2.4, 2.4]) {
      const pillarGeo = new THREE.CylinderGeometry(0.14, 0.16, 3.6, 12);
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 1.8, -1.8);
      g.add(pillar);

      // Golden capital base and top
      const capGeo = new THREE.BoxGeometry(0.38, 0.12, 0.38);
      const capTop = new THREE.Mesh(capGeo, goldMat);
      capTop.position.set(x, 3.5, -1.8);
      const capBottom = new THREE.Mesh(capGeo, goldMat);
      capBottom.position.set(x, 0.1, -1.8);
      g.add(capTop);
      g.add(capBottom);
    }

    // Scalloped Multi-foil Arch
    const archCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-2.4, 3.0, -1.85),
      new THREE.Vector3(-1.0, 3.7, -1.85),
      new THREE.Vector3(1.0, 3.7, -1.85),
      new THREE.Vector3(2.4, 3.0, -1.85)
    );
    const archGeo = new THREE.TubeGeometry(archCurve, 20, 0.08, 8, false);
    const arch = new THREE.Mesh(archGeo, goldMat);
    g.add(arch);

    // Royal Red Silk Toran Valance
    const toranGeo = new THREE.BoxGeometry(4.8, 0.18, 0.04);
    const toran = new THREE.Mesh(toranGeo, redSilkMat);
    toran.position.set(0, 3.4, -1.82);
    g.add(toran);
  }

  // 2. Swayamvar Hall: Raised Altar with Lord Shiva's Sacred Pinaka Bow
  buildSwayamvarHall() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    this.buildAyodhyaPalace();

    // Central Altar Pedestal for Pinaka
    const altarMat = new THREE.MeshStandardMaterial({ color: 0xFFF8E7, roughness: 0.5 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.9, roughness: 0.2 });
    const altar = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.35, 16), altarMat);
    altar.position.set(0, 0.18, -1.2);
    g.add(altar);

    // Massive Celestial Shiva Bow (Pinaka) resting on altar
    const pinakaCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.75, 0.45, -1.2),
      new THREE.Vector3(-0.25, 0.85, -1.2),
      new THREE.Vector3(0.25, 0.85, -1.2),
      new THREE.Vector3(0.75, 0.45, -1.2)
    );
    const pinakaGeo = new THREE.TubeGeometry(pinakaCurve, 24, 0.024, 8, false);
    const pinaka = new THREE.Mesh(pinakaGeo, goldMat);
    g.add(pinaka);

    // Marigold Garland draping altar
    const garlandGeo = new THREE.TorusGeometry(0.48, 0.025, 6, 20);
    const garlandMat = new THREE.MeshStandardMaterial({ color: 0xFF9800, roughness: 0.9 });
    const garland = new THREE.Mesh(garlandGeo, garlandMat);
    garland.rotation.x = Math.PI / 2;
    garland.position.set(0, 0.35, -1.2);
    g.add(garland);
  }

  // 3. Panchavati: Thatch Hermitage (Parnkuti) & Sacred Forest
  buildPanchavati() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    const barkMat = new THREE.MeshStandardMaterial({ color: 0x4E3629, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.8 });
    const thatchMat = new THREE.MeshStandardMaterial({ color: 0xC49A45, roughness: 0.95 });
    const riverMat = new THREE.MeshStandardMaterial({ color: 0x1565C0, roughness: 0.3, metalness: 0.4 });

    // Distant Godavari River Horizon
    const river = new THREE.Mesh(new THREE.PlaneGeometry(8, 1.2), riverMat);
    river.position.set(0, 0.6, -2.4);
    g.add(river);

    // Hermitage Hut (Parnkuti) on left
    const hutWall = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.0), barkMat);
    hutWall.position.set(-1.8, 0.6, -1.6);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 0.7, 4), thatchMat);
    roof.position.set(-1.8, 1.55, -1.6);
    roof.rotation.y = Math.PI / 4;
    g.add(hutWall);
    g.add(roof);

    // Flanking Banyan Trees
    for (let x of [-2.8, 2.3]) {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 2.8, 8), barkMat);
      trunk.position.set(x, 1.4, -1.7);
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 8), leafMat);
      foliage.position.set(x, 2.8, -1.7);
      foliage.scale.set(1.4, 0.7, 1.1);
      g.add(trunk);
      g.add(foliage);
    }
  }

  // 4. Kishkindha: Rugged Sandstone Hills & Jungle Boulders
  buildKishkindha() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    const rockMat = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.95 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x33691E, roughness: 0.9 });

    // Tiered rocky mountain peaks behind stage
    for (let i = 0; i < 5; i++) {
      const height = 2.2 + (i % 3) * 0.5;
      const rock = new THREE.Mesh(new THREE.ConeGeometry(0.8 + (i % 2) * 0.4, height, 5), rockMat);
      rock.position.set(-2.5 + i * 1.25, height / 2, -2.0 - (i % 2) * 0.3);
      rock.rotation.y = i * 0.7;
      g.add(rock);
    }

    // Lush creepers and stone ledge
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.3, 0.8), rockMat);
    ledge.position.set(0, 0.15, -1.6);
    g.add(ledge);
  }

  // 5. Ocean Setu: Roaring Sea & Inscribed Floating Stones
  buildOceanSetu() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0D47A1,
      roughness: 0.25,
      metalness: 0.5,
      transparent: true,
      opacity: 0.92
    });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78909C, roughness: 0.9 });
    const goldGlowMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });

    // Ocean Surface Plane
    const ocean = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 3.5), oceanMat);
    ocean.rotation.x = -Math.PI / 2.3;
    ocean.position.set(0, 0.4, -1.8);
    g.add(ocean);

    // Floating Ram Setu Stones array
    this.floatingStones = [];
    for (let i = 0; i < 7; i++) {
      const stoneGroup = new THREE.Group();
      const stoneMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.38), stoneMat);
      stoneGroup.add(stoneMesh);

      // Inscribed 'RAM' golden glyph representation (small glowing marker)
      const glyph = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8), goldGlowMat);
      glyph.position.set(0, 0.10, 0);
      stoneGroup.add(glyph);

      stoneGroup.position.set(-2.1 + i * 0.7, 0.28, -1.3 + (i % 2) * 0.1);
      stoneGroup.userData = { baseY: 0.28, phase: i * 0.8 };
      g.add(stoneGroup);
      this.floatingStones.push(stoneGroup);
    }
  }

  // 6. Golden Lanka: Towering Golden Citadels & Battlements
  buildGoldenLanka() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xDAA520,
      metalness: 0.85,
      roughness: 0.2
    });
    const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.9 });

    // Fortress walls of Lanka
    const wall = new THREE.Mesh(new THREE.BoxGeometry(7.0, 2.0, 0.3), darkStoneMat);
    wall.position.set(0, 1.0, -1.9);
    g.add(wall);

    // Golden towers and ornate minarets
    for (let x of [-2.4, -1.2, 0, 1.2, 2.4]) {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 2.8, 8), goldMat);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.8, 8), goldMat);
      tower.position.set(x, 1.7, -1.8);
      spire.position.set(x, 3.5, -1.8);
      g.add(tower);
      g.add(spire);
    }
  }

  // 7. Ashok Vatika: Sacred Ashoka Tree with Crimson Blossoms
  buildAshokVatika() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    const barkMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.95 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.8 });
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xD81B60, roughness: 0.6 });

    // Central ancient Ashoka Tree
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 3.2, 10), barkMat);
    trunk.position.set(0.2, 1.6, -1.7);
    g.add(trunk);

    // Canopy layers
    const canopy1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), leafMat);
    canopy1.position.set(0.2, 3.0, -1.7);
    canopy1.scale.set(1.4, 0.8, 1.2);
    g.add(canopy1);

    // Scattered crimson flowers on branches
    for (let i = 0; i < 12; i++) {
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), flowerMat);
      const angle = (i / 12) * Math.PI * 2;
      flower.position.set(
        0.2 + Math.cos(angle) * (0.6 + (i % 3) * 0.2),
        2.7 + (i % 4) * 0.15,
        -1.7 + Math.sin(angle) * 0.4
      );
      g.add(flower);
    }
  }

  // 8. Battlefield at Dusk: Fiery Sky & Chariot Silhouette
  buildBattlefield() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    const duskSkyMat = new THREE.MeshBasicMaterial({ color: 0x5D101D });
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.95 });

    // Dusk Crimson Sky Horizon
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), duskSkyMat);
    sky.position.set(0, 2.0, -2.1);
    g.add(sky);

    // Dusty ground
    const ground = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.5, 1.2), groundMat);
    ground.position.set(0, 0.25, -1.7);
    g.add(ground);
  }

  // 9. Diya Ayodhya: Grand Deepotsav with Glowing Earthen Lamps
  buildDiyaAyodhya() {
    const THREE = this.THREE;
    const g = this.backdropGroup;

    this.buildAyodhyaPalace();

    // Multitude of glowing clay diyas across stage floor and balconies
    this.diyaMeshes = [];
    const clayMat = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.9 });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xFFD54F });

    const diyaPositions = [
      [-2.2, 0.05, -0.8], [-1.5, 0.05, -0.9], [-0.8, 0.05, -1.0], [0.0, 0.05, -1.05],
      [0.8, 0.05, -1.0], [1.5, 0.05, -0.9], [2.2, 0.05, -0.8],
      [-2.4, 3.4, -1.7], [-1.2, 3.4, -1.7], [1.2, 3.4, -1.7], [2.4, 3.4, -1.7],
      [-1.8, 0.05, -0.4], [1.8, 0.05, -0.4], [-0.5, 0.05, -0.4], [0.5, 0.05, -0.4]
    ];

    diyaPositions.forEach(([x, y, z]) => {
      const diyaGroup = new THREE.Group();
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.03, 8), clayMat);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.06, 6), flameMat);
      flame.position.y = 0.04;
      diyaGroup.add(bowl);
      diyaGroup.add(flame);
      diyaGroup.position.set(x, y, z);
      g.add(diyaGroup);
      this.diyaMeshes.push(flame);
    });
  }

  // Trigger special visual effect
  triggerEffect(effectName) {
    if (this.reducedMotion) return;
    const THREE = this.THREE;

    switch (effectName) {
      case 'arrow_trail':
      case 'arrow_whoosh':
      case 'arrow_divine':
      case 'brahmastra_burst':
        this.spawnArrowTrail();
        break;

      case 'ocean_wind_leap':
      case 'mountain_soar':
        this.spawnHanumanLeapArc();
        break;

      case 'fire_roaring':
      case 'lanka_fire':
        this.spawnLankaFireParticles();
        break;

      case 'defeat-light':
        this.spawnRavanDefeatBurst();
        break;

      case 'diya-light':
      case 'festive_cheers':
        this.flickerAllDiyas();
        break;
    }
  }

  spawnArrowTrail() {
    const THREE = this.THREE;
    const curve = new THREE.LineCurve3(
      new THREE.Vector3(-0.8, 1.25, 0.1),
      new THREE.Vector3(0.8, 1.25, 0.1)
    );
    const trailGeo = new THREE.TubeGeometry(curve, 10, 0.015, 6, false);
    const trailMat = new THREE.MeshBasicMaterial({ color: 0xFFEB3B, transparent: true, opacity: 1.0 });
    const mesh = new THREE.Mesh(trailGeo, trailMat);
    this.effectsGroup.add(mesh);

    const startTime = performance.now();
    this.activeEffects.push({
      mesh,
      update: (now) => {
        const elapsed = (now - startTime) / 1000;
        mesh.material.opacity = Math.max(0, 1.0 - elapsed * 2.5);
        mesh.scale.x = 1.0 + elapsed * 1.5;
        return elapsed < 0.45;
      }
    });
  }

  spawnHanumanLeapArc() {
    const THREE = this.THREE;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.8, 0.5, -0.5),
      new THREE.Vector3(0.0, 2.2, -0.8),
      new THREE.Vector3(1.8, 0.5, -0.5)
    );
    const geo = new THREE.TubeGeometry(curve, 20, 0.02, 6, false);
    const mat = new THREE.MeshBasicMaterial({ color: 0xFF9800, transparent: true, opacity: 0.85 });
    const arc = new THREE.Mesh(geo, mat);
    this.effectsGroup.add(arc);

    const startTime = performance.now();
    this.activeEffects.push({
      mesh: arc,
      update: (now) => {
        const elapsed = (now - startTime) / 1000;
        arc.material.opacity = Math.max(0, 0.85 - elapsed * 0.7);
        return elapsed < 1.2;
      }
    });
  }

  spawnLankaFireParticles() {
    const THREE = this.THREE;
    const count = Math.min(30, this.maxParticles);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4.0;
      pos[i * 3 + 1] = Math.random() * 2.5;
      pos[i * 3 + 2] = -1.2 + (Math.random() - 0.5) * 0.8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xFF5722, size: 0.08, transparent: true, opacity: 0.8 });
    const points = new THREE.Points(pGeo, pMat);
    this.effectsGroup.add(points);

    const startTime = performance.now();
    this.activeEffects.push({
      mesh: points,
      update: (now) => {
        const elapsed = (now - startTime) / 1000;
        const positions = points.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
          positions[i * 3 + 1] += 0.015; // Float upwards
        }
        points.geometry.attributes.position.needsUpdate = true;
        points.material.opacity = Math.max(0, 0.8 - elapsed * 0.35);
        return elapsed < 2.2;
      }
    });
  }

  spawnRavanDefeatBurst() {
    const THREE = this.THREE;
    const ringGeo = new THREE.TorusGeometry(0.2, 0.03, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 1.0 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0.25, 1.2, 0);
    this.effectsGroup.add(ring);

    const startTime = performance.now();
    this.activeEffects.push({
      mesh: ring,
      update: (now) => {
        const elapsed = (now - startTime) / 1000;
        ring.scale.setScalar(1.0 + elapsed * 6.0);
        ring.material.opacity = Math.max(0, 1.0 - elapsed * 2.0);
        return elapsed < 0.55;
      }
    });
  }

  flickerAllDiyas() {
    this.diyaMeshes.forEach(mesh => {
      mesh.scale.setScalar(1.2 + Math.random() * 0.5);
    });
  }

  clearEffects() {
    while (this.effectsGroup.children.length > 0) {
      const child = this.effectsGroup.children[0];
      this.effectsGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    }
    this.activeEffects = [];
  }

  update(dt, elapsed) {
    // 1. Bob floating Ram Setu stones
    if (this.floatingStones.length > 0) {
      this.floatingStones.forEach(stone => {
        stone.position.y = stone.userData.baseY + Math.sin(elapsed * 2.0 + stone.userData.phase) * 0.03;
      });
    }

    // 2. Flicker Diyas
    if (this.diyaMeshes.length > 0) {
      this.diyaMeshes.forEach(mesh => {
        mesh.scale.y = 1.0 + Math.sin(elapsed * 12.0 + mesh.id) * 0.25;
      });
    }

    // 3. Update active temporary effects
    const now = performance.now();
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      const eff = this.activeEffects[i];
      const alive = eff.update(now);
      if (!alive) {
        this.effectsGroup.remove(eff.mesh);
        if (eff.mesh.geometry) eff.mesh.geometry.dispose();
        if (eff.mesh.material) eff.mesh.material.dispose();
        this.activeEffects.splice(i, 1);
      }
    }
  }
}
