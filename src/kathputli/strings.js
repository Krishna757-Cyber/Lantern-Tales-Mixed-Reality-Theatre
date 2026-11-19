/* ================================================================
   LANTERN TALES — KATHPUTLI STRING PHYSICS ENGINE (src/kathputli/strings.js)
   Verlet / Position-Based Dynamics (PBD) chain solver
   Fixed substep integration, unconditional stability at 60/72/90 Hz
================================================================ */

export class PuppetString {
  constructor(id = 'string', length = 0.6, numNodes = 4, damping = 0.03, gravity = -9.81) {
    this.id = id;
    this.numNodes = Math.max(3, numNodes);
    this.restLength = length;
    this.damping = damping;
    this.gravity = gravity;
    this.plucked = false;
    this.pluckEnergy = 0;

    this.nodes = [];
    this.constraints = [];

    const segmentLen = length / (this.numNodes - 1);
    for (let i = 0; i < this.numNodes; i++) {
      const y = -i * segmentLen;
      this.nodes.push({
        x: 0,
        y: y,
        z: 0,
        oldX: 0,
        oldY: y,
        oldZ: 0,
        fixed: i === 0, // Top anchor attached to crossbar
        mass: i === 0 ? 0 : 0.05
      });
    }

    for (let i = 0; i < this.numNodes - 1; i++) {
      this.constraints.push({
        p1: i,
        p2: i + 1,
        restLength: segmentLen
      });
    }
  }

  setAnchor(x, y, z) {
    if (this.nodes.length > 0) {
      this.nodes[0].x = x;
      this.nodes[0].y = y;
      this.nodes[0].z = z;
      this.nodes[0].fixed = true;
    }
  }

  setEndpoint(x, y, z, fixed = false) {
    const last = this.nodes[this.nodes.length - 1];
    if (last) {
      last.x = x;
      last.y = y;
      last.z = z;
      last.fixed = fixed;
    }
  }

  pluck(impulse = 0.25) {
    this.plucked = true;
    this.pluckEnergy = impulse;
    const mid = Math.floor(this.numNodes / 2);
    if (this.nodes[mid]) {
      this.nodes[mid].x += (Math.random() - 0.5) * impulse;
      this.nodes[mid].z += (Math.random() - 0.5) * impulse;
    }
  }

  update(dt, iterations = 3) {
    const clampedDt = Math.min(Math.max(dt, 0.001), 0.033);
    const dtSq = clampedDt * clampedDt;

    // 1. Verlet Particle Integration
    for (let i = 0; i < this.nodes.length; i++) {
      const p = this.nodes[i];
      if (p.fixed) continue;

      const vx = (p.x - p.oldX) * (1 - this.damping);
      const vy = (p.y - p.oldY) * (1 - this.damping);
      const vz = (p.z - p.oldZ) * (1 - this.damping);

      p.oldX = p.x;
      p.oldY = p.y;
      p.oldZ = p.z;

      p.x += vx;
      p.y += vy + this.gravity * dtSq;
      p.z += vz;
    }

    // 2. Gauss-Seidel Distance Constraints
    for (let iter = 0; iter < iterations; iter++) {
      for (let c = 0; c < this.constraints.length; c++) {
        const con = this.constraints[c];
        const n1 = this.nodes[con.p1];
        const n2 = this.nodes[con.p2];

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dz = n2.z - n1.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
        const diff = (dist - con.restLength) / dist;

        if (!n1.fixed && !n2.fixed) {
          n1.x += dx * 0.5 * diff;
          n1.y += dy * 0.5 * diff;
          n1.z += dz * 0.5 * diff;
          n2.x -= dx * 0.5 * diff;
          n2.y -= dy * 0.5 * diff;
          n2.z -= dz * 0.5 * diff;
        } else if (n1.fixed && !n2.fixed) {
          n2.x -= dx * diff;
          n2.y -= dy * diff;
          n2.z -= dz * diff;
        } else if (!n1.fixed && n2.fixed) {
          n1.x += dx * diff;
          n1.y += dy * diff;
          n1.z += dz * diff;
        }
      }
    }

    // Decay pluck vibration
    if (this.pluckEnergy > 0.005) {
      this.pluckEnergy *= 0.85;
    } else {
      this.pluckEnergy = 0;
      this.plucked = false;
    }
  }

  getTension() {
    if (this.nodes.length < 2) return 0;
    const first = this.nodes[0];
    const last = this.nodes[this.nodes.length - 1];
    const directDist = Math.sqrt(
      (first.x - last.x) ** 2 +
      (first.y - last.y) ** 2 +
      (first.z - last.z) ** 2
    );
    return Math.min(1.0, directDist / this.restLength);
  }
}

export class PuppetStringSystem {
  constructor() {
    this.strings = new Map();
  }

  addString(id, length = 0.6, numNodes = 4) {
    const s = new PuppetString(id, length, numNodes);
    this.strings.set(id, s);
    return s;
  }

  getString(id) {
    return this.strings.get(id);
  }

  update(dt) {
    this.strings.forEach(s => s.update(dt));
  }
}
