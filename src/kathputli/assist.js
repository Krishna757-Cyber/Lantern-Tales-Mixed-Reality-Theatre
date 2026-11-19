/* ================================================================
   LANTERN TALES — KATHPUTLI PUPPETEER ASSIST & ACCESSIBILITY (src/kathputli/assist.js)
   Auto-balance, soft magnetic pose guidance, reduced-motion dampening
   Gaze-only dwell triggering for hands-free or motor-accessible play
================================================================ */

export class PuppeteerAssist {
  constructor(options = {}) {
    this.autoBalance = options.autoBalance ?? true;
    this.guidedStrings = options.guidedStrings ?? true;
    this.reducedMotion = options.reducedMotion ?? false;
    this.guidanceStrength = 0.35; // 0.0 (raw) to 1.0 (strict magnet)

    // Current target pose in show sequence
    this.targetPose = null; // { x, y, roll, action: 'nod' | 'spin' | 'bow' }
    this.targetDwell = 0;
    this.dwellRequired = 1.2; // 1.2s gaze dwell
  }

  setTargetPose(pose) {
    this.targetPose = pose;
    this.targetDwell = 0;
  }

  clearTargetPose() {
    this.targetPose = null;
    this.targetDwell = 0;
  }

  // Filter and assist crossbar target coordinates
  filterTarget(rawTarget, dt = 0.016) {
    const assisted = { ...rawTarget };

    // 1. Auto-balance: Prevent puppet from tumbling or inverting
    if (this.autoBalance) {
      // Clamp roll to comfortable ±45 degrees (±0.78 rad)
      assisted.roll = Math.max(-0.78, Math.min(0.78, assisted.roll));
      // Clamp pitch to ±30 degrees
      assisted.pitch = Math.max(-0.52, Math.min(0.52, assisted.pitch));
      // Clamp floor height so puppet doesn't sink into stage floor
      assisted.y = Math.max(1.35, Math.min(1.95, assisted.y));
    }

    // 2. Guided Strings: Gentle magnetic pull toward the show beat target
    if (this.guidedStrings && this.targetPose) {
      const pull = this.guidanceStrength;
      assisted.x += (this.targetPose.x - assisted.x) * pull;
      assisted.y += (this.targetPose.y - assisted.y) * pull;
      if (this.targetPose.roll !== undefined) {
        assisted.roll += (this.targetPose.roll - assisted.roll) * pull;
      }
    }

    // 3. Reduced-Motion: Smooth out rapid fluctuations
    if (this.reducedMotion) {
      assisted.roll *= 0.45;
      assisted.pitch *= 0.45;
    }

    return assisted;
  }

  // Gaze Dwell for Hands-free Accessibility
  updateGazeDwell(isLookingAtPuppet, dt, onDwellComplete = null) {
    if (!isLookingAtPuppet) {
      this.targetDwell = Math.max(0, this.targetDwell - dt * 2.0);
      return 0;
    }

    this.targetDwell += dt;
    const progress = Math.min(1.0, this.targetDwell / this.dwellRequired);

    if (progress >= 1.0 && typeof onDwellComplete === 'function') {
      onDwellComplete(this.targetPose?.action || 'nod');
      this.targetDwell = 0; // Reset after execution
    }

    return progress;
  }
}
