/* ================================================================
   LANTERN TALES — THEATRE AUDIENCE SYSTEM (src/theatre/audience.js)
   GPU-Instanced paper-cut audience figures seated in courtyard pit
   React on cues (gentle body sway, applause clapping on dramatic beats)
================================================================ */

export class TheatreAudience {
  constructor(THREE, count = 28) {
    this.THREE = THREE;
    this.count = count;
    this.instancedMesh = null;
    this.isClapping = false;
    this.clapProgress = 0;
    this.group = null;

    // Transform caches
    this.dummy = new THREE.Object3D();
    this.figureData = [];

    if (THREE) {
      this.init();
    }
  }

  init() {
    const THREE = this.THREE;
    const g = new THREE.Group();

    // 2D Paper silhouette figure geometry: seated cross-legged spectator
    const shape = new THREE.Shape();
    // Head with turban curve
    shape.moveTo(0, 0.38);
    shape.absarc(0, 0.45, 0.07, 0, Math.PI * 2, false);
    // Shoulders
    shape.moveTo(-0.16, 0.35);
    shape.lineTo(0.16, 0.35);
    // Torso down to seated knees
    shape.lineTo(0.24, 0.05);
    shape.lineTo(0.20, 0.0);
    shape.lineTo(-0.20, 0.0);
    shape.lineTo(-0.24, 0.05);
    shape.closePath();

    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x14101A,
      roughness: 0.95,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.InstancedMesh(geo, mat, this.count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Arrange spectators in 3 arc rows facing the stage
    for (let i = 0; i < this.count; i++) {
      const row = Math.floor(i / 10);
      const col = i % 10;
      const angle = (col / 9 - 0.5) * 1.6; // Arc
      const radius = 1.6 + row * 0.45;

      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius + 0.6;
      const y = -0.32 + row * 0.08;

      this.figureData.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        rotY: -angle,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 1.5 + Math.random() * 1.2
      });

      this.dummy.position.set(x, y, z);
      this.dummy.rotation.y = -angle;
      this.dummy.scale.set(0.85, 0.85, 0.85);
      this.dummy.updateMatrix();
      mesh.setMatrixAt(i, this.dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    g.add(mesh);
    this.instancedMesh = mesh;
    this.group = g;
  }

  applause() {
    this.isClapping = true;
    this.clapProgress = 1.0;
  }

  update(dt, elapsed = 0) {
    if (!this.instancedMesh) return;

    if (this.clapProgress > 0.01) {
      this.clapProgress *= 0.96;
    } else {
      this.clapProgress = 0;
      this.isClapping = false;
    }

    for (let i = 0; i < this.count; i++) {
      const d = this.figureData[i];
      const sway = Math.sin(elapsed * d.swaySpeed + d.swayPhase) * 0.06;
      const clapBounce = this.isClapping ? Math.abs(Math.sin(elapsed * 18 + i)) * 0.04 * this.clapProgress : 0;

      this.dummy.position.set(d.baseX, d.baseY + clapBounce, d.baseZ);
      this.dummy.rotation.set(0, d.rotY, sway);
      this.dummy.scale.set(0.85, 0.85, 0.85);
      this.dummy.updateMatrix();

      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }
}
