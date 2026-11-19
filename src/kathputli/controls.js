/* ================================================================
   LANTERN TALES — KATHPUTLI HAND CONTROLLER (src/kathputli/controls.js)
   Maps WebXR bare-hands / Webcam / Mouse to Crossbar & String Plucks
   Zero controllers, seated 2-foot radius, one-hand & two-hand modes
================================================================ */

export class KathputliController {
  constructor(rig, options = {}) {
    this.rig = rig;
    this.mode = options.mode || 'hands'; // 'hands' | 'mouse' | 'webcam' | 'ghost'
    this.twoHandMode = options.twoHandMode || false;
    this.oneHandMode = options.oneHandMode || true;

    // Crossbar tracking target
    this.target = {
      x: 0,
      y: 1.65,
      z: -0.4,
      roll: 0,
      pitch: 0,
      yaw: 0
    };

    // Pinch state detection
    this.wasPinching = false;
    this.pinchStartTime = 0;
    this.lastPluckTime = -1000;

    // Hand velocity tracking for dance detection
    this.prevHandY = 0;
    this.handSpeed = 0;
    this.wiggleCount = 0;

    // Ghost recorded tracks
    this.ghostTrack = options.ghostTrack || null;
    this.ghostIndex = 0;
  }

  setMode(mode) {
    this.mode = mode;
  }

  // Primary WebXR Bare Hand Tracking Update
  updateFromHand(primaryHand, secondaryHand = null, dt = 0.016) {
    if (!primaryHand || !primaryHand.present) return;

    // 1. Crossbar position bound to index-thumb pinch / palm point
    const pinchX = (primaryHand.pinchX !== undefined) ? primaryHand.pinchX : primaryHand.x;
    const pinchY = (primaryHand.pinchY !== undefined) ? primaryHand.pinchY : primaryHand.y;
    const pinchZ = (primaryHand.pinchZ !== undefined) ? primaryHand.pinchZ : (primaryHand.z || -0.4);

    // Map 2D/3D normalized hand coordinates to theatre stage meters
    // Stage center is at y = 1.1m, crossbar reaches 1.4m - 1.85m
    this.target.x = (pinchX - 0.5) * 1.4;
    this.target.y = 1.45 + (1.0 - pinchY) * 0.45;
    this.target.z = pinchZ;

    // 2. Wrist Roll & Tilt
    const wristRoll = primaryHand.wristRoll || primaryHand.rotationZ || 0;
    const wristPitch = primaryHand.wristPitch || 0;
    this.target.roll = wristRoll * 0.8;
    this.target.pitch = wristPitch * 0.5;
    this.target.yaw = (primaryHand.x - 0.5) * 0.6;

    // 3. Pinch-to-Pluck Detection
    const isPinching = primaryHand.isPinching || primaryHand.pinchDistance < 0.035;
    const now = performance.now();

    if (this.wasPinching && !isPinching) {
      // Quick pinch-release detected -> Pluck head string for a nod
      if (now - this.lastPluckTime > 180) {
        this.rig.pluckString('head');
        this.lastPluckTime = now;
      }
    }
    this.wasPinching = isPinching;

    // 4. Finger Wiggle / Walker Pose Mapping -> Dance
    const poseId = primaryHand.poseId || 0;
    const isWiggling = (poseId === 5 || poseId === 6); // Wings / Walker pose
    const dy = Math.abs(pinchY - this.prevHandY);
    this.handSpeed = dy / Math.max(dt, 0.001);
    this.prevHandY = pinchY;

    if (isWiggling || this.handSpeed > 1.2) {
      this.rig.danceStep(Math.min(2.0, 1.0 + this.handSpeed * 0.5));
    }

    // 5. Two-Hand Mode: Off-hand controls secondary gestures (bow/wave)
    if (this.twoHandMode && secondaryHand && secondaryHand.present) {
      const secPinching = secondaryHand.isPinching || secondaryHand.pinchDistance < 0.035;
      if (secPinching) {
        if (secondaryHand.x < 0.5) {
          this.rig.pluckString('leftHand');
        } else {
          this.rig.pluckString('rightHand');
        }
      }
    }

    // 6. Smooth Crossbar Application
    this.rig.setCrossbar(
      this.target.x,
      this.target.y,
      this.target.z,
      this.target.roll,
      this.target.pitch,
      this.target.yaw
    );
  }

  // Mouse / Trackpad Fallback
  updateFromMouse(mouseX, mouseY, isDown, dt = 0.016) {
    this.target.x = mouseX * 1.2;
    this.target.y = 1.45 + mouseY * 0.35;
    this.target.roll = mouseX * 0.5;

    const now = performance.now();
    if (isDown && !this.wasPinching) {
      if (now - this.lastPluckTime > 200) {
        this.rig.pluckString('head');
        this.lastPluckTime = now;
      }
    }
    this.wasPinching = isDown;

    const dy = Math.abs(mouseY - this.prevHandY);
    this.handSpeed = dy / Math.max(dt, 0.001);
    this.prevHandY = mouseY;

    if (this.handSpeed > 1.5) {
      this.rig.danceStep(1.2);
    }

    this.rig.setCrossbar(
      this.target.x,
      this.target.y,
      this.target.z,
      this.target.roll,
      0,
      0
    );
  }

  // Ghost Playback for Tours & Demonstrations
  updateGhost(timeSeconds) {
    const t = timeSeconds;
    // Harmonious periodic dance motion
    const gx = Math.sin(t * 1.8) * 0.35;
    const gy = 1.62 + Math.cos(t * 3.6) * 0.08;
    const roll = Math.sin(t * 2.2) * 0.35;
    const yaw = Math.sin(t * 1.2) * 0.3;

    this.rig.setCrossbar(gx, gy, -0.4, roll, 0, yaw);

    // Periodic plucks and spins
    if (Math.sin(t * 2.5) > 0.95) {
      this.rig.pluckString('head');
    }
    this.rig.danceStep(1.0);
  }
}
