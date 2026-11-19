---
name: theatre-builder
description: Standards, architecture, lighting, stage conventions and audience instancing for WebXR virtual theatres including Tabletop MR and Rang Manch Haveli VR.
---

# Theatre Builder Skill

This skill provides architectural conventions, WebXR rendering budgets, and spatial design rules for building interactive virtual stages and theatre halls within **Lantern Tales (Rang Manch)**.

## Architectural Stages of Immersion

### 1. Tabletop Miniature Proscenium (MR Mode)
- **Width**: ~80 cm width, 50 cm height, 40 cm depth.
- **Placement**: Snaps to detected flat table surface via WebXR Hit Test or Plane Detection; defaults to floating at arm's length (0.75m front, -0.15m vertical) in seated radius.
- **Boundary**: Transparent passthrough perimeter allowing user's real room to frame the performance.
- **Components**: Wooden carved proscenium arch, velvet draped curtain, copper/brass footlight trough, miniature painted-cloth backdrop roller.

### 2. Rang Manch Haveli Hall (Full VR Mode)
- **Aesthetic**: Traditional Rajasthani Haveli courtyard at twilight/dusk.
- **Architectural Elements**:
  - Cusped scalloped Rajasthani arches (*Mehrab*)
  - Carved sandstone balconies (*Jharokha*) with stone lattice screens (*Jaali*)
  - Traditional shamiana canopy with block-printed fabric (*Bandhani / Dabu*)
  - Brass oil lamps (*Diyas / Lanterns*), hanging marigold garlands (*Genda Phool*)
  - Persian/Mughal floral rugs and silk floor bolsters (*Gaddi / Masnad*)
  - Clear desert night sky with twinkling stars and a soft crescent moon
- **Comfort**: Strictly seated experience within a 2-foot comfort radius; zero artificial locomotion to eliminate VR sickness.
- **Dissolve Transition**: Fades to the courtyard with a warm lantern-light amber glow dissolve, never a jarring cut.
- **Exit Tag**: A "Return to my room" tag is always anchored within 0.6m, reachable with one gaze+pinch.

## Rendering Budget & Quest 3 Optimization

1. **Draw Call Budget**: Strictly <= 150 total draw calls in Rang Manch Hall mode.
2. **GPU Instancing**:
   - Audience figures: InstancedMesh with 2D shadow paper silhouettes.
   - Marigold garlands: InstancedMesh with varied petal rotations.
   - String lights & brass lamps: Instanced geometry sharing one material.
3. **Lighting & Shadows**:
   - Baked ambient occlusion and environment maps for the courtyard walls.
   - Dynamic lights limited to: 1 stage spotlight (soft shadow map 1024x1024) + footlights (vertex lighting / unshadowed point lights).
4. **Frame Rate Targets**:
   - Quest 3 Target: 72 fps (13.88 ms frame time).
   - Absolute Floor: 60 fps (16.6 ms frame time).
   - Auto-degradation ladder: If frame time > 14 ms for 120 consecutive frames, drop audience count by 50% and disable dynamic mirror glints.

## Proscenium Curtain System
- **Curtain Mesh**: Dual-panel pleated velvet cloth with gold bullion fringe and cords.
- **Parting Behavior**: On show start, panels gather outward and upward following a smooth bezier curve.
- **Shader / Sim**: Vertex-shader wind/tension sway with cheap sinusoidal displacement, keeping CPU overhead near zero.
