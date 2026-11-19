# 🏮 Lantern Tales (Chhaya — छाया)
> **Seated, controller-free mixed-reality shadow theatre for the Meta VR Start Developer Competition 2026**  
> *Track: Entertainment • Category: New Experience*

[![Node.js CI](https://img.shields.io/badge/Node.js-v24.17-brightgreen.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](docs/CREDITS.md)
[![WebXR](https://img.shields.io/badge/WebXR-Immersive%20AR-orange.svg)](https://www.w3.org/TR/webxr/)
[![Privacy](https://img.shields.io/badge/Privacy-On--Device%20Vision-blue.svg)](#privacy-architecture)

---

## 🌟 The Experience
In *Lantern Tales*, your bare hands cast shadows directly onto your physical room wall via passthrough. An overhead virtual brass lantern acts like an ancient oil lamp. Hand poses trigger responsive paper-cut shadow puppets (open palm kindles fire, pinch becomes a beak, flapping fingers launch a flying crow, fists drop stones into water). 

### Two Hero Moments
1. **The Corner Fold**: A shadow bird folds physically around the real 90-degree corner of your room and takes flight into passthrough air.
2. **The Stranger's Shadow**: Across a WebSocket room code, a companion's shadow hand enters from the opposite wall, meeting yours in a cooperative duet.

---

## 🏗️ Architecture & Project Structure

The project is built as a complete, production-grade full-stack application with strict modular separation:

```text
Meta-757/
├── index.html                  # Clean semantic markup; zero inline bloated CSS/JS
├── package.json                # Dependencies, scripts, and build configuration
├── server/                     # Full-stack backend services
│   ├── server.js               # Express static & API server + WebSocket multiplayer engine
│   └── data/
│       ├── fables.json         # Narrative acts, 5-beat performance timelines & lore
│       └── ghosts.json         # Bundled guest shadow tracking tracks
├── src/                        # Modular frontend codebase
│   ├── app.js                  # Main entrypoint orchestrating all subsystems
│   ├── styles/                 # Dedicated stylesheet modules
│   │   ├── theme.css           # 5 preset themes + custom variables design system
│   │   ├── rangmanch.css       # Theatrical storytelling, spotlight sweeps, timeline
│   │   └── stage.css           # Canvas stage, HUD, cinema letterbox, gestures
│   ├── theme/
│   │   └── theme-manager.js    # Presets (Dark, Light, Vermilion, Jade, Moon) & Theme Studio
│   ├── recognizer/
│   │   └── poses.js            # 25-joint schema, geometric angle & pinch classifier
│   ├── input/
│   │   ├── virtual.js          # Mouse, pointer, and touch virtual controller
│   │   └── webcam.js           # Private on-device MediaPipe vision processor
│   ├── stage/
│   │   └── renderer.js         # Canvas 2D shadow theatre engine (flicker, water, pebbles)
│   ├── tour/
│   │   └── director.js         # 90-second automated Director's Cut tour
│   ├── xr/
│   │   └── room.js             # Corner folding, plane detection, depth occlusion
│   ├── hero/
│   │   └── hero-scene.js       # Three.js 3D lantern hero scene with volumetric lighting
│   ├── network/
│   │   └── multiplayer.js      # WebSocket client for real-time guest shadow hand sync
│   ├── story/
│   │   └── fables.js           # Lore and cultural credits loader
│   └── ui/
│       ├── navigation.js       # SPA router (#home, #play, #poses, #stories, #judges)
│       ├── flags-drawer.js     # Live feature flags controller (flags.ts)
│       └── smoke-test.js       # Judge smoke test verification harness
├── tests/                      # Automated test suite
│   ├── pose-classifier.test.js # Synthetic joint rig tests for all 8 poses
│   ├── theme.test.js           # Theme preset and token verification
│   ├── api.test.js             # REST API and room signaling tests
│   └── run-all.js              # Test runner
└── docs/
    └── CREDITS.md              # Open-source licenses & cultural tradition credits
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Full-Stack Server
```bash
npm start
```
* **Frontend Web App**: `http://localhost:3001/`
* **Multiplayer WebSocket**: `ws://localhost:3001/ws/room`
* **API Endpoints**: `http://localhost:3001/api/health`, `http://localhost:3001/api/fables`

### 3. Run Tests
```bash
npm test
```

---

## 🎭 The 8 Gestural Forms
| Pose | Name | Gesture | Theatrical Action |
| :--- | :--- | :--- | :--- |
| **1** | **Kindle** | Open palm, fingers wide | Awakens the overhead brass lantern flame |
| **2** | **Beak** | Thumb-to-index pinch | Beak opens; hold 2s to turn into crow |
| **3** | **Pebble** | Clenched fist | Manifests and drops glowing stones into vessel |
| **4** | **Guide** | Single index point | Steers the bird across the parchment |
| **5** | **Wings** | Index + middle; flap | Crow detaches and takes flight |
| **6** | **Sunrise** | Thumb + index L-frame | Lifts the golden sun; shifts windows |
| **7** | **Meet** | Two hands / middle+ring | Summons guest shadow for the duet |
| **8** | **Bloom** | Thumb + pinky open | Lights the shelf lanterns one by one |

---

## 🎨 Theme Modes
- **Dark (Default)**: Midnight ink (`#0B0A10`), warm amber glow (`#FFB347`), aged parchment (`#F4E8D0`).
- **Light**: Crisp parchment paper (`#FFFAF0`), walnut ink (`#2C1A0E`), golden sun (`#D4820A`).
- **Vermilion Night (🔴)**: Royal crimson drama and stage velvet.
- **Jade Forest (🌿)**: Emerald kelir screen with bamboo accents.
- **Deep Moon (🌙)**: Midnight indigo with celestial silver blues.
- **Custom Theme Studio**: Real-time 5-color palette customizer and typography selector (Fraunces, Crimson Pro, Lora, Georgia, Josefin Sans).

---

## 🔒 Privacy Architecture
- **On-Device Vision**: Camera frames from `src/input/webcam.js` are processed exclusively in browser memory.
- **Zero Video Uploads**: Video pixels are **never** transmitted, stored, or sent to any server.
- **Zero Tracking**: No cookies, no analytics SDKs, and no third-party telemetry.
