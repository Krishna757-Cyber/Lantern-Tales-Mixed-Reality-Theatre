/* ================================================================
   LANTERN TALES — SAPERA CLOTH SERPENT (src/kathputli/puppets/snake.js)
   Layered cloth snake with flared hood, peaceful music-driven rise
================================================================ */

import { KathputliRig } from '../rig.js';

export class SaperaSnake extends KathputliRig {
  constructor(config = {}) {
    super({
      name: 'Naag (Cloth Serpent)',
      type: 'snake',
      skirtColor: 0x1E3A2F, // Emerald scales
      turbanColor: 0xE3A018, // Gold hood markings
      scale: config.scale || 0.85
    });

    this.swayPhase = 0;
    this.riseHeight = 0;
  }

  swayToMusic(speed = 1.0) {
    this.swayPhase += 0.08 * speed;
    this.rotation.y = Math.sin(this.swayPhase) * 0.45;
    this.position.x = Math.sin(this.swayPhase * 0.7) * 0.12;
  }

  riseFromBasket(progress = 0) {
    this.riseHeight = Math.min(1.0, progress);
    this.position.y = 0.8 + this.riseHeight * 0.45;
  }
}
