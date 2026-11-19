/* ================================================================
   LANTERN TALES — WEBCAM HAND TRACKER
   On-device, strictly private camera tracking via MediaPipe
================================================================ */

import { map21to25, classifyPose } from '../recognizer/poses.js';

export const WebcamInput = {
  active: false,
  stream: null,
  videoEl: null,
  landmarker: null,
  lastVideoTime: -1,
  hand: {
    x: 0.5,
    y: 0.5,
    present: false,
    pose: 1,
    confidence: 0,
    joints25: []
  }
};

export async function initWebcamInput(videoElement) {
  WebcamInput.videoEl = videoElement;
}

export async function requestWebcamStream() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      WebcamInput.stream = stream;
      if (WebcamInput.videoEl) {
        WebcamInput.videoEl.srcObject = stream;
        await WebcamInput.videoEl.play();
      }
      WebcamInput.active = true;
      return true;
    } catch (err) {
      console.warn('[Webcam] Permission denied or camera unavailable:', err.message);
      return false;
    }
  }
  return false;
}

export function stopWebcamStream() {
  if (WebcamInput.stream) {
    WebcamInput.stream.getTracks().forEach(t => t.stop());
    WebcamInput.stream = null;
  }
  WebcamInput.active = false;
  WebcamInput.hand.present = false;
}

export function processWebcamFrame(onHandDetected) {
  if (!WebcamInput.active || !WebcamInput.videoEl) return;
  // Frame processing loop hook (runs in stage render loop)
}
