/* ================================================================
   LANTERN TALES — KATHPUTLI NETWORK PROTOCOL (src/net/kathputliFrames.js)
   Ultra-compact binary frame serializer for 2-player Duet over WebSocket
   Budget: <= 32 bytes per frame @ 20 Hz (actual binary payload: 15 bytes!)
================================================================ */

export function encodeKathputliFrame(state) {
  // 15-byte binary buffer
  const buffer = new ArrayBuffer(15);
  const view = new DataView(buffer);

  // Position: x, y, z as int16 (millimeters, range ±32.767m)
  view.setInt16(0, Math.round((state.x || 0) * 1000), true);
  view.setInt16(2, Math.round((state.y || 1.6) * 1000), true);
  view.setInt16(4, Math.round((state.z || -0.4) * 1000), true);

  // Rotations: roll, pitch, yaw as int8 scaled to [-128, 127] for [-PI, PI]
  const scaleAngle = (rad) => Math.round(Math.max(-128, Math.min(127, (rad / Math.PI) * 127)));
  view.setInt8(6, scaleAngle(state.roll || 0));
  view.setInt8(7, scaleAngle(state.pitch || 0));
  view.setInt8(8, scaleAngle(state.yaw || 0));

  // Pluck flags bitmask (bit 0: head, bit 1: leftHand, bit 2: rightHand, bit 3: waist)
  let bits = 0;
  if (state.pluckHead) bits |= 1 << 0;
  if (state.pluckLeft) bits |= 1 << 1;
  if (state.pluckRight) bits |= 1 << 2;
  if (state.pluckWaist) bits |= 1 << 3;
  if (state.isDancing) bits |= 1 << 4;
  view.setUint8(9, bits);

  // Timestamp: uint32 milliseconds (relative to epoch or performance.now())
  view.setUint32(10, (state.timestamp || performance.now()) >>> 0, true);

  // Puppet type identifier (0: dancer, 1: horse, 2: rider, 3: snake, 4: hero)
  view.setUint8(14, (state.puppetTypeId || 0) & 0xFF);

  return buffer;
}

export function decodeKathputliFrame(buffer) {
  const view = new DataView(buffer);
  const unscaleAngle = (b) => (b / 127) * Math.PI;

  const bits = view.getUint8(9);

  return {
    x: view.getInt16(0, true) / 1000,
    y: view.getInt16(2, true) / 1000,
    z: view.getInt16(4, true) / 1000,
    roll: unscaleAngle(view.getInt8(6)),
    pitch: unscaleAngle(view.getInt8(7)),
    yaw: unscaleAngle(view.getInt8(8)),
    pluckHead: (bits & (1 << 0)) !== 0,
    pluckLeft: (bits & (1 << 1)) !== 0,
    pluckRight: (bits & (1 << 2)) !== 0,
    pluckWaist: (bits & (1 << 3)) !== 0,
    isDancing: (bits & (1 << 4)) !== 0,
    timestamp: view.getUint32(10, true),
    puppetTypeId: view.getUint8(14)
  };
}
