/* ================================================================
   LANTERN TALES — KATHPUTLI RIG & PUPPET ANATOMY (src/kathputli/rig.ts)
================================================================ */

import { PuppetStringSystem, PuppetString } from './strings.js';

export interface RigColors {
  wood: number;
  skirt: number;
  turban: number;
  tunic: number;
  goldTrim: number;
  string: number;
}

export interface CrossbarState {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
  width: number;
}

export class KathputliRig {
  name: string;
  type: string;
  scale: number;
  colors: RigColors;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  skirtFlare: number;
  skirtAngle: number;
  skirtAngularVelocity: number;
  headTilt: number;
  bowProgress: number;
  nodProgress: number;
  isDancing: boolean;
  dancePhase: number;
  stringSystem: PuppetStringSystem;
  headString: PuppetString;
  leftHandString: PuppetString;
  rightHandString: PuppetString;
  waistString: PuppetString;
  crossbar: CrossbarState;
  group: any;
  headMesh: any;
  skirtMesh: any;
  leftArmMesh: any;
  rightArmMesh: any;
  stringLineMeshes: any[];

  constructor(config: any = {}) {
    this.name = config.name || 'Anarkali';
    this.type = config.type || 'dancer';
    this.scale = config.scale || 1.0;

    this.colors = {
      wood: config.woodColor || 0xD29B63,
      skirt: config.skirtColor || 0xC2185B,
      turban: config.turbanColor || 0xE3A018,
      tunic: config.tunicColor || 0x2B3A8C,
      goldTrim: 0xFFD700,
      string: 0x222222
    };

    this.position = { x: 0, y: 1.1, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.skirtFlare = 0.2;
    this.skirtAngle = 0;
    this.skirtAngularVelocity = 0;
    this.headTilt = 0;
    this.bowProgress = 0;
    this.nodProgress = 0;
    this.isDancing = false;
    this.dancePhase = 0;

    this.stringSystem = new PuppetStringSystem();
    this.headString = this.stringSystem.addString('head', 0.55, 4);
    this.leftHandString = this.stringSystem.addString('leftHand', 0.62, 4);
    this.rightHandString = this.stringSystem.addString('rightHand', 0.62, 4);
    this.waistString = this.stringSystem.addString('waist', 0.70, 4);

    this.crossbar = {
      x: 0,
      y: 1.65,
      z: 0,
      roll: 0,
      pitch: 0,
      yaw: 0,
      width: 0.28
    };

    this.group = null;
    this.headMesh = null;
    this.skirtMesh = null;
    this.leftArmMesh = null;
    this.rightArmMesh = null;
    this.stringLineMeshes = [];
  }
}
