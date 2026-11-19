/* ================================================================
   LANTERN TALES — THEATRE STAGE FOOTLIGHTS (src/theatre/footlights.js)
   Traditional brass oil lamps & footlight trough along stage apron
   Warm amber illumination, flickering candle simulation, baked shadows
================================================================ */

export class StageFootlights {
  constructor(THREE, width = 2.4, count = 6) {
    this.THREE = THREE;
    this.width = width;
    this.count = count;
    this.group = null;
    this.lights = [];
    this.flickerSpeeds = [];

    if (THREE) {
      this.init();
    }
  }

  init() {
    const THREE = this.THREE;
    const g = new THREE.Group();

    // Brass material for trough
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xC8963E,
      roughness: 0.35,
      metalness: 0.75
    });

    // Footlight housing trough along stage front
    const troughGeo = new THREE.BoxGeometry(this.width, 0.05, 0.08);
    const trough = new THREE.Mesh(troughGeo, brassMat);
    trough.position.set(0, 0.025, 0);
    g.add(trough);

    const step = this.width / (this.count + 1);
    const startX = -this.width / 2 + step;

    for (let i = 0; i < this.count; i++) {
      const x = startX + i * step;

      // Small brass diya cup
      const cupGeo = new THREE.CylinderGeometry(0.028, 0.018, 0.035, 8);
      const cup = new THREE.Mesh(cupGeo, brassMat);
      cup.position.set(x, 0.05, 0);
      g.add(cup);

      // Glowing flame point
      const flameGeo = new THREE.ConeGeometry(0.012, 0.028, 6);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xFFAA33 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(x, 0.075, 0);
      g.add(flame);

      // Lightweight unshadowed amber point light
      const light = new THREE.PointLight(0xFF9922, 0.65, 1.8, 1.8);
      light.position.set(x, 0.12, 0.08);
      light.castShadow = false; // Keep draw calls minimal!
      g.add(light);
      this.lights.push(light);

      this.flickerSpeeds.push(5.0 + Math.random() * 6.0);
    }

    this.group = g;
  }

  update(dt, elapsed = 0) {
    for (let i = 0; i < this.lights.length; i++) {
      const flicker = Math.sin(elapsed * this.flickerSpeeds[i] + i) * 0.12;
      this.lights[i].intensity = 0.65 + flicker;
    }
  }
}
