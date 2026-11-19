# Rang Manch: The Virtual Theatre — Technical & Spatial Notes

## 1. Architectural Design & Scenography

**Rang Manch** (The Living Theatre) transports the viewer into a hand-crafted Rajasthani Haveli courtyard at dusk (*Godhuli Bela*).

### Haveli Courtyard Features
- **Cusped Arches (*Mehrab*)**: Parametrically modeled scalloped arches echoing the sandstone palaces of Jaisalmer and Jodhpur.
- **Jharokha Balconies**: Ornate projecting enclosed balconies flanking the stage, featuring stone lattice screens (*Jaali*) that filter ambient twilight.
- **Shamiana Canopy**: A traditional Rajasthani festive canopy overhead in deep indigo (`#2B3A8C`) and turmeric (`#E3A018`) block-print motifs with gold fringe.
- **Marigold Garlands (*Toran / Genda Phool*)**: Strung across the archways using GPU-instanced floral clusters.
- **Brass Footlights & Diyas**: Placed at stage floor level to illuminate puppet skirts from below, casting tall dramatic shadows against the rear painted backdrop.
- **Audience Pit**: Silhouette paper figures seated cross-legged on carpeted bolsters (*Gaddi*), reacting with subtle body sways and applauding on dramatic beats.

---

## 2. Immersion Tiers

| Feature | Tabletop Theatre (MR) | Rang Manch Hall (VR) | Desktop / Web 3D |
| :--- | :--- | :--- | :--- |
| **Environment** | Real room passthrough | Sandstone Haveli courtyard | Orbitable 3D Courtyard |
| **Stage Size** | ~80 cm miniature proscenium | 2.4 m life-sized puppet stage | Scaled viewport canvas |
| **Tracking** | Bare hands (Pinch + Tilt) | Bare hands (Pinch + Tilt) | Mouse / Webcam fallback |
| **Curtain** | Pleated velvet, auto-parting | Dynamic cloth parting with gold cord | Smooth CSS/Three.js lerp |
| **Audience** | Floating miniature paper crowd | Instanced 3D paper crowd in courtyard | Ambient cheering audio |
| **Draw Calls** | ~45 calls | < 120 calls (well under 150 budget) | ~35 calls |

---

## 3. Lighting & Performance Optimization (Quest 3)

- **Target Framerate**: 72 fps (13.88 ms frame budget); floor 60 fps (16.6 ms).
- **Draw Call Budget**: Capped at 150 calls maximum.
  - Courtyard architecture: Batch-merged into static geometries with baked ambient occlusion textures.
  - Marigolds, lanterns, and audience members: Rendered via `THREE.InstancedMesh`.
  - Lights: 1 Directional moonlight + 1 Stage follow-spotlight with PCFSoft shadows (1024x1024) + unshadowed warm point footlights.
- **Shader Strategy**:
  - Velvet curtain: Lightweight vertex displacement shader simulating wind and parting tension without heavy PhysX cloth overhead.
  - Mirror glints (*Shisha work*): Procedural specular glint shader calculated in fragment step using view-vector reflection.

---

## 4. Acoustic Staging & Spatial Audio

- **Stage Emitter**: All puppet sounds (boli reed squeaks, ghungroo bells, horse hooves, been melody) emit from the puppet's 3D coordinates.
- **Audience Emitter**: Three-sided spatial panning for audience clapping and ambient twilight courtyard murmurs.
- **Boli Synthesis**: Procedural Web Audio bandpass-saw generator ($f_0 \approx 700\text{–}1200\text{ Hz}$, $Q=6$) dynamically modulated by puppet head tilt.
- **Rhythm Layer**: High-precision Web Audio clock driving dholak strokes (*Dha*, *Ge*, *Na*) and manjira cymbals.
