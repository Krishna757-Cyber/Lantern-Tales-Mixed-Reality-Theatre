// src/story/ramayanaScript.ts — Pure typed data for Ramayana Katha
export interface RamayanaActor {
  puppet: string;
  enterFrom: 'left' | 'right' | 'center';
  x: number;
  pose: string;
  action?: string;
}

export interface RamayanaDialogue {
  puppet: string;
  textHi: string;
  textEn: string;
}

export interface RamayanaScene {
  id: string;
  kand: string;
  kandIndex: number;
  titleHi: string;
  titleEn: string;
  narrationHi: string;
  narrationEn: string;
  backdrop: string;
  actors: RamayanaActor[];
  dialogue?: RamayanaDialogue[];
  sfx?: string;
  music: {
    taal: string;
    tempo: number;
    mood: 'calm' | 'tense' | 'battle' | 'victory' | 'festive' | 'devotional';
  };
  durationMs: number;
}

export interface RamayanaKandMeta {
  id: number;
  nameEn: string;
  nameHi: string;
  descEn: string;
  descHi: string;
}

export { RAMAYANA_KANDS, RAMAYANA_SCENES } from './ramayanaScript.js';
