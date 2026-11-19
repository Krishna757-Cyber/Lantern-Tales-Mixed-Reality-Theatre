/* ================================================================
   LANTERN TALES — AMAR SINGH RATHORE FOLK HERO (src/kathputli/puppets/hero.js)
   Saffron turban, carved shield, dignified upright posture, bow of honour
================================================================ */

import { KathputliRig } from '../rig.js';

export class AmarSinghHero extends KathputliRig {
  constructor(config = {}) {
    super({
      name: 'Amar Singh Rathore (Folk Hero)',
      type: 'hero',
      turbanColor: 0xF39C12, // Royal saffron safaa
      tunicColor: 0x8E1B1B,  // Crimson angrakha
      skirtColor: 0xFAF3E4,  // White pleated ghaghra
      woodColor: 0xD29B63,
      scale: config.scale || 1.1
    });

    this.honorBowProgress = 0;
  }

  performHonorBow() {
    this.pluckString('head');
    this.pluckString('waist');
    this.honorBowProgress = 1.0;
  }
}
