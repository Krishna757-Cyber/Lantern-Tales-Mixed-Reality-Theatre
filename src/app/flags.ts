// src/app/flags.ts — Runtime Feature Flags
export interface FeatureFlags {
  webcamMode: boolean;
  autoTour: boolean;
  showcaseSite: boolean;
  cornerFold: boolean;
  windowPortals: boolean;
  depthOcclusion: boolean;
  gazeLantern: boolean;
  theatre: boolean;
  backstageWorkshop: boolean;
  duetMultiplayer: boolean;
  proceduralVoice: boolean;
  proceduralRhythm: boolean;
  reducedMotion: boolean;
}

const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
const queryTheatre = params ? params.get('theatre') === '1' || params.get('theatre') === 'true' : false;

export const FLAGS: FeatureFlags = {
  webcamMode: true,
  autoTour: true,
  showcaseSite: true,
  cornerFold: true,
  windowPortals: true,
  depthOcclusion: true,
  gazeLantern: true,
  theatre: queryTheatre || true, // Enabled or controllable via ?theatre=1
  backstageWorkshop: true,
  duetMultiplayer: true,
  proceduralVoice: true,
  proceduralRhythm: true,
  reducedMotion: false
};
