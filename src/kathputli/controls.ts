/* ================================================================
   LANTERN TALES — KATHPUTLI HAND CONTROLLER (src/kathputli/controls.ts)
================================================================ */

import { KathputliRig } from './rig.js';

export interface HandFrame {
  present: boolean;
  x: number;
  y: number;
  z?: number;
  pinchX?: number;
  pinchY?: number;
  pinchZ?: number;
  isPinching?: boolean;
  pinchDistance?: number;
  wristRoll?: number;
  wristPitch?: number;
  rotationZ?: number;
  poseId?: number;
}

export class KathputliController {
  rig: KathputliRig;
  mode: string;
  twoHandMode: boolean;
  oneHandMode: boolean;
  target: { x: number; y: number; z: number; roll: number; pitch: number; yaw: number };
  wasPinching: boolean;
  lastPluckTime: number;
  prevHandY: number;
  handSpeed: number;

  constructor(rig: KathputliRig, options: any = {}) {
    this.rig = rig;
    this.mode = options.mode || 'hands';
    this.twoHandMode = options.twoHandMode || false;
    this.oneHandMode = options.oneHandMode || true;
    this.target = { x: 0, y: 1.65, z: -0.4, roll: 0, pitch: 0, yaw: 0 };
    this.wasPinching = false;
    this.lastPluckTime = 0;
    this.prevHandY = 0;
    this.handSpeed = 0;
  }
}
