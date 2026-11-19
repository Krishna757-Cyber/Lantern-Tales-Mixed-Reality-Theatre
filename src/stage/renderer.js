/* ================================================================
   LANTERN TALES — STAGE RENDERER (src/stage/renderer.js)
   Royal Rajasthani Haveli Shadow Theatre Simulation Engine
   Features:
   - Handcrafted Mehrab proscenium arch with gold jali filigree
   - Floating ember fireflies and volumetric god-rays
   - Dynamic water splash droplet particles and ripple rings
   - Distinctive paper-cut folk shadow puppets for ALL 8 Hand Poses
   - 60-90 FPS optimized Canvas 2D rendering pipeline
================================================================ */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;

// Particle systems
const embers = [];
const splashDroplets = [];
const waterRipples = [];

export const Stage = {
  lanternLit: true,
  lanternX: 0.22,
  lanternY: 0.18,
  lanternFlicker: 1,
  water: 0.18,
  targetWater: 0.18,
  sun: 0,
  targetSun: 0,
  shelf: 0,
  pebbles: [],
  crow: {
    x: 1.15,
    y: 0.38,
    vx: 0,
    vy: 0,
    flying: false,
    flightTimer: 0
  },
  waterWaves: 0,
  ambientMode: 'gold', // 'gold' | 'moon' | 'saffron'
  prosceniumEnabled: true
};

// Initialize ambient firefly particles
function initEmbers() {
  embers.length = 0;
  for (let i = 0; i < 35; i++) {
    embers.push({
      x: 0.1 + Math.random() * 0.8,
      y: 0.1 + Math.random() * 0.7,
      size: 1.2 + Math.random() * 2.4,
      speedX: (Math.random() - 0.5) * 0.015,
      speedY: -0.01 - Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.6
    });
  }
}

export function initStage() {
  Stage.pebbles = [];
  Stage.lanternLit = true;
  Stage.crow.x = 1.15;
  Stage.crow.flying = false;
  splashDroplets.length = 0;
  waterRipples.length = 0;
  initEmbers();
}

export function dropPebble() {
  const px = 0.48 + (Math.random() - 0.5) * 0.06;
  Stage.pebbles.push({
    x: px,
    y: 0.26,
    vy: 0.008,
    size: 14 + Math.random() * 6
  });
  Stage.targetWater = clamp(Stage.targetWater + 0.048, 0.18, 0.68);

  // Trigger water splash droplets
  for (let i = 0; i < 8; i++) {
    splashDroplets.push({
      x: px,
      y: 0.88 - Stage.water * 0.4,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -0.04 - Math.random() * 0.06,
      size: 2.5 + Math.random() * 3,
      life: 1.0
    });
  }

  // Water ripple ring
  waterRipples.push({
    x: px,
    y: 0.88 - Stage.water * 0.4,
    radius: 4,
    opacity: 0.8
  });
}

export function flyCrow() {
  Stage.crow.flying = true;
  Stage.crow.x = 0.42;
  Stage.crow.y = 0.45;
  Stage.crow.flightTimer = 0;
}

export function updateStage(dt, now) {
  // Water animation
  Stage.water = lerp(Stage.water, Stage.targetWater, dt * 2.8);
  Stage.waterWaves += dt * 3.5;

  // Pebble physics
  for (let i = Stage.pebbles.length - 1; i >= 0; i--) {
    const p = Stage.pebbles[i];
    p.vy += dt * 0.016; // gravity
    p.y += p.vy;
    const waterFloor = 0.88 - Stage.water * 0.4;
    if (p.y > waterFloor) {
      p.y = waterFloor;
      p.vy = 0;
    }
  }

  // Splash droplets physics
  for (let i = splashDroplets.length - 1; i >= 0; i--) {
    const d = splashDroplets[i];
    d.x += d.vx * dt * 60;
    d.y += d.vy * dt * 60;
    d.vy += dt * 0.14; // droplet gravity
    d.life -= dt * 2.2;
    if (d.life <= 0) splashDroplets.splice(i, 1);
  }

  // Water ripples
  for (let i = waterRipples.length - 1; i >= 0; i--) {
    const r = waterRipples[i];
    r.radius += dt * 45;
    r.opacity -= dt * 1.2;
    if (r.opacity <= 0) waterRipples.splice(i, 1);
  }

  // Embers / Fireflies
  for (let i = 0; i < embers.length; i++) {
    const e = embers[i];
    e.x += e.speedX * dt * 60;
    e.y += e.speedY * dt * 60;
    e.phase += dt * 2.0;
    if (e.y < 0.05) {
      e.y = 0.85;
      e.x = 0.1 + Math.random() * 0.8;
    }
  }

  // Crow flight
  if (Stage.crow.flying) {
    Stage.crow.flightTimer += dt;
    Stage.crow.x = lerp(0.42, -0.3, clamp(Stage.crow.flightTimer / 3.0, 0, 1));
    Stage.crow.y = 0.45 - Math.sin(Stage.crow.flightTimer * 2.8) * 0.18;
    if (Stage.crow.flightTimer > 3.2) {
      Stage.crow.flying = false;
      Stage.crow.x = 1.15;
    }
  }

  // Lantern natural organic flicker
  Stage.lanternFlicker = 0.94 + Math.sin(now * 0.012) * 0.06 + Math.sin(now * 0.035) * 0.03;
}

export function drawStage(ctx, width, height, now, handA, handB = null, options = {}) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // 1. Ancient Parchment Base
  ctx.fillStyle = '#0B0A12';
  ctx.fillRect(0, 0, width, height);

  // 2. Projected Volumetric Lantern Glow
  const lx = width * (Stage.lanternX + Math.sin(now * 0.001) * 0.02);
  const ly = height * Stage.lanternY;
  const radius = Math.max(width, height) * 0.95 * Stage.lanternFlicker;

  const radial = ctx.createRadialGradient(lx, ly, 15, lx, ly, radius);
  if (Stage.ambientMode === 'moon') {
    radial.addColorStop(0, 'rgba(180, 210, 255, 0.45)');
    radial.addColorStop(0.35, 'rgba(80, 120, 200, 0.25)');
    radial.addColorStop(0.7, 'rgba(15, 20, 45, 0.65)');
    radial.addColorStop(1, 'rgba(7, 8, 18, 0.98)');
  } else if (Stage.ambientMode === 'saffron') {
    radial.addColorStop(0, 'rgba(255, 170, 70, 0.52)');
    radial.addColorStop(0.35, 'rgba(230, 90, 40, 0.28)');
    radial.addColorStop(0.7, 'rgba(60, 15, 10, 0.65)');
    radial.addColorStop(1, 'rgba(12, 8, 12, 0.98)');
  } else {
    // Royal Haveli Amber Gold
    radial.addColorStop(0, 'rgba(255, 195, 90, 0.48)');
    radial.addColorStop(0.35, 'rgba(235, 145, 55, 0.26)');
    radial.addColorStop(0.7, 'rgba(55, 25, 12, 0.55)');
    radial.addColorStop(1, 'rgba(11, 10, 16, 0.98)');
  }

  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // 2.5 Light God-Rays Streaming Downward from Lantern
  drawLanternGodRays(ctx, lx, ly, width, height, now);

  // 3. Physical Room Corner Seam (if enabled)
  if (options.cornerPreview) {
    const cx = width * 0.52;
    ctx.strokeStyle = 'rgba(255, 179, 71, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255, 179, 71, 0.6)';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('◄ WALL A | REAL 90° CORNER | WALL B ►', cx - 120, 26);
  }

  // 4. Floating Firefly Embers
  drawEmbers(ctx, width, height, now);

  // 5. Pitcher & Rising Water with Droplets and Ripples
  drawPitcherAndWater(ctx, width, height);

  // 6. Shadow Puppet for Player Hand (Pose 1-8)
  if (handA && handA.present) {
    drawShadowPuppet(ctx, width * handA.x, height * handA.y, handA.pose || 1, false, now, width, height);
  }

  // 7. Shadow Puppet for Companion / Guest Hand
  if (handB && handB.present) {
    drawShadowPuppet(ctx, width * handB.x, height * handB.y, handB.pose || 1, true, now, width, height);
  }

  // 8. Flying Crow (Detached paper puppet)
  if (Stage.crow.flying) {
    drawFlyingCrow(ctx, width * Stage.crow.x, height * Stage.crow.y, now);
  }

  // 9. Overhead Brass Hanging Lantern Prop
  drawLanternProp(ctx, lx, ly);

  // 10. Handcrafted Rajasthani Haveli Proscenium Arch
  if (Stage.prosceniumEnabled) {
    drawHaveliProscenium(ctx, width, height);
  }

  ctx.restore();
}

// ----------------------------------------------------
// LIGHT GOD RAYS & VOLUMETRIC STREAMING
// ----------------------------------------------------
function drawLanternGodRays(ctx, lx, ly, width, height, now) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = -3; i <= 3; i++) {
    const angle = 0.28 * i + Math.sin(now * 0.0008 + i) * 0.05;
    const rayGrad = ctx.createLinearGradient(lx, ly, lx + Math.sin(angle) * width * 0.8, ly + Math.cos(angle) * height);
    rayGrad.addColorStop(0, 'rgba(255, 210, 120, 0.12)');
    rayGrad.addColorStop(0.5, 'rgba(255, 180, 70, 0.04)');
    rayGrad.addColorStop(1, 'rgba(255, 180, 70, 0.0)');

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + Math.sin(angle - 0.12) * width, height);
    ctx.lineTo(lx + Math.sin(angle + 0.12) * width, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// ----------------------------------------------------
// FLOATING EMBER FIREFLIES
// ----------------------------------------------------
function drawEmbers(ctx, width, height, now) {
  ctx.save();
  for (let i = 0; i < embers.length; i++) {
    const e = embers[i];
    const ex = width * e.x + Math.sin(e.phase + now * 0.002) * 12;
    const ey = height * e.y;
    const op = (e.opacity + Math.sin(e.phase * 2) * 0.25) * Stage.lanternFlicker;

    ctx.fillStyle = `rgba(255, 210, 110, ${clamp(op, 0.1, 0.85)})`;
    ctx.shadowColor = '#FFAA33';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(ex, ey, e.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ----------------------------------------------------
// 8 CANONICAL SHADOW PUPPET FORMS
// ----------------------------------------------------
function drawShadowPuppet(ctx, x, y, pose, isGuest = false, now = 0, stageW = 800, stageH = 500) {
  ctx.save();
  ctx.fillStyle = isGuest ? 'rgba(18, 22, 45, 0.94)' : 'rgba(10, 9, 14, 0.96)';
  ctx.shadowColor = isGuest ? 'rgba(40, 60, 120, 0.8)' : 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 22;

  switch (pose) {
    case 1: {
      // 🫲 KINDLE: Open Palm with radiant flame heart & rising sparks
      ctx.beginPath();
      ctx.ellipse(x, y, 42, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let f = 0; f < 5; f++) {
        const angle = -0.9 + f * 0.45;
        ctx.save();
        ctx.translate(x, y - 35);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, -30, 9, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Fire Flame Heart
      const flameH = 28 + Math.sin(now * 0.02) * 6;
      ctx.fillStyle = '#FFAA33';
      ctx.shadowColor = '#FF8800';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.moveTo(x, y - 10 - flameH);
      ctx.bezierCurveTo(x + 14, y - 12, x + 16, y + 10, x, y + 16);
      ctx.bezierCurveTo(x - 16, y + 10, x - 14, y - 12, x, y - 10 - flameH);
      ctx.fill();
      break;
    }

    case 2: {
      // ◑ BEAK: Ornate Paper-Cut Crow Head with animated clicking beak
      const pinch = Math.sin(now * 0.015) * 5;
      // Head
      ctx.beginPath();
      ctx.ellipse(x, y, 44, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Upper Beak
      ctx.beginPath();
      ctx.moveTo(x + 30, y - 12);
      ctx.lineTo(x + 92, y - 4 + pinch);
      ctx.lineTo(x + 30, y);
      ctx.closePath();
      ctx.fill();

      // Lower Beak
      ctx.beginPath();
      ctx.moveTo(x + 30, y + 2);
      ctx.lineTo(x + 88, y + 4 - pinch);
      ctx.lineTo(x + 30, y + 14);
      ctx.closePath();
      ctx.fill();

      // Feather Crest
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(x - 30 - i * 6, y - 18 + i * 8, 14, 6, -0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Perforated Eye
      ctx.fillStyle = '#FFF2D6';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(x + 12, y - 8, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0B0A10';
      ctx.beginPath();
      ctx.arc(x + 13, y - 8, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 3: {
      // ✊ PEBBLE: Clenched Fist with engraved sacred rune stone
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x - 38, y - 32, 76, 64, 20) : ctx.rect(x - 38, y - 32, 76, 64);
      ctx.fill();

      // Engraved rune stone held in palm
      ctx.fillStyle = '#C8903C';
      ctx.shadowColor = '#E3A018';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();

      // Sacred stone symbol (Trishul / Sun dot)
      ctx.strokeStyle = '#0B0A10';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 4: {
      // 👉 GUIDE: Pointing Hand with cosmic laser beam cutting through shadows
      // Palm & folded fingers
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x - 36, y - 24, 52, 48, 14) : ctx.rect(x - 36, y - 24, 52, 48);
      ctx.fill();

      // Pointing Index Finger
      ctx.beginPath();
      ctx.ellipse(x + 40, y - 14, 34, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Guide Ray Beam
      const rayGrad = ctx.createLinearGradient(x + 75, y - 14, stageW, y - 14);
      rayGrad.addColorStop(0, 'rgba(255, 215, 100, 0.95)');
      rayGrad.addColorStop(0.3, 'rgba(255, 180, 50, 0.6)');
      rayGrad.addColorStop(1, 'rgba(255, 180, 50, 0.0)');

      ctx.strokeStyle = rayGrad;
      ctx.lineWidth = 4 + Math.sin(now * 0.02) * 1.5;
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(x + 75, y - 14);
      ctx.lineTo(stageW, y - 14);
      ctx.stroke();

      // Target Reticle at end
      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.arc(x + 75, y - 14, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 5: {
      // 🪽 WINGS: Dual Flapping Crow Wings with articulated plumage
      ctx.beginPath();
      ctx.ellipse(x, y + 10, 24, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      const flap = Math.sin(now * 0.016) * 0.45;
      [-1, 1].forEach(side => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(side * (0.85 + flap));
        ctx.beginPath();
        ctx.ellipse(side * 60, 0, 65, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Primary feather cuts
        for (let f = 1; f <= 3; f++) {
          ctx.beginPath();
          ctx.ellipse(side * (70 + f * 12), -f * 3, 16, 7, side * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      break;
    }

    case 6: {
      // ☀️ SUNRISE: Surya Dev crest with rotating golden sunbeams
      ctx.beginPath();
      ctx.ellipse(x, y + 15, 48, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rising Sun Core
      ctx.fillStyle = '#FFAA22';
      ctx.shadowColor = '#FF7700';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(x, y - 15, 32, Math.PI, 0, false);
      ctx.fill();

      // 12 Sunbeams (Surya Kiran)
      ctx.strokeStyle = '#FFBB33';
      ctx.lineWidth = 3;
      const rot = now * 0.001;
      for (let i = 0; i < 12; i++) {
        const ang = rot + (i / 12) * Math.PI * 2;
        const r1 = 36;
        const r2 = 52 + (i % 2 === 0 ? 14 : 0);
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(ang) * r1, y - 15 + Math.sin(ang) * r1);
        ctx.lineTo(x + Math.cos(ang) * r2, y - 15 + Math.sin(ang) * r2);
        ctx.stroke();
      }
      break;
    }

    case 7: {
      // 🤝 MEET / DUET: Two mirrored ornate shadow hands joining palms
      // Player Hand (Left)
      ctx.save();
      ctx.translate(x - 25, y);
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 42, -0.2, 0, Math.PI * 2);
      ctx.fill();
      for (let f = 0; f < 4; f++) {
        ctx.beginPath();
        ctx.ellipse(18 + f * 5, -24 + f * 6, 8, 26, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Companion Hand (Right)
      ctx.save();
      ctx.translate(x + 25, y);
      ctx.beginPath();
      ctx.ellipse(0, 0, 36, 42, 0.2, 0, Math.PI * 2);
      ctx.fill();
      for (let f = 0; f < 4; f++) {
        ctx.beginPath();
        ctx.ellipse(-18 - f * 5, -24 + f * 6, 8, 26, -0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Cosmic Touch Spark / Fusion at center
      const sparkGlow = 14 + Math.sin(now * 0.02) * 6;
      ctx.fillStyle = '#FFE082';
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(x, y - 15, sparkGlow, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 8: {
      // 🏮 BLOOM: Grand Rajasthani Lotus Mandala Finale
      ctx.save();
      ctx.translate(x, y);

      // Lotus stem & base
      ctx.fillStyle = '#0B0A12';
      ctx.beginPath();
      ctx.ellipse(0, 25, 34, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Lotus Petals (16 Petals in 2 concentric tiers)
      const rotM = now * 0.0008;
      // Outer Tier
      for (let i = 0; i < 8; i++) {
        const ang = rotM + (i / 8) * Math.PI * 2;
        ctx.save();
        ctx.rotate(ang);
        ctx.fillStyle = '#C8903C';
        ctx.shadowColor = '#E3A018';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.ellipse(0, -42, 14, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Inner Tier (Gold Core)
      for (let i = 0; i < 8; i++) {
        const ang = -rotM + ((i + 0.5) / 8) * Math.PI * 2;
        ctx.save();
        ctx.rotate(ang);
        ctx.fillStyle = '#FFE082';
        ctx.shadowColor = '#FFAA00';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(0, -26, 10, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Center Seed Pod (Karnika)
      ctx.fillStyle = '#FFF8E7';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    default:
      ctx.beginPath();
      ctx.ellipse(x, y, 40, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}

// ----------------------------------------------------
// FLYING PAPER CROW (ACT 1 FABLE PROP)
// ----------------------------------------------------
function drawFlyingCrow(ctx, x, y, now) {
  ctx.save();
  ctx.fillStyle = '#0B0A10';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 24;

  const flap = Math.sin(now * 0.018) * 0.55;
  ctx.translate(x, y);

  // Crow Body
  ctx.beginPath();
  ctx.ellipse(0, 0, 36, 20, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.beginPath();
  ctx.moveTo(32, -6);
  ctx.lineTo(66, 0);
  ctx.lineTo(32, 6);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#F4E8D0';
  ctx.beginPath();
  ctx.arc(22, -4, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Flapping Wings
  ctx.fillStyle = '#0B0A10';
  ctx.save();
  ctx.rotate(-flap);
  ctx.beginPath();
  ctx.ellipse(-6, -30, 15, 48, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// ----------------------------------------------------
// PITCHER, WATER LEVEL & SPLASH PARTICLES
// ----------------------------------------------------
function drawPitcherAndWater(ctx, width, height) {
  const px = width * 0.48;
  const py = height * 0.88;
  const pWidth = 140;
  const pHeight = 160;

  ctx.save();
  // Water inside vessel with harmonic wave ripples
  const waterH = pHeight * Stage.water;
  const surfaceY = py - waterH;

  // Water body
  const waterGrad = ctx.createLinearGradient(px, surfaceY, px, py);
  waterGrad.addColorStop(0, 'rgba(80, 180, 255, 0.55)');
  waterGrad.addColorStop(1, 'rgba(30, 80, 160, 0.7)');
  ctx.fillStyle = waterGrad;

  ctx.beginPath();
  ctx.moveTo(px - pWidth / 2 + 10, surfaceY);
  // Undulating water surface
  for (let x = px - pWidth / 2 + 10; x <= px + pWidth / 2 - 10; x += 10) {
    const wave = Math.sin((x * 0.08) + Stage.waterWaves) * 3;
    ctx.lineTo(x, surfaceY + wave);
  }
  ctx.lineTo(px + pWidth / 2 - 10, py);
  ctx.lineTo(px - pWidth / 2 + 10, py);
  ctx.closePath();
  ctx.fill();

  // Active Water Ripples
  waterRipples.forEach(r => {
    ctx.strokeStyle = `rgba(180, 220, 255, ${r.opacity})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(width * r.x, r.y, r.radius, r.radius * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Splash Droplets
  splashDroplets.forEach(d => {
    ctx.fillStyle = `rgba(140, 210, 255, ${d.life})`;
    ctx.beginPath();
    ctx.arc(width * d.x, height * d.y, d.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Pebbles inside pitcher
  ctx.fillStyle = '#5A4A38';
  ctx.strokeStyle = '#3A2E22';
  ctx.lineWidth = 1.5;
  Stage.pebbles.forEach(p => {
    ctx.beginPath();
    ctx.arc(width * p.x, height * p.y, p.size || 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Pitcher outline (Terracotta pottery with Rajasthani border)
  ctx.strokeStyle = 'rgba(227, 160, 24, 0.65)';
  ctx.lineWidth = 4;
  ctx.strokeRect(px - pWidth / 2, py - pHeight, pWidth, pHeight);

  // Pitcher neck rim
  ctx.fillStyle = 'rgba(227, 160, 24, 0.4)';
  ctx.fillRect(px - pWidth / 2 - 8, py - pHeight - 8, pWidth + 16, 10);

  ctx.restore();
}

// ----------------------------------------------------
// OVERHEAD BRASS HANGING LANTERN PROP
// ----------------------------------------------------
function drawLanternProp(ctx, lx, ly) {
  ctx.save();
  // Hanging Brass Chain
  ctx.strokeStyle = '#C8903C';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(lx, 0);
  ctx.lineTo(lx, ly);
  ctx.stroke();

  // Chain links
  for (let y = 10; y < ly - 8; y += 14) {
    ctx.strokeRect(lx - 2.5, y, 5, 8);
  }

  // Lantern Housing Top Dome
  ctx.fillStyle = '#2A1806';
  ctx.strokeStyle = '#E3A018';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(lx, ly - 8, 22, Math.PI, 0, false);
  ctx.fill();
  ctx.stroke();

  // Glass Frame
  ctx.fillStyle = 'rgba(255, 200, 100, 0.2)';
  ctx.fillRect(lx - 16, ly - 8, 32, 28);
  ctx.strokeRect(lx - 16, ly - 8, 32, 28);

  // Candle flame
  ctx.fillStyle = '#FFAA33';
  ctx.shadowColor = '#FF9900';
  ctx.shadowBlur = 24 * Stage.lanternFlicker;
  ctx.beginPath();
  ctx.arc(lx, ly + 6, 8 * Stage.lanternFlicker, 0, Math.PI * 2);
  ctx.fill();

  // Inner White Hot Wick
  ctx.fillStyle = '#FFF8E7';
  ctx.beginPath();
  ctx.arc(lx, ly + 6, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ----------------------------------------------------
// HANDCRAFTED RAJASTHANI HAVELI PROSCENIUM ARCH
// ----------------------------------------------------
function drawHaveliProscenium(ctx, width, height) {
  ctx.save();
  const gold = 'rgba(227, 160, 24, 0.85)';
  const goldPale = 'rgba(227, 160, 24, 0.25)';
  const margin = 14;

  // 1. Ornate Stage Border
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner thin border
  ctx.strokeStyle = goldPale;
  ctx.lineWidth = 1;
  ctx.strokeRect(margin + 6, margin + 6, width - (margin + 6) * 2, height - (margin + 6) * 2);

  // 2. Scalloped Mehrab Arch at Top Center
  const archW = Math.min(width * 0.7, 540);
  const archH = 34;
  const midX = width * 0.5;

  ctx.strokeStyle = gold;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(midX - archW * 0.5, margin);
  // Scallops
  const scallops = 7;
  const scW = archW / scallops;
  for (let i = 0; i < scallops; i++) {
    const sx = (midX - archW * 0.5) + i * scW;
    const mx = sx + scW * 0.5;
    const ex = sx + scW;
    const peakY = (i === Math.floor(scallops / 2)) ? margin + archH + 6 : margin + archH;
    ctx.quadraticCurveTo(mx, peakY, ex, margin);
  }
  ctx.stroke();

  // Center Hanging Bell / Kalash Motif
  ctx.fillStyle = '#E3A018';
  ctx.beginPath();
  ctx.arc(midX, margin + archH + 10, 5, 0, Math.PI * 2);
  ctx.fill();

  // 3. Four Corner Jali Filigree Corner Pieces
  drawCornerFiligree(ctx, margin + 4, margin + 4, 1, 1);
  drawCornerFiligree(ctx, width - margin - 4, margin + 4, -1, 1);
  drawCornerFiligree(ctx, margin + 4, height - margin - 4, 1, -1);
  drawCornerFiligree(ctx, width - margin - 4, height - margin - 4, -1, -1);

  ctx.restore();
}

function drawCornerFiligree(ctx, x, y, dirX, dirY) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dirX, dirY);
  ctx.strokeStyle = 'rgba(227, 160, 24, 0.6)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(34, 0);
  ctx.quadraticCurveTo(18, 18, 0, 34);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(12, 12, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(227, 160, 24, 0.4)';
  ctx.fill();

  ctx.restore();
}
