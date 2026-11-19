/* ================================================================
   LANTERN TALES — SAVAR HORSE-RIDER PUPPET (src/kathputli/puppets/rider.js)
   Turbaned rider with safaa, reins, and double-arm salutations
================================================================ */

import { KathputliRig } from '../rig.js';

export class SavarRider extends KathputliRig {
  constructor(config = {}) {
    super({
      name: 'Savar (Horse Rider)',
      type: 'rider',
      turbanColor: 0xE3A018, // Turmeric Safaa
      tunicColor: 0x1B4B36,  // Forest green angrakha
      skirtColor: 0xD29B63,  // Riding breeches
      scale: config.scale || 0.95
    });

    this.isWaving = false;
  }

  waveSalute() {
    this.isWaving = true;
    this.pluckString('leftHand');
    this.pluckString('rightHand');
  }
}
