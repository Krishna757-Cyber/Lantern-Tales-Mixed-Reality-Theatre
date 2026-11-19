/* ================================================================
   LANTERN TALES — PROCEDURAL BOLI REED VOICE (src/kathputli/voice.ts)
================================================================ */

export class KathputliVoice {
  audioCtx: AudioContext | null;
  masterGain: GainNode | null;
  lastTriggerTime: number;

  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.lastTriggerTime = 0;
  }

  init(): void {}
  playSqueak(expression = 'greet', headTilt = 0): void {}
  spawnIconBubble(icon: string): void {}
}
