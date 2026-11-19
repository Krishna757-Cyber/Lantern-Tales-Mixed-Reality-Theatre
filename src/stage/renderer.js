/* ================================================================
   LANTERN TALES — STAGE RENDERER (src/stage/renderer.ts)
   Canvas 2D Shadow Theatre Simulation Engine
================================================================ */

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;

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
  waterWaves: 0
};

export function initStage() {
  Stage.pebbles = [];
  Stage.lanternLit = true;
  Stage.crow.x = 1.15;
  Stage.crow.flying = false;
}

export function dropPebble() {
  Stage.pebbles.push({
    x: 0.45 + (Math.random() - 0.5) * 0.1,
    y: 0.25,
    vy: 0.005,
    size: 14 + Math.random() * 6
  });
  Stage.targetWater = clamp(Stage.targetWater + 0.045, 0.18, 0.65);
}

export function flyCrow() {
  Stage.crow.flying = true;
  Stage.crow.x = 0.42;
  Stage.crow.y = 0.45;
  Stage.crow.flightTimer = 0;
}

export function updateStage(dt, now) {
  // Water animation
  Stage.water = lerp(Stage.water, Stage.targetWater, dt * 2.5);
  Stage.waterWaves += dt * 3;

  // Pebble physics
  for (let i = Stage.pebbles.length - 1; i >= 0; i--) {
    const p = Stage.pebbles[i];
    p.vy += dt * 0.015; // gravity
    p.y += p.vy;
    if (p.y > 0.88 - Stage.water * 0.4) {
      p.y = 0.88 - Stage.water * 0.4;
      p.vy = 0;
    }
  }

  // Crow flight
  if (Stage.crow.flying) {
    Stage.crow.flightTimer += dt;
    Stage.crow.x = lerp(0.42, -0.25, clamp(Stage.crow.flightTimer / 3.0, 0, 1));
    Stage.crow.y = 0.45 - Math.sin(Stage.crow.flightTimer * 2.8) * 0.18;
    if (Stage.crow.flightTimer > 3.2) {
      Stage.crow.flying = false;
      Stage.crow.x = 1.15;
    }
  }

  // Lantern flicker
  Stage.lanternFlicker = 0.94 + Math.sin(now * 0.012) * 0.06 + Math.sin(now * 0.035) * 0.03;
}

export function drawStage(ctx, width, height, now, handA, handB = null, options = {}) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // 1. Parchment background
  ctx.fillStyle = '#100e19';
  ctx.fillRect(0, 0, width, height);

  // 2. Projected Lantern Glow
  const lx = width * (Stage.lanternX + Math.sin(now * 0.001) * 0.02);
  const ly = height * Stage.lanternY;
  const radius = Math.max(width, height) * 0.95 * Stage.lanternFlicker;

  const radial = ctx.createRadialGradient(lx, ly, 20, lx, ly, radius);
  radial.addColorStop(0, 'rgba(255, 185, 80, 0.42)');
  radial.addColorStop(0.35, 'rgba(230, 140, 50, 0.22)');
  radial.addColorStop(0.7, 'rgba(50, 20, 10, 0.45)');
  radial.addColorStop(1, 'rgba(11, 10, 16, 0.98)');

  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // 3. Physical Room Corner Seam (if enabled)
  if (options.cornerPreview) {
    const cx = width * 0.52;
    ctx.strokeStyle = 'rgba(255, 179, 71, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255, 179, 71, 0.4)';
    ctx.font = '10px monospace';
    ctx.fillText('◄ WALL A | REAL CORNER | WALL B ►', cx - 100, 24);
  }

  // 4. Pitcher & Rising Water
  drawPitcherAndWater(ctx, width, height);

  // 5. Shadow Puppet for Player Hand
  if (handA && handA.present) {
    drawShadowPuppet(ctx, width * handA.x, height * handA.y, handA.pose, false, now);
  }

  // 6. Shadow Puppet for Companion / Guest Hand
  if (handB && handB.present) {
    drawShadowPuppet(ctx, width * handB.x, height * handB.y, handB.pose, true, now);
  }

  // 7. Flying Crow (Detached paper puppet)
  if (Stage.crow.flying) {
    drawFlyingCrow(ctx, width * Stage.crow.x, height * Stage.crow.y, now);
  }

  // 8. Overhead Brass Lantern Prop
  drawLanternProp(ctx, lx, ly);

  ctx.restore();
}

function drawShadowPuppet(ctx, x, y, pose, isGuest = false, now = 0) {
  ctx.save();
  ctx.fillStyle = isGuest ? 'rgba(14, 18, 38, 0.92)' : 'rgba(11, 10, 16, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 18;

  ctx.beginPath();
  switch (pose) {
    case 1: // Kindle (Open palm)
      ctx.ellipse(x, y, 42, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let f = 0; f < 5; f++) {
        const angle = -0.9 + f * 0.45;
        ctx.save();
        ctx.translate(x, y - 35);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, -28, 9, 32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      break;

    case 2: // Beak (Pinch)
      ctx.ellipse(x, y, 40, 32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 28, y - 10);
      ctx.lineTo(x + 85, y);
      ctx.lineTo(x + 28, y + 10);
      ctx.closePath();
      ctx.fill();
      // Eye cut perforation
      ctx.fillStyle = '#F4E8D0';
      ctx.beginPath();
      ctx.arc(x + 12, y - 6, 5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 3: // Pebble (Clenched fist)
      ctx.roundRect ? ctx.roundRect(x - 36, y - 30, 72, 60, 18) : ctx.rect(x - 36, y - 30, 72, 60);
      ctx.fill();
      break;

    case 5: // Wings (Flapping flight)
      ctx.ellipse(x, y + 10, 22, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      const flap = Math.sin(now * 0.012) * 0.4;
      [-1, 1].forEach(side => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(side * (0.8 + flap));
        ctx.beginPath();
        ctx.ellipse(side * 55, 0, 58, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      break;

    default:
      ctx.ellipse(x, y, 40, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  ctx.restore();
}

function drawFlyingCrow(ctx, x, y, now) {
  ctx.save();
  ctx.fillStyle = '#0B0A10';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 24;

  const flap = Math.sin(now * 0.018) * 0.55;
  ctx.translate(x, y);

  // Crow Body
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 18, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.beginPath();
  ctx.moveTo(30, -5);
  ctx.lineTo(60, 0);
  ctx.lineTo(30, 5);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#F4E8D0';
  ctx.beginPath();
  ctx.arc(20, -4, 3, 0, Math.PI * 2);
  ctx.fill();

  // Wings
  ctx.fillStyle = '#0B0A10';
  ctx.save();
  ctx.rotate(-flap);
  ctx.beginPath();
  ctx.ellipse(-5, -28, 14, 45, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

function drawPitcherAndWater(ctx, width, height) {
  const px = width * 0.48;
  const py = height * 0.88;
  const pWidth = 140;
  const pHeight = 160;

  ctx.save();
  // Water inside vessel
  const waterH = pHeight * Stage.water;
  ctx.fillStyle = 'rgba(70, 160, 240, 0.45)';
  ctx.beginPath();
  ctx.rect(px - pWidth / 2 + 10, py - waterH, pWidth - 20, waterH);
  ctx.fill();

  // Pebbles inside pitcher
  ctx.fillStyle = '#4a443a';
  Stage.pebbles.forEach(p => {
    ctx.beginPath();
    ctx.arc(width * p.x, height * p.y, p.size || 16, 0, Math.PI * 2);
    ctx.fill();
  });

  // Pitcher outline
  ctx.strokeStyle = 'rgba(255, 179, 71, 0.4)';
  ctx.lineWidth = 4;
  ctx.strokeRect(px - pWidth / 2, py - pHeight, pWidth, pHeight);

  ctx.restore();
}

function drawLanternProp(ctx, lx, ly) {
  ctx.save();
  ctx.strokeStyle = '#c8903c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(lx, 0);
  ctx.lineTo(lx, ly);
  ctx.stroke();

  // Lantern Housing
  ctx.fillStyle = '#2a1a08';
  ctx.beginPath();
  ctx.arc(lx, ly, 18, 0, Math.PI * 2);
  ctx.fill();

  // Candle flame
  ctx.fillStyle = '#ffb347';
  ctx.shadowColor = '#ffb347';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(lx, ly + 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
