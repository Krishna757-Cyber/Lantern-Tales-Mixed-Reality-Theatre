---
name: kathputli-rig
description: String-puppet physics, Verlet constraint solving, hand-tracking mapping, voice boli synthesis, and folk show authoring for Rajasthani Kathputli in WebXR.
---

# Kathputli Rig & String Physics Skill

This skill provides physics formulations, hand-tracking control paradigms, procedural sound synthesis, and show authoring specifications for traditional Rajasthani Kathputli (string puppetry).

## Kathputli Anatomy & Mechanics
- **Wood & Cloth Construction**: Carved mango or rohida wood head with expressive eyes, cotton-stuffed cloth torso, jointed wooden arms, and an unjointed flared cloth skirt (*Ghaghra*) concealing the legless interior.
- **Control System (*Khatola* / Crossbar)**: A wooden crossbar or looped string held in the puppeteer's hand.
- **String Routing**:
  1. Head string (supports primary weight and balance).
  2. Left & Right wrist strings (drive gestures, bowing, playing instruments).
  3. Waist / hip strings (drives torso tilt, bowing, and flared skirt spins).

## String Physics Engine (Verlet / PBD)
- **Chain Representation**: Each string is discretized into 4 particles ($N=4$) connected by distance constraints $L_0$.
- **Integration**:
  $$x_{i}(t + \Delta t) = x_{i}(t) + (1 - c)(x_{i}(t) - x_{i}(t - \Delta t)) + a_{i} \Delta t^2$$
  where $c$ is damping coefficient ($0.03$), and $a_i$ includes gravity ($g = -9.81\ \text{m/s}^2$) and cloth drag.
- **Constraint Relaxation**: Fast Gauss-Seidel distance constraint projection (3 iterations per substep, fixed 60 Hz / 72 Hz / 90 Hz substeps).
- **Stability Guarantee**: Unconditionally stable under rapid hand acceleration by enforcing maximum stretch limits and velocity clamping.

## Hand Control Mapping (No Controllers)
- **Crossbar Anchor**: Attaches to player's index-thumb pinch point.
- **Vertical Displacement**: Raises and lowers puppet, transferring tension between head and skirt strings.
- **Wrist Tilt / Roll**: Drives puppet leans, pirouettes, and directional turns.
- **Pinch-Release / Tap**: "Plucks" a specific string, causing an energetic nodding or clapping motion.
- **Finger Wiggle**: Triggers rapid rhythmic dancing steps (ghungroo footfalls and skirt flare).
- **Two-Hand Mode**: Dominant hand holds crossbar; off-hand pinches individual string for expressive bowing/waving.
- **One-Hand Mode**: Automatic balance and wrist-roll gesture blending for accessibility.

## Procedural Voice & Rhythm Synthesis
- **Boli / Ghona Reed Device**: Traditional bamboo-and-rubber reed sound generated via Web Audio API:
  - Bandpass-filtered sawtooth wave ($f_0 \approx 700\text{–}1200\ \text{Hz}$, $Q \approx 6$).
  - Pitch envelope glides dynamically mapped to puppet head tilt and string plucking.
  - Zero spoken words; expressive emotional squeaks paired with paper speech-bubble icon cues.
- **Dholak & Manjira Rhythm Engine**:
  - Procedural percussion synthesizer generating open *dha*, closed *ge*, high *na*, and metallic *manjira* clinks.
  - Tempo gently synchronizes with player's puppet movement velocity.
  - Taal meter visualizer rendered as an auspicious ring of marigold flowers.
