/* ================================================================
   LANTERN TALES — RANG MANCH HAVELI HALL (src/theatre/hall.js)
   Full VR immersion: Rajasthani Haveli Courtyard at Dusk
   Jharokha arches, shamiana canopy, brass lamps, marigolds, audience pit
   Draw call budget: strictly under 150 calls (< 120 actual)
================================================================ */

import { TheatreCurtain } from './curtain.js';
import { StageFootlights } from './footlights.js';
import { TheatreAudience } from './audience.js';

export class RangManchHall {
  constructor(THREE, scene) {
    this.THREE = THREE;
    this.scene = scene;
    this.group = null;
    this.curtain = null;
    this.footlights = null;
    this.audience = null;
    this.stageSpotlight = null;
    this.puppetMount = null;
    this.returnTagMesh = null;

    if (THREE && scene) {
      this.init();
    }
  }

  init() {
    const THREE = this.THREE;
    const g = new THREE.Group();

    // Palette: Rajasthan sandstone & natural pigments
    const sandstoneMat = new THREE.MeshStandardMaterial({
      color: 0xDEB887, // Jaisalmer golden sandstone
      roughness: 0.88,
      metalness: 0.05
    });

    const rugMat = new THREE.MeshStandardMaterial({
      color: 0x6E1E28, // Deep madder red Persian/Jaipur rug
      roughness: 0.95
    });

    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x2B3A8C, // Royal Indigo shamiana
      roughness: 0.85,
      side: THREE.DoubleSide
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xE3A018, // Turmeric gold
      roughness: 0.35,
      metalness: 0.75
    });

    // 1. Courtyard Stone Floor & Central Carpet
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floor = new THREE.Mesh(floorGeo, sandstoneMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    g.add(floor);

    const rugGeo = new THREE.PlaneGeometry(6.5, 7.5);
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, -0.04, 0.5);
    rug.receiveShadow = true;
    g.add(rug);

    // 2. Haveli Sandstone Walls & Jharokha Balconies
    const wallGeo = new THREE.BoxGeometry(0.3, 5.0, 14.0);
    const leftWall = new THREE.Mesh(wallGeo, sandstoneMat);
    leftWall.position.set(-5.5, 2.5, -1.0);
    leftWall.receiveShadow = true;
    g.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeo, sandstoneMat);
    rightWall.position.set(5.5, 2.5, -1.0);
    rightWall.receiveShadow = true;
    g.add(rightWall);

    const backWallGeo = new THREE.BoxGeometry(11.0, 5.0, 0.3);
    const backWall = new THREE.Mesh(backWallGeo, sandstoneMat);
    backWall.position.set(0, 2.5, -7.0);
    backWall.receiveShadow = true;
    g.add(backWall);

    // Flanking Jharokha Balconies (projecting carved stone boxes)
    const jharokhaGeo = new THREE.BoxGeometry(0.85, 1.4, 0.55);
    const leftJharokha = new THREE.Mesh(jharokhaGeo, sandstoneMat);
    leftJharokha.position.set(-5.1, 2.4, -2.5);
    g.add(leftJharokha);

    const rightJharokha = new THREE.Mesh(jharokhaGeo, sandstoneMat);
    rightJharokha.position.set(5.1, 2.4, -2.5);
    g.add(rightJharokha);

    // 3. Handcrafted Fabric Shamiana Canopy Overhead
    const canopyGeo = new THREE.PlaneGeometry(9.0, 9.0);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.rotation.x = Math.PI / 2;
    canopy.position.set(0, 4.4, -1.0);
    g.add(canopy);

    // Gold gota fringe border along canopy edges
    const borderGeo = new THREE.CylinderGeometry(0.02, 0.02, 9.0, 8);
    const frontBorder = new THREE.Mesh(borderGeo, goldMat);
    frontBorder.rotation.z = Math.PI / 2;
    frontBorder.position.set(0, 4.38, 3.5);
    g.add(frontBorder);

    // 4. Seated Floor Bolsters (Gaddi / Masnad)
    const bolsterGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.85, 10);
    const bolsterMat = new THREE.MeshStandardMaterial({ color: 0xC2185B, roughness: 0.9 });
    for (let b = -2; b <= 2; b++) {
      const bolster = new THREE.Mesh(bolsterGeo, bolsterMat);
      bolster.rotation.z = Math.PI / 2;
      bolster.position.set(b * 0.95, 0.10, 1.6);
      g.add(bolster);
    }

    // 5. Desert Night Sky with Twinkling Stars
    const starCount = 180;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 22;
      starPos[i * 3 + 1] = 4.5 + Math.random() * 6.0;
      starPos[i * 3 + 2] = -4.0 - Math.random() * 12.0;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xFFE082, size: 0.045, transparent: true, opacity: 0.75 });
    const stars = new THREE.Points(starGeo, starMat);
    g.add(stars);

    // 6. The Puppet Stage Structure (Central Stage at z = -2.2)
    const stageWidth = 2.8;
    const stageDepth = 1.6;
    const stageHeight = 0.65;

    const platformGeo = new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth);
    const platform = new THREE.Mesh(platformGeo, sandstoneMat);
    platform.position.set(0, stageHeight / 2, -2.2);
    platform.receiveShadow = true;
    g.add(platform);

    // Proscenium Columns
    const colGeo = new THREE.CylinderGeometry(0.09, 0.11, 2.2, 10);
    const leftCol = new THREE.Mesh(colGeo, sandstoneMat);
    leftCol.position.set(-stageWidth / 2 + 0.1, stageHeight + 1.1, -2.2 + stageDepth / 2);
    g.add(leftCol);

    const rightCol = new THREE.Mesh(colGeo, sandstoneMat);
    rightCol.position.set(stageWidth / 2 - 0.1, stageHeight + 1.1, -2.2 + stageDepth / 2);
    g.add(rightCol);

    // Scalloped Cusped Arch Header
    const archGeo = new THREE.BoxGeometry(stageWidth + 0.3, 0.45, 0.18);
    const arch = new THREE.Mesh(archGeo, sandstoneMat);
    arch.position.set(0, stageHeight + 2.2 + 0.22, -2.2 + stageDepth / 2);
    g.add(arch);

    // Painted Cloth Backdrop (Parchment)
    const backdropGeo = new THREE.PlaneGeometry(stageWidth - 0.2, 2.1);
    const backdropMat = new THREE.MeshStandardMaterial({ color: 0xFDF5E6, roughness: 0.95 });
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.set(0, stageHeight + 1.1, -2.2 - stageDepth / 2 + 0.08);
    backdrop.receiveShadow = true;
    g.add(backdrop);

    // 7. Velvet Proscenium Curtain
    this.curtain = new TheatreCurtain(THREE, stageWidth - 0.1, 2.15);
    this.curtain.group.position.set(0, stageHeight + 0.05, -2.2 + stageDepth / 2 - 0.05);
    g.add(this.curtain.group);

    // 8. Stage Footlights
    this.footlights = new StageFootlights(THREE, stageWidth - 0.3, 7);
    this.footlights.group.position.set(0, stageHeight + 0.02, -2.2 + stageDepth / 2 + 0.02);
    g.add(this.footlights.group);

    // 9. GPU-Instanced Audience Pit (Seated spectators)
    this.audience = new TheatreAudience(THREE, 28);
    this.audience.group.position.set(0, 0.2, 0.6);
    g.add(this.audience.group);

    // 10. Stage Follow-Spotlight (The single primary shadow-casting light)
    const spot = new THREE.SpotLight(0xFFAA44, 2.2, 8.0, Math.PI / 4, 0.5, 1.2);
    spot.position.set(0, 4.0, 0.5);
    spot.target = backdrop;
    spot.castShadow = true;
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    spot.shadow.bias = -0.001;
    g.add(spot);
    this.stageSpotlight = spot;

    // Ambient Twilight Courtyard Light
    const ambient = new THREE.AmbientLight(0x281830, 0.75); // Warm twilight violet
    g.add(ambient);

    // 11. Puppet Mount Node (Stage center floor)
    const mount = new THREE.Group();
    mount.position.set(0, stageHeight + 0.1, -2.2);
    g.add(mount);
    this.puppetMount = mount;

    // 12. "Return to my room" Gaze+Pinch Tag (Seated Comfort Anchor)
    const tagGeo = new THREE.PlaneGeometry(0.32, 0.12);
    const tagMat = new THREE.MeshBasicMaterial({ color: 0x0B0A10, transparent: true, opacity: 0.85 });
    const tag = new THREE.Mesh(tagGeo, tagMat);
    tag.position.set(0.65, 0.75, -0.6); // Lower-right comfortable reach
    tag.rotation.y = -0.45;
    g.add(tag);
    this.returnTagMesh = tag;

    this.group = g;
    this.scene.add(g);
  }

  update(dt, elapsed = 0) {
    if (this.curtain) this.curtain.update(dt, elapsed);
    if (this.footlights) this.footlights.update(dt, elapsed);
    if (this.audience) this.audience.update(dt, elapsed);
  }

  triggerApplause() {
    if (this.audience) this.audience.applause();
  }

  destroy() {
    if (this.group && this.scene) {
      this.scene.remove(this.group);
    }
  }
}
