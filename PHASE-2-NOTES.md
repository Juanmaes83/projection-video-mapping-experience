# Phase 2 — Projection / Video Mapping Experience V1

## Safety boundary

- Development repository: `Juanmaes83/projection-video-mapping-experience`
- Branch: `feat/projection-v1-authoring-output`
- `Juanmaes83/escaparates-pro` is read-only reference material in this phase.
- No Escaparates Pro file, branch, PR or commit is modified by this work.
- No merge to this repository's `main` before visual approval.

## Source references

### Rubik Sota
Protected source geometry remains the original Director's Cut `matrix3d()` baseline. V1 adds a stronger product default while retaining a reset to the source look.

### Escaparates Pro
Selective patterns studied from `master/js/export.js`:
- separation between authoring UI and final viewer;
- media serialization before standalone output;
- standalone HTML output;
- video export architecture based on browser capture/MediaRecorder concepts;
- embed/final-viewer delivery patterns.

V1 does not copy the full `js/export.js` module and does not import the `EP.*` application graph. Only the capabilities needed by Projection are adapted locally.

## Phase 2 implemented

- stronger default projection opacity/brightness/contrast;
- protected Rubik source reset;
- projection-ready custom background workflow with non-exported target guide;
- local image/video upload and direct media URLs;
- play/pause/restart, loop and mute;
- projector light beam controls;
- subtle floating dust particle controls;
- standalone HTML export with local uploaded media embedded as data URLs;
- browser-tab WebM recording so CSS perspective/beam/particles are captured as displayed;
- temporary local embed generation;
- PNG screenshot path with explicit cross-origin limitation.

## Intentionally deferred to Phase 3

- 4-corner perspective editor / homography;
- architectural masks;
- window/column segmentation;
- multi-surface or multi-projector mapping;
- true render-pipeline video export independent of browser tab capture.
