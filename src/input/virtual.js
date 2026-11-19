/* ================================================================
   LANTERN TALES — VIRTUAL INPUT CONTROLLER
   Mouse, touch and keyboard controls for desktop play
================================================================ */

export const VirtualInput = {
  mode: 'virtual',
  hand: {
    x: 0.62,
    y: 0.55,
    present: true,
    pose: 1,
    src: 'virtual'
  },
  keysActive: false
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const lerp = (a, b, t) => a + (b - a) * t;

export function initVirtualInput(canvasEl, onPoseChange = null) {
  if (!canvasEl) return;

  const handlePointer = (e) => {
    const rect = canvasEl.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;

    // Normalizing wall coordinates
    const wallX = clamp((mx - 0.06) / 0.88, 0, 1);
    const wallY = clamp((my - 0.07) / 0.8, 0, 1);

    VirtualInput.hand.x = lerp(VirtualInput.hand.x, wallX, 0.35);
    VirtualInput.hand.y = lerp(VirtualInput.hand.y, wallY, 0.35);
    VirtualInput.hand.present = true;
    VirtualInput.hand.src = 'virtual';
  };

  ['mousemove', 'pointermove'].forEach(ev => {
    canvasEl.addEventListener(ev, handlePointer);
  });

  canvasEl.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    const rect = canvasEl.getBoundingClientRect();
    VirtualInput.hand.x = clamp((t.clientX - rect.left) / rect.width - 0.06, 0, 1) / 0.88;
    VirtualInput.hand.y = clamp((t.clientY - rect.top) / rect.height, 0, 1);
    VirtualInput.hand.present = true;
  }, { passive: false });

  // Center stage recalibration button
  const calibBtn = document.getElementById('btn-calibrate');
  if (calibBtn) {
    calibBtn.addEventListener('click', () => {
      VirtualInput.hand.x = 0.62;
      VirtualInput.hand.y = 0.55;
    });
  }
}

export function setVirtualPose(poseNum, onPoseChange = null) {
  VirtualInput.hand.pose = poseNum;
  if (typeof onPoseChange === 'function') {
    onPoseChange(poseNum);
  }
}
