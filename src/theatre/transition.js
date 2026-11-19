/* ================================================================
   LANTERN TALES — THEATRE TRANSITION & DISSOLVE (src/theatre/transition.js)
   Lantern-light amber glow dissolve between Table MR and Haveli VR
   Never a hard cut; accessible comfortable gaze+pinch exit tag
================================================================ */

export class TheatreTransition {
  constructor(overlayEl = null) {
    this.overlayEl = overlayEl;
    this.progress = 0; // 0 = fully MR, 1 = fully VR
    this.isTransitioning = false;
  }

  // Fade to warm amber lantern glow and resolve target mode
  fadeDissolve(fromMode, toMode, durationMs = 800, onMidpoint = null) {
    if (this.isTransitioning) return Promise.resolve();
    this.isTransitioning = true;

    return new Promise((resolve) => {
      let overlay = this.overlayEl || document.getElementById('theatre-dissolve-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'theatre-dissolve-overlay';
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '140';
        overlay.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 179, 71, 0.95) 0%, rgba(11, 10, 16, 0.98) 100%)';
        overlay.style.opacity = '0';
        overlay.style.transition = `opacity ${durationMs / 2000}s ease`;
        document.body.appendChild(overlay);
        this.overlayEl = overlay;
      }

      // Step 1: Fade to amber lantern glow
      overlay.style.opacity = '1';

      setTimeout(() => {
        // Step 2: Swap scene mode at the peak of the glow
        if (typeof onMidpoint === 'function') {
          onMidpoint(toMode);
        }

        setTimeout(() => {
          // Step 3: Fade out to reveal new scene
          overlay.style.opacity = '0';
          setTimeout(() => {
            this.isTransitioning = false;
            resolve();
          }, durationMs / 2);
        }, 120);
      }, durationMs / 2);
    });
  }
}
