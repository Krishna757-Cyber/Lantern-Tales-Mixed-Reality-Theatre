/* ================================================================
   LANTERN TALES — KATHPUTLI PUPPETEER ASSIST (src/kathputli/assist.ts)
================================================================ */

export interface TargetPose {
  x: number;
  y: number;
  roll?: number;
  action?: string;
}

export class PuppeteerAssist {
  autoBalance: boolean;
  guidedStrings: boolean;
  reducedMotion: boolean;
  guidanceStrength: number;
  targetPose: TargetPose | null;
  targetDwell: number;
  dwellRequired: number;

  constructor(options: any = {}) {
    this.autoBalance = options.autoBalance ?? true;
    this.guidedStrings = options.guidedStrings ?? true;
    this.reducedMotion = options.reducedMotion ?? false;
    this.guidanceStrength = 0.35;
    this.targetPose = null;
    this.targetDwell = 0;
    this.dwellRequired = 1.2;
  }
}
