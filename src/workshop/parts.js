/* ================================================================
   LANTERN TALES — KATHPUTLI WORKSHOP PARTS (src/workshop/parts.js)
   Authentic modular components for custom puppet assembly
   Wood heads, turbans/odhnis, moustaches, ghaghra skirts, gota lace
================================================================ */

export const WORKSHOP_PARTS = {
  heads: [
    { id: 'rohida_classic', name: 'Rohida Wood (Classic Court)', color: 0xD29B63, finish: 'smooth' },
    { id: 'mango_aged', name: 'Desert Mango Wood (Aged Patina)', color: 0xB57E48, finish: 'matte' },
    { id: 'ivory_teak', name: 'Shekhawati Teak (Noble Light)', color: 0xE5B888, finish: 'lacquered' }
  ],
  turbans: [
    { id: 'safaa_saffron', name: 'Jodhpur Saffron Safaa', color: 0xF39C12, type: 'pagri' },
    { id: 'safaa_turmeric', name: 'Marwar Turmeric Gold', color: 0xE3A018, type: 'pagri' },
    { id: 'odhni_pink', name: 'Rani Pink Chunari (Gota Hem)', color: 0xC2185B, type: 'odhni' },
    { id: 'odhni_indigo', name: 'Deep Indigo Bandhani Veil', color: 0x2B3A8C, type: 'odhni' },
    { id: 'safaa_emerald', name: 'Mewar Emerald Festive Turban', color: 0x1B4B36, type: 'pagri' }
  ],
  tunics: [
    { id: 'angrakha_indigo', name: 'Royal Indigo Brocade', color: 0x2B3A8C },
    { id: 'angrakha_crimson', name: 'Madder Red Angrakha', color: 0x8E1B1B },
    { id: 'angrakha_emerald', name: 'Emerald Velvet Bodice', color: 0x15432B },
    { id: 'angrakha_ivory', name: 'Courtier Ivory Cotton', color: 0xFAF3E4 }
  ],
  skirts: [
    { id: 'ghaghra_rani', name: 'Rani Pink Tiered Skirt', color: 0xC2185B },
    { id: 'ghaghra_saffron', name: 'Turmeric Yellow Bandhani', color: 0xE3A018 },
    { id: 'ghaghra_indigo', name: 'Indigo Shisha Mirror Skirt', color: 0x2B3A8C },
    { id: 'ghaghra_white', name: 'White Pleated Courtier Robe', color: 0xFDF5E6 }
  ],
  moustaches: [
    { id: 'moust_rajput', name: 'Royal Curled Rajput', curve: 0.8 },
    { id: 'moust_court', name: 'Trimmed Noble Courtier', curve: 0.35 },
    { id: 'moust_none', name: 'Smooth (Heroine / Danseuse)', curve: 0 }
  ]
};
