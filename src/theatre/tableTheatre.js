/* ================================================================
   LANTERN TALES — TABLETOP MINIATURE THEATRE (src/theatre/tableTheatre.js)
   Mixed Reality (MR) Proscenium stage (~80 cm wide)
   Snaps to detected table surface or floats at comfortable seated distance
================================================================ */

import { TheatreCurtain } from './curtain.js';
import { StageFootlights } from './footlights.js';

export class TableTheatre {
  constructor(THREE, options = {}) {
    this.THREE = THREE;
    this.scale = options.scale || 0.42; // ~80 cm wide
    this.group = null;
    this.curtain = null;
    this.footlights = null;
    this.puppetAnchor = null;

    if (THREE) {
      this.init();
    }
  }

  init() {
    const THREE = this.THREE;
    const g = new THREE.Group();
    g.scale.set(this.scale, this.scale, this.scale);

    // Warm teak wood material
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x5C381E,
      roughness: 0.7,
      metalness: 0.1
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xE3A018,
      roughness: 0.35,
      metalness: 0.8
    });

    // 1. Stage Floor Platform (0.8m x 0.5m)
    const stageWidth = 2.0;
    const stageDepth = 1.2;
    const floorGeo = new THREE.BoxGeometry(stageWidth, 0.08, stageDepth);
    const floorMesh = new THREE.Mesh(floorGeo, woodMat);
    floorMesh.position.set(0, -0.04, -stageDepth / 2);
    floorMesh.receiveShadow = true;
    g.add(floorMesh);

    // 2. Proscenium Columns & Carved Arch
    const colGeo = new THREE.BoxGeometry(0.12, 1.6, 0.12);
    const leftCol = new THREE.Mesh(colGeo, woodMat);
    leftCol.position.set(-stageWidth / 2, 0.8, 0);
    g.add(leftCol);

    const rightCol = new THREE.Mesh(colGeo, woodMat);
    rightCol.position.set(stageWidth / 2, 0.8, 0);
    g.add(rightCol);

    // Carved Rajasthani Scalloped Arch Top
    const archGeo = new THREE.BoxGeometry(stageWidth + 0.24, 0.28, 0.14);
    const archMesh = new THREE.Mesh(archGeo, woodMat);
    archMesh.position.set(0, 1.6 + 0.14, 0);
    g.add(archMesh);

    // Arch gold crest
    const crestGeo = new THREE.ConeGeometry(0.08, 0.22, 6);
    const crest = new THREE.Mesh(crestGeo, goldMat);
    crest.position.set(0, 1.6 + 0.28 + 0.11, 0);
    g.add(crest);

    // 3. Painted Fabric Backdrop (Rear roller)
    const backdropGeo = new THREE.PlaneGeometry(stageWidth - 0.1, 1.5);
    const backdropMat = new THREE.MeshStandardMaterial({
      color: 0xFDF5E6, // Warm cream parchment backdrop
      roughness: 0.95
    });
    const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
    backdrop.position.set(0, 0.85, -stageDepth + 0.05);
    backdrop.receiveShadow = true;
    g.add(backdrop);

    // 4. Proscenium Curtain
    this.curtain = new TheatreCurtain(THREE, stageWidth, 1.55);
    this.curtain.group.position.set(0, 0.05, 0.02);
    g.add(this.curtain.group);

    // 5. Stage Footlights
    this.footlights = new StageFootlights(THREE, stageWidth - 0.2, 5);
    this.footlights.group.position.set(0, 0.02, 0.04);
    g.add(this.footlights.group);

    // 6. Puppet Anchor Node (Stage center)
    const anchor = new THREE.Group();
    anchor.position.set(0, 0.45, -stageDepth / 2);
    g.add(anchor);
    this.puppetAnchor = anchor;

    this.group = g;
  }

  update(dt, elapsed = 0) {
    if (this.curtain) this.curtain.update(dt, elapsed);
    if (this.footlights) this.footlights.update(dt, elapsed);
  }
}
