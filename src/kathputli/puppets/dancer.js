/* ================================================================
   LANTERN TALES — ANARKALI COURT DANCER PUPPET (src/kathputli/puppets/dancer.js)
   Rani-pink skirt, gold gota lace, spinning ghungroo pirouettes
================================================================ */

import { KathputliRig } from '../rig.js';

export class AnarkaliDancer extends KathputliRig {
  constructor(config = {}) {
    super({
      name: 'Anarkali (Court Dancer)',
      type: 'dancer',
      skirtColor: 0xC2185B,   // Rani Pink
      turbanColor: 0xE3A018,  // Turmeric Gold Odhni
      tunicColor: 0x2B3A8C,   // Indigo bodice
      woodColor: 0xD29B63,
      scale: config.scale || 1.0
    });

    this.spinCount = 0;
    this.petalEmissionRate = 0;
  }

  // Rapid Kathak pirouette
  spinPirouette(speed = 1.5) {
    this.skirtAngularVelocity += 6.28 * speed;
    this.spinCount++;
    this.petalEmissionRate = 12;
  }
}
