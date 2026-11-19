/* ================================================================
   LANTERN TALES — POSE RECOGNIZER MODULE
   25-Joint Schema & Spatial Classifier (src/recognizer/poses.ts)
================================================================ */

export const POSES = {
  1: { id: 1, name: 'Kindle', icon: '🫲', key: '1', hint: 'Open palm — lights the lantern' },
  2: { id: 2, name: 'Beak', icon: '◑', key: '2', hint: 'Pinch — beak becomes crow' },
  3: { id: 3, name: 'Pebble', icon: '✊', key: '3', hint: 'Clenched fist — drops stones, water rises' },
  4: { id: 4, name: 'Guide', icon: '👉', key: '4', hint: 'Index point — steers the bird' },
  5: { id: 5, name: 'Wings', icon: '✌️', key: '5', hint: 'Two fingers — flap to fly' },
  6: { id: 6, name: 'Sunrise', icon: '☀️', key: '6', hint: 'Thumb + index L-frame — lifts the sun' },
  7: { id: 7, name: 'Meet', icon: '🤝', key: '7', hint: 'Two hands — shadow duet across wall' },
  8: { id: 8, name: 'Bloom', icon: '🏮', key: '8', hint: 'Thumb + pinky — lights shelf of lanterns' }
};

/**
 * Maps MediaPipe 21 landmarks into the 25-joint schema
 * Adds 4 derived palm and knuckle reference joints
 */
export function map21to25(lm) {
  if (!lm || lm.length < 21) return [];
  const j = lm.map(p => ({ x: p.x, y: p.y, z: p.z || 0 }));

  // Derived 21: Palm center
  const palm = {
    x: (j[0].x + j[5].x + j[17].x) / 3,
    y: (j[0].y + j[5].y + j[17].y) / 3,
    z: (j[0].z + j[5].z + j[17].z) / 3
  };
  // Derived 22: Index-Middle knuckle midpoint
  const imMid = {
    x: (j[5].x + j[9].x) / 2,
    y: (j[5].y + j[9].y) / 2,
    z: (j[5].z + j[9].z) / 2
  };
  // Derived 23: Ring-Pinky knuckle midpoint
  const rpMid = {
    x: (j[13].x + j[17].x) / 2,
    y: (j[13].y + j[17].y) / 2,
    z: (j[13].z + j[17].z) / 2
  };
  // Derived 24: Palm base above wrist
  const base = {
    x: (j[0].x * 2 + j[9].x) / 3,
    y: (j[0].y * 2 + j[9].y) / 3,
    z: (j[0].z * 2 + j[9].z) / 3
  };

  j.push(palm, imMid, rpMid, base);
  return j;
}

export function dist(a, b) {
  if (!a || !b) return 999;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);
  return Math.hypot(dx, dy, dz);
}

export function isExtended(tipIdx, pipIdx, wrist, joints) {
  return dist(joints[tipIdx], wrist) > dist(joints[pipIdx], wrist) * 1.15;
}

/**
 * Classifies 25 joints into one of the 8 canonical fable poses
 */
export function classifyPose(joints) {
  if (!joints || joints.length < 25) {
    return { pose: 1, name: POSES[1].name, confidence: 0.5 };
  }

  const wrist = joints[0];
  const thumbTip = joints[4];
  const indexTip = joints[8];
  const middleTip = joints[12];
  const ringTip = joints[16];
  const pinkyTip = joints[20];

  const extThumb = dist(thumbTip, wrist) > dist(joints[2], wrist) * 1.1;
  const extIndex = isExtended(8, 6, wrist, joints);
  const extMiddle = isExtended(12, 10, wrist, joints);
  const extRing = isExtended(16, 14, wrist, joints);
  const extPinky = isExtended(20, 18, wrist, joints);

  const pinchDist = dist(thumbTip, indexTip);
  const isPinch = pinchDist < 0.085;

  // 1. BEAK: Thumb and Index pinch while other fingers folded
  if (isPinch && !extRing && !extPinky) {
    return { pose: 2, name: POSES[2].name, confidence: 0.96, pinchDist };
  }

  // 2. PEBBLE: Clenched fist (all fingers folded)
  if (!extIndex && !extMiddle && !extRing && !extPinky) {
    return { pose: 3, name: POSES[3].name, confidence: 0.95 };
  }

  // 3. GUIDE: Index extended only
  if (extIndex && !extMiddle && !extRing && !extPinky) {
    return { pose: 4, name: POSES[4].name, confidence: 0.94 };
  }

  // 4. WINGS: Victory shape (Index + Middle extended)
  if (extIndex && extMiddle && !extRing && !extPinky) {
    return { pose: 5, name: POSES[5].name, confidence: 0.95 };
  }

  // 5. SUNRISE: Thumb + Index L-shape
  if (extThumb && extIndex && !extMiddle && !extRing && !extPinky) {
    return { pose: 6, name: POSES[6].name, confidence: 0.92 };
  }

  // 6. BLOOM: Thumb + Pinky extended
  if (extThumb && extPinky && !extMiddle && !extRing) {
    return { pose: 8, name: POSES[8].name, confidence: 0.90 };
  }

  // 7. KINDLE: Open palm (all fingers extended)
  if (extIndex && extMiddle && extRing && extPinky) {
    return { pose: 1, name: POSES[1].name, confidence: 0.97 };
  }

  // Default fallback to Kindle / Pose 1
  return { pose: 1, name: POSES[1].name, confidence: 0.75 };
}
