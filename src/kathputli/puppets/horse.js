/* ================================================================
   LANTERN TALES — GHODI MARWARI HORSE PUPPET (src/kathputli/puppets/horse.js)
   Carved wooden body, inward-pointing ears, prancing string rig
================================================================ */

import { KathputliRig } from '../rig.js';

export class GhodiHorse extends KathputliRig {
  constructor(config = {}) {
    super({
      name: 'Ghodi (Marwari Horse)',
      type: 'horse',
      woodColor: 0x8D5B36,
      skirtColor: 0x9B1B1B, // Saffron-red caparison
      scale: config.scale || 1.15
    });

    this.prancePhase = 0;
    this.isPrancing = false;
  }

  prance(speed = 1.0) {
    this.isPrancing = true;
    this.prancePhase += 0.2 * speed;
    this.position.y += Math.sin(this.prancePhase * 4) * 0.02;
    this.rotation.z = Math.sin(this.prancePhase * 2) * 0.15;
  }
}
