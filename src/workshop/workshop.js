/* ================================================================
   LANTERN TALES — BACKSTAGE KATHPUTLI WORKSHOP (src/workshop/workshop.js)
   Assembles custom puppet from traditional parts with pinch & drag
   Persists to the troupe shelf and performs across all shows
================================================================ */

import { WORKSHOP_PARTS } from './parts.js';
import { KathputliRig } from '../kathputli/rig.js';

export class BackstageWorkshop {
  constructor() {
    this.currentAssembly = {
      name: 'Custom Kathputli',
      headId: 'rohida_classic',
      turbanId: 'safaa_turmeric',
      tunicId: 'angrakha_indigo',
      skirtId: 'ghaghra_rani',
      moustacheId: 'moust_court'
    };

    this.troupeShelf = [];
    this.loadTroupeShelf();
  }

  loadTroupeShelf() {
    try {
      const saved = localStorage.getItem('lt_troupe_shelf');
      if (saved) {
        this.troupeShelf = JSON.parse(saved);
      }
    } catch (e) {
      this.troupeShelf = [];
    }
  }

  saveTroupeShelf() {
    try {
      localStorage.setItem('lt_troupe_shelf', JSON.stringify(this.troupeShelf));
    } catch (e) {}
  }

  setPart(category, partId) {
    if (category in this.currentAssembly) {
      this.currentAssembly[category] = partId;
    }
  }

  createRigConfig() {
    const head = WORKSHOP_PARTS.heads.find(h => h.id === this.currentAssembly.headId) || WORKSHOP_PARTS.heads[0];
    const turban = WORKSHOP_PARTS.turbans.find(t => t.id === this.currentAssembly.turbanId) || WORKSHOP_PARTS.turbans[0];
    const tunic = WORKSHOP_PARTS.tunics.find(u => u.id === this.currentAssembly.tunicId) || WORKSHOP_PARTS.tunics[0];
    const skirt = WORKSHOP_PARTS.skirts.find(s => s.id === this.currentAssembly.skirtId) || WORKSHOP_PARTS.skirts[0];

    return {
      name: this.currentAssembly.name,
      woodColor: head.color,
      turbanColor: turban.color,
      tunicColor: tunic.color,
      skirtColor: skirt.color,
      scale: 1.0
    };
  }

  assemblePuppet() {
    const config = this.createRigConfig();
    return new KathputliRig(config);
  }

  saveCurrentToShelf(customName = 'My Kathputli') {
    this.currentAssembly.name = customName;
    const item = {
      id: `puppet_${Date.now()}`,
      ...this.currentAssembly,
      createdAt: new Date().toISOString()
    };
    this.troupeShelf.push(item);
    this.saveTroupeShelf();
    return item;
  }
}
