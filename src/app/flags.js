// src/app/flags.js — Runtime Feature Flags (ESM)
const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const queryTheatre = params ? params.get('theatre') === '1' || params.get('theatre') === 'true' : false;

export const FLAGS = {
  webcamMode: true,
  autoTour: true,
  showcaseSite: true,
  cornerFold: true,
  windowPortals: true,
  depthOcclusion: true,
  gazeLantern: true,
  theatre: queryTheatre || true,
  ramayanaKatha: true,
  backstageWorkshop: true,
  duetMultiplayer: true,
  proceduralVoice: true,
  proceduralRhythm: true,
  reducedMotion: false
};
