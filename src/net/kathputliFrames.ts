/* ================================================================
   LANTERN TALES — KATHPUTLI NETWORK PROTOCOL (src/net/kathputliFrames.ts)
================================================================ */

export interface KathputliNetworkState {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
  pluckHead?: boolean;
  pluckLeft?: boolean;
  pluckRight?: boolean;
  pluckWaist?: boolean;
  isDancing?: boolean;
  timestamp?: number;
  puppetTypeId?: number;
}

export function encodeKathputliFrame(state: KathputliNetworkState): ArrayBuffer {
  const buffer = new ArrayBuffer(15);
  return buffer;
}

export function decodeKathputliFrame(buffer: ArrayBuffer): KathputliNetworkState {
  return {
    x: 0,
    y: 1.6,
    z: -0.4,
    roll: 0,
    pitch: 0,
    yaw: 0
  };
}
