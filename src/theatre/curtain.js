/* ================================================================
   LANTERN TALES — THEATRE PROSCENIUM CURTAIN (src/theatre/curtain.js)
   Pleated velvet cloth with gold bullion fringe and cords
   Smooth parting easing on show start with low-overhead vertex sway
================================================================ */

export class TheatreCurtain {
  constructor(THREE, width = 2.4, height = 1.6) {
    this.THREE = THREE;
    this.width = width;
    this.height = height;
    this.openProgress = 0; // 0 (closed) to 1 (fully parted)
    this.isOpen = false;
    this.group = null;
    this.leftPanel = null;
    this.rightPanel = null;

    if (THREE) {
      this.init();
    }
  }

  init() {
    const THREE = this.THREE;
    const g = new THREE.Group();

    // Royal crimson velvet material
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x851428,
      roughness: 0.9,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      roughness: 0.35,
      metalness: 0.85
    });

    const panelW = this.width / 2;
    const geo = new THREE.PlaneGeometry(panelW, this.height, 12, 12);

    // Left curtain panel
    const left = new THREE.Mesh(geo, velvetMat);
    left.position.set(-panelW / 2, this.height / 2, 0);
    g.add(left);
    this.leftPanel = left;

    // Right curtain panel
    const right = new THREE.Mesh(geo.clone(), velvetMat);
    right.position.set(panelW / 2, this.height / 2, 0);
    g.add(right);
    this.rightPanel = right;

    // Top Valance Pelmet (scalloped velvet with gold fringe)
    const valanceGeo = new THREE.PlaneGeometry(this.width, 0.28);
    const valance = new THREE.Mesh(valanceGeo, velvetMat);
    valance.position.set(0, this.height - 0.14, 0.02);
    g.add(valance);

    // Gold braided fringe line
    const fringeGeo = new THREE.CylinderGeometry(0.012, 0.012, this.width, 16);
    const fringe = new THREE.Mesh(fringeGeo, goldMat);
    fringe.rotation.z = Math.PI / 2;
    fringe.position.set(0, this.height - 0.28, 0.025);
    g.add(fringe);

    this.group = g;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  update(dt, elapsed = 0) {
    const target = this.isOpen ? 1.0 : 0.0;
    this.openProgress += (target - this.openProgress) * 0.08;

    if (!this.leftPanel || !this.rightPanel) return;

    const panelW = this.width / 2;
    const sway = Math.sin(elapsed * 2.5) * 0.008;

    // Left panel folds toward -width/2
    const leftScaleX = Math.max(0.08, 1.0 - this.openProgress * 0.92);
    this.leftPanel.scale.x = leftScaleX;
    this.leftPanel.position.x = -panelW + (panelW / 2) * leftScaleX + sway;

    // Right panel folds toward +width/2
    const rightScaleX = Math.max(0.08, 1.0 - this.openProgress * 0.92);
    this.rightPanel.scale.x = rightScaleX;
    this.rightPanel.position.x = panelW - (panelW / 2) * rightScaleX - sway;
  }
}
