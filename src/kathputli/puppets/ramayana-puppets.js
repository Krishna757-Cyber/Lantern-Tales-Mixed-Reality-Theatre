/* ================================================================
   LANTERN TALES — RAMAYANA KATHPUTLI CHARACTER TROUPE
   (src/kathputli/puppets/ramayana-puppets.js)
   Original Rajasthani string-puppet characters in folk woodcarver style
   Large painted almond eyes, carved wooden faces, layered pleated skirts,
   visible strings, and authentic traditional Indian iconography.
================================================================ */

import { KathputliRig } from '../rig.js';

// Base extended rig for Ramayana characters with custom poses and accessories
export class RamayanaKathputli extends KathputliRig {
  constructor(config = {}) {
    super(config);
    this.characterId = config.characterId || 'ram';
    this.bowInHand = config.bowInHand || false;
    this.hasCrown = config.hasCrown || false;
    this.crownStyle = config.crownStyle || 'mukut'; // 'mukut', 'turban', 'ravan_10', 'sage', 'monkey'
    this.currentPose = 'idle';
    this.targetX = 0;
    this.targetY = 1.1;
    this.bowElevation = 0;
    this.auraGlow = 0;
  }

  setPose(poseName) {
    this.currentPose = poseName;
    switch (poseName) {
      case 'idle':
        this.position.y = 1.1;
        this.headTilt = 0;
        this.rotation.z = 0;
        this.skirtFlare = 0.2;
        this.isDancing = false;
        break;

      case 'walk':
        this.position.y = 1.1;
        this.headTilt = 0.05;
        this.rotation.z = Math.sin(Date.now() * 0.005) * 0.08;
        this.skirtAngularVelocity = Math.sin(Date.now() * 0.006) * 1.5;
        break;

      case 'bow':
        this.headTilt = 0.35;
        this.position.y = 1.02;
        this.rotation.x = 0.25;
        this.rotation.z = 0;
        break;

      case 'bless':
        this.headTilt = -0.15;
        this.position.y = 1.12;
        this.rotation.x = -0.1;
        this.auraGlow = 1.0;
        break;

      case 'aim-bow':
        this.headTilt = -0.1;
        this.rotation.y = 0.35;
        this.rotation.z = -0.1;
        this.bowElevation = 1.0;
        break;

      case 'fight':
        this.headTilt = 0.15;
        this.rotation.z = Math.sin(Date.now() * 0.01) * 0.2;
        this.position.y = 1.1 + Math.abs(Math.sin(Date.now() * 0.008)) * 0.06;
        this.skirtAngularVelocity = 3.0;
        break;

      case 'leap':
        this.headTilt = -0.25;
        this.position.y = 1.35;
        this.rotation.x = -0.3;
        this.rotation.z = -0.15;
        this.skirtFlare = 0.5;
        break;

      case 'mourn':
        this.headTilt = 0.45;
        this.position.y = 0.98;
        this.rotation.x = 0.35;
        this.rotation.z = 0.05;
        break;

      case 'celebrate':
        this.headTilt = -0.2;
        this.position.y = 1.15 + Math.sin(Date.now() * 0.008) * 0.04;
        this.rotation.z = Math.sin(Date.now() * 0.007) * 0.15;
        this.skirtAngularVelocity = 5.0;
        break;

      default:
        this.position.y = 1.1;
    }
  }

  // Enhanced visual mesh with cultural accessories (mukut, accessories, etc.)
  buildThreeMesh(THREE) {
    const group = super.buildThreeMesh(THREE);
    if (!THREE || !group) return group;

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700,
      metalness: 0.85,
      roughness: 0.25
    });

    const woodMat = new THREE.MeshStandardMaterial({
      color: this.colors.wood,
      roughness: 0.7
    });

    // 1. Royal Mukut / Crown
    if (this.hasCrown && this.headMesh) {
      if (this.crownStyle === 'mukut') {
        // Traditional tiered golden conical Hindu mukut
        const crownBaseGeo = new THREE.CylinderGeometry(0.042, 0.052, 0.06, 12);
        const crownPeakGeo = new THREE.ConeGeometry(0.038, 0.11, 10);
        const baseMesh = new THREE.Mesh(crownBaseGeo, goldMat);
        const peakMesh = new THREE.Mesh(crownPeakGeo, goldMat);
        baseMesh.position.y = 0.12;
        peakMesh.position.y = 0.19;
        this.headMesh.add(baseMesh);
        this.headMesh.add(peakMesh);
      } else if (this.crownStyle === 'ravan_10') {
        // Stylised 10-face tiered golden mukut
        const crownBase = new THREE.CylinderGeometry(0.055, 0.06, 0.08, 12);
        const baseMesh = new THREE.Mesh(crownBase, goldMat);
        baseMesh.position.y = 0.13;
        this.headMesh.add(baseMesh);

        // Tiered mini-faces arrayed on a golden crescent arch
        const archGeo = new THREE.TorusGeometry(0.12, 0.015, 8, 20, Math.PI);
        const archMesh = new THREE.Mesh(archGeo, goldMat);
        archMesh.position.set(0, 0.17, 0);
        archMesh.rotation.z = Math.PI;
        this.headMesh.add(archMesh);

        // 9 auxiliary crowned miniature heads (4 left, 1 center top, 4 right)
        for (let i = -4; i <= 4; i++) {
          if (i === 0) continue;
          const miniHead = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), woodMat);
          const angle = (i / 5) * (Math.PI * 0.45);
          miniHead.position.set(Math.sin(angle) * 0.12, 0.17 + Math.cos(angle) * 0.04, 0);
          this.headMesh.add(miniHead);
        }
      } else if (this.crownStyle === 'monkey') {
        // Golden ornate mukut for Hanuman
        const mukutGeo = new THREE.ConeGeometry(0.04, 0.09, 8);
        const mukut = new THREE.Mesh(mukutGeo, goldMat);
        mukut.position.y = 0.15;
        this.headMesh.add(mukut);

        // Stylised monkey muzzle & jaw
        const muzzleGeo = new THREE.SphereGeometry(0.03, 8, 8);
        const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xE87A38 });
        const muzzle = new THREE.Mesh(muzzleGeo, muzzleMat);
        muzzle.position.set(0, 0.045, 0.045);
        this.headMesh.add(muzzle);
      }
    }

    // 2. Bow & Quiver (Kodanda / Pinaka)
    if (this.bowInHand && this.leftArmMesh) {
      const bowCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -0.18, 0.08),
        new THREE.Vector3(0, 0.0, 0.14),
        new THREE.Vector3(0, 0.15, 0.14),
        new THREE.Vector3(0, 0.28, 0.08)
      );
      const bowGeo = new THREE.TubeGeometry(bowCurve, 16, 0.008, 6, false);
      const bowMesh = new THREE.Mesh(bowGeo, goldMat);
      bowMesh.position.set(0.01, -0.05, 0);
      this.leftArmMesh.add(bowMesh);
    }

    return group;
  }
}

// 1. SHRI RAM — Divine Maryada Purushottam
export class RamPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'ram',
      name: 'Shri Ram',
      type: 'hero',
      woodColor: 0x4A6B82,      // Shyam / Celestial Blue-toned wood
      tunicColor: 0x2A4E6E,     // Deep azure angrakha
      skirtColor: 0xF2B705,     // Pitambar (sacred saffron-yellow cloth)
      turbanColor: 0xFFD700,
      goldTrim: 0xFFE082,
      scale: config.scale || 1.12,
      hasCrown: true,
      crownStyle: 'mukut',
      bowInHand: true
    });
  }
}

// 2. MATA SITA — Embodiment of Virtue & Grace
export class SitaPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'sita',
      name: 'Mata Sita',
      type: 'dancer',
      woodColor: 0xD4A373,      // Fair sandalwood patina
      tunicColor: 0xB83232,     // Auspicious vermilion choli
      skirtColor: 0xC2185B,     // Rani pink & vermilion pleated ghaghra
      turbanColor: 0xE65100,    // Golden-red odhni veil
      goldTrim: 0xFFD700,
      scale: config.scale || 1.04,
      hasCrown: true,
      crownStyle: 'mukut',
      bowInHand: false
    });
  }
}

// 3. LAKSHMAN — Loyal Brother & Valiant Guardian
export class LakshmanPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'lakshman',
      name: 'Lakshman',
      type: 'hero',
      woodColor: 0xD4A373,      // Warm sandalwood
      tunicColor: 0xD97706,     // Ochre/amber warrior angrakha
      skirtColor: 0xFAF3E4,     // White & gold bordered warrior dhoti
      turbanColor: 0xF59E0B,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.10,
      hasCrown: true,
      crownStyle: 'mukut',
      bowInHand: true
    });
  }
}

// 4. HANUMAN — Supreme Devotee & Son of Wind
export class HanumanPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'hanuman',
      name: 'Pawanputra Hanuman',
      type: 'hero',
      woodColor: 0xD84315,      // Sacred vermilion-orange sindoor tone
      tunicColor: 0xBF360C,     // Deep saffron angrakha
      skirtColor: 0xF57C00,     // Saffron folded kachh skirt
      turbanColor: 0xFFD700,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.15,
      hasCrown: true,
      crownStyle: 'monkey',
      bowInHand: false
    });
  }

  buildThreeMesh(THREE) {
    const group = super.buildThreeMesh(THREE);
    if (!THREE || !group) return group;

    // Curled monkey tail behind
    const tailCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, -0.06),
      new THREE.Vector3(0, 0.15, -0.25),
      new THREE.Vector3(0, 0.42, -0.22),
      new THREE.Vector3(0, 0.55, -0.08)
    );
    const tailGeo = new THREE.TubeGeometry(tailCurve, 16, 0.015, 6, false);
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xD84315, roughness: 0.8 });
    const tailMesh = new THREE.Mesh(tailGeo, tailMat);
    group.add(tailMesh);

    // Gada (Mace) in right hand
    if (this.rightArmMesh) {
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.85, roughness: 0.3 });
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.28, 8), goldMat);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), goldMat);
      shaft.position.set(0, -0.08, 0.05);
      head.position.set(0, 0.08, 0.05);
      shaft.add(head);
      this.rightArmMesh.add(shaft);
    }

    return group;
  }
}

// 5. RAVAN — The 10-Headed King of Lanka
export class RavanPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'ravan',
      name: 'Lankeshwar Ravan',
      type: 'hero',
      woodColor: 0x8D5B36,      // Dark aged teak wood
      tunicColor: 0x4A0E17,     // Imperial burgundy angrakha
      skirtColor: 0x1A1024,     // Royal dark purple & gold skirt
      turbanColor: 0xFFD700,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.25,
      hasCrown: true,
      crownStyle: 'ravan_10',
      bowInHand: true
    });
  }
}

// 6. DASHARATH — King of Ayodhya
export class DasharathPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'dasharath',
      name: 'Maharaja Dasharath',
      type: 'hero',
      woodColor: 0xBF8F54,
      tunicColor: 0x8D2323,     // Imperial crimson
      skirtColor: 0xFAF3E4,     // White silk pleated royal robe
      turbanColor: 0xE3A018,    // Golden imperial safaa
      goldTrim: 0xFFD700,
      scale: config.scale || 1.15,
      hasCrown: true,
      crownStyle: 'mukut'
    });
  }
}

// 7. KAIKEYI — Queen of Ayodhya
export class KaikeyiPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'kaikeyi',
      name: 'Rani Kaikeyi',
      type: 'dancer',
      woodColor: 0xD4A373,
      tunicColor: 0x6A1B9A,     // Royal purple choli
      skirtColor: 0xAD1457,     // Magenta silk skirt
      turbanColor: 0x8E24AA,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.05,
      hasCrown: true,
      crownStyle: 'mukut'
    });
  }
}

// 8. MANTHARA — The Maid
export class MantharaPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'manthara',
      name: 'Manthara',
      type: 'dancer',
      woodColor: 0x9E7D56,
      tunicColor: 0x424242,     // Muted grey tunic
      skirtColor: 0x5D4037,     // Dark earth skirt
      turbanColor: 0x3E2723,
      goldTrim: 0x8D6E63,
      scale: config.scale || 0.95,
      hasCrown: false
    });
  }
}

// 9. BHARAT — Selfless Devotee & Regent
export class BharatPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'bharat',
      name: 'Bharat',
      type: 'hero',
      woodColor: 0xD4A373,
      tunicColor: 0xE65100,     // Ochre ascetic angrakha
      skirtColor: 0xFFF3E0,     // Humble hermit robe
      turbanColor: 0xF57C00,
      goldTrim: 0xCCCCCC,
      scale: config.scale || 1.08,
      hasCrown: false
    });
  }
}

// 10. SHURPANAKHA — Demoness
export class ShurpanakhaPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'shurpanakha',
      name: 'Shurpanakha',
      type: 'dancer',
      woodColor: 0x616161,
      tunicColor: 0x212121,     // Black & crimson
      skirtColor: 0x880E4F,
      turbanColor: 0x4A148C,
      goldTrim: 0xFF5722,
      scale: config.scale || 1.08,
      hasCrown: false
    });
  }
}

// 11. MARICHA — The Golden Deer (Reuses & enhances the quad rig in Ramayana hierarchy)
export class MarichaDeerPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'maricha',
      name: 'Maricha (Golden Deer)',
      type: 'horse',
      woodColor: 0xFFD700,      // Pure golden luster
      skirtColor: 0xFFB300,     // Amber spotted silk caparison
      scale: config.scale || 1.10
    });
  }

  buildThreeMesh(THREE) {
    const group = super.buildThreeMesh(THREE);
    if (!THREE || !group) return group;

    // Small golden antlers on head
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xFFE082, metalness: 0.8 });
    if (this.headMesh) {
      const antlerL = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.008, 0.10, 6), goldMat);
      antlerL.position.set(-0.03, 0.12, 0);
      antlerL.rotation.z = -0.4;
      const antlerR = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.008, 0.10, 6), goldMat);
      antlerR.position.set(0.03, 0.12, 0);
      antlerR.rotation.z = 0.4;
      this.headMesh.add(antlerL);
      this.headMesh.add(antlerR);
    }
    return group;
  }
}

// 12. JATAYU — The Divine Eagle King
export class JatayuPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'jatayu',
      name: 'Jatayu',
      type: 'hero',
      woodColor: 0x8D5B36,
      tunicColor: 0xD84315,
      skirtColor: 0xBF360C,
      turbanColor: 0xFFD700,
      scale: config.scale || 1.18,
      hasCrown: false
    });
  }

  buildThreeMesh(THREE) {
    const group = super.buildThreeMesh(THREE);
    if (!THREE || !group) return group;

    // Broad golden-feather wings
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xE65100, roughness: 0.7, side: THREE.DoubleSide });
    const wingGeo = new THREE.ConeGeometry(0.18, 0.45, 6);
    const wingL = new THREE.Mesh(wingGeo, wingMat);
    wingL.position.set(-0.25, 0.10, -0.05);
    wingL.rotation.z = 1.2;
    const wingR = new THREE.Mesh(wingGeo, wingMat);
    wingR.position.set(0.25, 0.10, -0.05);
    wingR.rotation.z = -1.2;
    group.add(wingL);
    group.add(wingR);

    // Beak
    if (this.headMesh) {
      const beakGeo = new THREE.ConeGeometry(0.018, 0.06, 6);
      const beakMat = new THREE.MeshStandardMaterial({ color: 0xFFB300 });
      const beak = new THREE.Mesh(beakGeo, beakMat);
      beak.position.set(0, 0.045, 0.06);
      beak.rotation.x = Math.PI / 2;
      this.headMesh.add(beak);
    }
    return group;
  }
}

// 13. SUGRIV — Vanar King of Kishkindha
export class SugrivPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'sugriv',
      name: 'Sugriv',
      type: 'hero',
      woodColor: 0xC16E28,
      tunicColor: 0xF57C00,
      skirtColor: 0xFFB300,
      turbanColor: 0xFFD700,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.12,
      hasCrown: true,
      crownStyle: 'monkey'
    });
  }
}

// 14. BALI — Mighty King of Kishkindha
export class BaliPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'bali',
      name: 'Bali',
      type: 'hero',
      woodColor: 0x8D5B36,
      tunicColor: 0xB71C1C,
      skirtColor: 0xD84315,
      turbanColor: 0xFFD700,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.20,
      hasCrown: true,
      crownStyle: 'monkey'
    });
  }
}

// 15. SHABARI — Devoted Ascetic
export class ShabariPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'shabari',
      name: 'Mata Shabari',
      type: 'dancer',
      woodColor: 0x8D6E63,
      tunicColor: 0x5D4037,
      skirtColor: 0xD7CCC8,
      turbanColor: 0x8D6E63,
      goldTrim: 0xA1887F,
      scale: config.scale || 0.95,
      hasCrown: false
    });
  }
}

// 16. JAMBAVAN — Wise Bear Elder
export class JambavanPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'jambavan',
      name: 'Riksharaj Jambavan',
      type: 'hero',
      woodColor: 0x3E2723,      // Dark bear coat
      tunicColor: 0x4E342E,
      skirtColor: 0x616161,
      turbanColor: 0xFFD700,
      scale: config.scale || 1.22,
      hasCrown: true,
      crownStyle: 'mukut'
    });
  }
}

// 17. VIBHISHAN — Righteous King of Lanka
export class VibhishanPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'vibhishan',
      name: 'Vibhishan',
      type: 'hero',
      woodColor: 0xD4A373,
      tunicColor: 0xFAF3E4,     // Pure white & gold
      skirtColor: 0xF5F5F5,
      turbanColor: 0xFFD700,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.10,
      hasCrown: true,
      crownStyle: 'mukut'
    });
  }
}

// 18. KUMBHKARNA — Giant Brother of Ravan
export class KumbhkarnaPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'kumbhkarna',
      name: 'Kumbhkarna',
      type: 'hero',
      woodColor: 0x5D4037,
      tunicColor: 0x263238,
      skirtColor: 0x37474F,
      turbanColor: 0xFFB300,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.35,
      hasCrown: true,
      crownStyle: 'mukut'
    });
  }
}

// 19. MEGHNAD — Indrajit, Crown Prince of Lanka
export class MeghnadPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'meghnad',
      name: 'Meghnad (Indrajit)',
      type: 'hero',
      woodColor: 0x616161,
      tunicColor: 0x311B92,     // Deep cosmic indigo
      skirtColor: 0x212121,
      turbanColor: 0xC0C0C0,
      goldTrim: 0xFFD700,
      scale: config.scale || 1.18,
      hasCrown: true,
      crownStyle: 'mukut',
      bowInHand: true
    });
  }
}

// 20. SUTRADHAR — Traditional Rajasthani Master Puppeteer & Narrator
export class SutradharPuppet extends RamayanaKathputli {
  constructor(config = {}) {
    super({
      characterId: 'sutradhar',
      name: 'Sutradhar (Bhatji)',
      type: 'hero',
      woodColor: 0xD29B63,      // Traditional Rohida desert wood
      tunicColor: 0xFAF3E4,     // Classic Rajasthani white cotton angrakha
      skirtColor: 0xE53935,     // Marwari red pleated dhoti
      turbanColor: 0xE53935,    // Red safaa turban with gota lace
      goldTrim: 0xFFD700,
      scale: config.scale || 1.05,
      hasCrown: false
    });
  }
}

// Character Registry & Factory
export const RAMAYANA_PUPPET_CLASSES = {
  ram: RamPuppet,
  sita: SitaPuppet,
  lakshman: LakshmanPuppet,
  hanuman: HanumanPuppet,
  ravan: RavanPuppet,
  dasharath: DasharathPuppet,
  kaikeyi: KaikeyiPuppet,
  manthara: MantharaPuppet,
  bharat: BharatPuppet,
  shurpanakha: ShurpanakhaPuppet,
  maricha: MarichaDeerPuppet,
  jatayu: JatayuPuppet,
  sugriv: SugrivPuppet,
  bali: BaliPuppet,
  shabari: ShabariPuppet,
  jambavan: JambavanPuppet,
  vibhishan: VibhishanPuppet,
  kumbhkarna: KumbhkarnaPuppet,
  meghnad: MeghnadPuppet,
  sutradhar: SutradharPuppet
};

export function createRamayanaPuppet(characterId, config = {}) {
  const Cls = RAMAYANA_PUPPET_CLASSES[characterId] || RamPuppet;
  return new Cls(config);
}
