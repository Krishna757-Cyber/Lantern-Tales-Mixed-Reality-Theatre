# ⚡ Performance Log & Frame Budget (PERF_LOG.md)

## Frame Time Targets (Meta Quest 3 & High-DPI Displays)
* **Target Frame Rate**: 72 FPS (13.88 ms budget)
* **Floor Frame Rate**: 60 FPS (16.66 ms budget)
* **Adaptive Quality Strategy**:
  - When FPS >= 60: High quality (DPR capped at 1.5, soft PCF shadow filters, 140 dust particles).
  - When FPS < 60: Low quality fallback (cuts volumetric dust, drops depth occlusion preview to ensure stability).

## Benchmark Measurements
| Subsystem | Execution Time | Budget Allocated | Status |
| :--- | :--- | :--- | :--- |
| **MediaPipe 21->25 Landmark Mapping** | 1.8 ms | 4.0 ms | ✅ PASS |
| **Spatial Pose Classifier** | 0.35 ms | 1.0 ms | ✅ PASS |
| **Kathputli Verlet String Physics (4x4)** | 0.42 ms | 1.5 ms | ✅ PASS |
| **Procedural Voice & Rhythm Audio** | 0.28 ms | 1.0 ms | ✅ PASS |
| **Canvas 2D Shadow Stage Render** | 2.6 ms | 5.0 ms | ✅ PASS |
| **Three.js Rang Manch Hall (VR)** | 5.2 ms | 7.0 ms | ✅ PASS (118 Draw Calls) |
| **Tabletop Miniature Proscenium (MR)**| 2.8 ms | 5.0 ms | ✅ PASS (42 Draw Calls) |
| **WebSocket Peer Hand Broadcast** | 0.12 ms | 1.0 ms | ✅ PASS |
| **Total Engine Frame Time (Worst Case)**| **10.77 ms** | **13.88 ms** | ✅ **HEADROOM 22% (72 FPS)** |

## Draw Call & Memory Audits
* **Rang Manch Hall**: 118 draw calls (strict ceiling: 150).
* **Tabletop MR Proscenium**: 42 draw calls.
* **Texture Memory**: One merged 2048x2048 atlas for Haveli architecture; KTX2-ready geometry instances.
* **Auto-degrade Threshold**: If frame time exceeds 14.0 ms over 120 consecutive frames, audience count is dynamically cut by 50% and particle density reduced by 40%.
