/* ================================================================
   LANTERN TALES — KATHPUTLI RIG & PUPPET ANATOMY (src/kathputli/rig.js)
   Traditional wooden doll with cotton torso, jointed arms, and flared cloth skirt
   Anchors to Verlet string solver (Head, Left Hand, Right Hand, Waist)
================================================================ */

import { PuppetStringSystem } from './strings.js';

export class KathputliRig {
  constructor(config = {}) {
    this.name = config.name || 'Anarkali';
    this.type = config.type || 'dancer';
    this.scale = config.scale || 1.0;

    // Palette: traditional Rajasthani textile colors
    this.colors = {
      wood: config.woodColor || 0xD29B63,        // Rohida / mango wood
      skirt: config.skirtColor || 0xC2185B,      // Rani pink default
      turban: config.turbanColor || 0xE3A018,    // Turmeric gold
      tunic: config.tunicColor || 0x2B3A8C,      // Indigo blue
      goldTrim: 0xFFD700,                        // Gota lace
      string: 0x222222                           // Dark cotton cord
    };

    // State
    this.position = { x: 0, y: 1.1, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.skirtFlare = 0.2;
    this.skirtAngle = 0;
    this.skirtAngularVelocity = 0;
    this.headTilt = 0;
    this.bowProgress = 0;
    this.nodProgress = 0;
    this.isDancing = false;
    this.dancePhase = 0;

    // String physics system
    this.stringSystem = new PuppetStringSystem();
    this.headString = this.stringSystem.addString('head', 0.55, 4);
    this.leftHandString = this.stringSystem.addString('leftHand', 0.62, 4);
    this.rightHandString = this.stringSystem.addString('rightHand', 0.62, 4);
    this.waistString = this.stringSystem.addString('waist', 0.70, 4);

    // Crossbar anchor in space (driven by hand/pinch)
    this.crossbar = {
      x: 0,
      y: 1.65,
      z: 0,
      roll: 0,
      pitch: 0,
      yaw: 0,
      width: 0.28
    };

    // Three.js container
    this.group = null;
    this.headMesh = null;
    this.skirtMesh = null;
    this.leftArmMesh = null;
    this.rightArmMesh = null;
    this.stringLineMeshes = [];
  }

  buildThreeMesh(THREE) {
    if (!THREE) return null;
    const g = new THREE.Group();
    g.scale.set(this.scale, this.scale, this.scale);

    const woodMat = new THREE.MeshStandardMaterial({
      color: this.colors.wood,
      roughness: 0.65,
      metalness: 0.1
    });

    const skirtMat = new THREE.MeshStandardMaterial({
      color: this.colors.skirt,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: this.colors.goldTrim,
      roughness: 0.35,
      metalness: 0.8
    });

    const tunicMat = new THREE.MeshStandardMaterial({
      color: this.colors.tunic,
      roughness: 0.75
    });

    // 1. Carved Wood Head
    const headGroup = new THREE.Group();
    const headGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.11, 12);
    const headMesh = new THREE.Mesh(headGeo, woodMat);
    headMesh.position.y = 0.055;
    headGroup.add(headMesh);

    // Stylized Turban / Headpiece (Pagri / Odhni)
    const turbanGeo = new THREE.TorusGeometry(0.052, 0.022, 8, 16);
    const turbanMesh = new THREE.Mesh(turbanGeo, new THREE.MeshStandardMaterial({ color: this.colors.turban }));
    turbanMesh.rotation.x = Math.PI / 2;
    turbanMesh.position.y = 0.10;
    headGroup.add(turbanMesh);

    // Nose & Eyes
    const noseGeo = new THREE.ConeGeometry(0.012, 0.035, 6);
    const noseMesh = new THREE.Mesh(noseGeo, woodMat);
    noseMesh.position.set(0, 0.055, 0.048);
    noseMesh.rotation.x = Math.PI / 2;
    headGroup.add(noseMesh);

    headGroup.position.set(0, 0.18, 0);
    g.add(headGroup);
    this.headMesh = headGroup;

    // 2. Cotton Stuffed Torso (Angrakha)
    const torsoGeo = new THREE.CylinderGeometry(0.05, 0.065, 0.14, 10);
    const torsoMesh = new THREE.Mesh(torsoGeo, tunicMat);
    torsoMesh.position.y = 0.06;
    g.add(torsoMesh);

    // 3. Flared Flowing Skirt (Ghaghra - no legs)
    const skirtGeo = new THREE.ConeGeometry(0.24, 0.42, 18, 1, true);
    const skirtMesh = new THREE.Mesh(skirtGeo, skirtMat);
    skirtMesh.position.y = -0.21;
    // Gold Gota border at hem
    const hemRing = new THREE.TorusGeometry(0.238, 0.008, 6, 24);
    const hemMesh = new THREE.Mesh(hemRing, goldMat);
    hemMesh.position.y = -0.21;
    hemMesh.rotation.x = Math.PI / 2;
    skirtMesh.add(hemMesh);
    g.add(skirtMesh);
    this.skirtMesh = skirtMesh;

    // 4. Jointed Cloth/Wood Arms
    const leftArmGroup = new THREE.Group();
    const rightArmGroup = new THREE.Group();

    const armGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8);
    const handGeo = new THREE.BoxGeometry(0.025, 0.04, 0.01);

    const leftArm = new THREE.Mesh(armGeo, tunicMat);
    leftArm.position.y = -0.07;
    const leftHand = new THREE.Mesh(handGeo, woodMat);
    leftHand.position.y = -0.15;
    leftArmGroup.add(leftArm);
    leftArmGroup.add(leftHand);
    leftArmGroup.position.set(-0.075, 0.11, 0);
    leftArmGroup.rotation.z = 0.25;
    g.add(leftArmGroup);
    this.leftArmMesh = leftArmGroup;

    const rightArm = new THREE.Mesh(armGeo, tunicMat);
    rightArm.position.y = -0.07;
    const rightHand = new THREE.Mesh(handGeo, woodMat);
    rightHand.position.y = -0.15;
    rightArmGroup.add(rightArm);
    rightArmGroup.add(rightHand);
    rightArmGroup.position.set(0.075, 0.11, 0);
    rightArmGroup.rotation.z = -0.25;
    g.add(rightArmGroup);
    this.rightArmMesh = rightArmGroup;

    // 5. String Line Visualizers
    const stringMat = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.65 });
    for (let s = 0; s < 4; s++) {
      const lineGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(4 * 3); // 4 nodes per string
      lineGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const lineMesh = new THREE.Line(lineGeo, stringMat);
      lineMesh.frustumCulled = false;
      g.add(lineMesh);
      this.stringLineMeshes.push(lineMesh);
    }

    this.group = g;
    return g;
  }

  setCrossbar(x, y, z, roll = 0, pitch = 0, yaw = 0) {
    this.crossbar.x = x;
    this.crossbar.y = y;
    this.crossbar.z = z;
    this.crossbar.roll = roll;
    this.crossbar.pitch = pitch;
    this.crossbar.yaw = yaw;

    // Distribute string anchor points across crossbar
    const halfW = this.crossbar.width / 2;
    const cosR = Math.cos(roll);
    const sinR = Math.sin(roll);

    // Head center anchor
    this.headString.setAnchor(x, y, z);
    // Left hand anchor
    this.leftHandString.setAnchor(x - halfW * cosR, y - halfW * sinR, z);
    // Right hand anchor
    this.rightHandString.setAnchor(x + halfW * cosR, y + halfW * sinR, z);
    // Waist rear anchor
    this.waistString.setAnchor(x, y, z - 0.05);
  }

  pluckString(stringKey) {
    const s = this.stringSystem.getString(stringKey);
    if (s) s.pluck(0.35);
    if (stringKey === 'head') {
      this.nodProgress = 1.0;
    }
  }

  danceStep(speed = 1.0) {
    this.isDancing = true;
    this.dancePhase += 0.25 * speed;
    this.skirtAngularVelocity += (Math.sin(this.dancePhase * 3) > 0 ? 0.35 : -0.35) * speed;
  }

  update(dt) {
    // 1. Solve string physics
    this.stringSystem.update(dt);

    // 2. Drive puppet body from head string endpoint and crossbar height
    const headNode = this.headString.nodes[this.headString.numNodes - 1];
    if (headNode) {
      // Smooth body translation following the head string
      this.position.x += (headNode.x - this.position.x) * 0.18;
      this.position.y += (headNode.y - 0.24 - this.position.y) * 0.25;
      this.position.z += (headNode.z - this.position.z) * 0.18;
    }

    // 3. Compute head tilt & bow
    if (this.nodProgress > 0.01) {
      this.nodProgress *= 0.88;
    } else {
      this.nodProgress = 0;
    }

    const roll = this.crossbar.roll;
    this.headTilt = roll * 0.65 + this.nodProgress * 0.45;

    // 4. Skirt angular dynamics (cloth inertia & spin)
    this.skirtAngle += this.skirtAngularVelocity * dt;
    this.skirtAngularVelocity *= 0.94; // damping
    this.skirtAngle *= 0.98;

    // 5. Update Three.js Scene objects
    if (this.group) {
      this.group.position.set(this.position.x, this.position.y, this.position.z);
      this.group.rotation.y = this.crossbar.yaw + this.skirtAngle * 0.5;
      this.group.rotation.z = roll * 0.4;
      this.group.rotation.x = this.crossbar.pitch * 0.5;

      if (this.headMesh) {
        this.headMesh.rotation.z = this.headTilt;
        this.headMesh.rotation.x = this.nodProgress * 0.4;
      }

      if (this.skirtMesh) {
        this.skirtMesh.rotation.y = this.skirtAngle;
        const flare = 1.0 + Math.min(0.5, Math.abs(this.skirtAngularVelocity) * 0.12);
        this.skirtMesh.scale.set(flare, 1.0, flare);
      }

      // Update arm angles from wrist string positions
      const lh = this.leftHandString.nodes[this.leftHandString.numNodes - 1];
      const rh = this.rightHandString.nodes[this.rightHandString.numNodes - 1];
      if (lh && this.leftArmMesh) {
        this.leftArmMesh.rotation.z = 0.25 + (lh.y - this.position.y) * 1.5;
      }
      if (rh && this.rightArmMesh) {
        this.rightArmMesh.rotation.z = -0.25 - (rh.y - this.position.y) * 1.5;
      }

      // Update rendered lines for each string
      const stringKeys = ['head', 'leftHand', 'rightHand', 'waist'];
      for (let i = 0; i < stringKeys.length; i++) {
        const s = this.stringSystem.getString(stringKeys[i]);
        const line = this.stringLineMeshes[i];
        if (s && line) {
          const posAttr = line.geometry.attributes.position;
          for (let n = 0; n < s.nodes.length; n++) {
            // Convert world node coordinates to group-relative
            posAttr.setXYZ(
              n,
              s.nodes[n].x - this.position.x,
              s.nodes[n].y - this.position.y,
              s.nodes[n].z - this.position.z
            );
          }
          posAttr.needsUpdate = true;
        }
      }
    }
  }
}
