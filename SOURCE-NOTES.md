# Source Notes — Projection / Video Mapping Experience V0

## Purpose

Validate the existing Rubik Sota Director's Cut projection illusion as a standalone, authorable experience before designing true 4-corner mapping or integrating anything into Escaparates Pro.

## Source A — rubiksotamovil

Repository: `Juanmaes83/rubiksotamovil`

Baseline inspected in `index.html`, section `#directors-cut-manifesto`.

Preserved baseline concepts:

- `.dc-box` full-stage media plane.
- Exact source transform:
  `matrix3d(0.614952,0.147049,0,0.000199706,-0.0178567,0.487847,0,-0.0000312429,0,0,1,0,137,29,0,1)`
- Source media opacity `0.35`.
- Source media blend mode `screen`.
- Background image based on the same Director's Cut source.
- Light-spill / blur concept.
- Reflection / masked-light concept.
- GSAP used for cinematic motion.

V0 intentionally keeps the perspective fixed by default. Transform controls are additive and Reset restores the source baseline.

## Source B — BANDEROLAS-DINAMICAS

Repository: `Juanmaes83/BANDEROLAS-DINAMICAS`

Only the product interaction pattern is referenced:

- large experience viewport on the left;
- authoring/settings panel on the right;
- local media selection using browser file input / object URLs.

No cloth physics, Verlet solver, WebGL mesh, wind, constraints or banner rendering is reused in Projection.

## V0 scope

Implemented:

- Original Rubik Sota YouTube source baseline.
- Local image/video source.
- Direct remote image/video URL source.
- Original perspective reset.
- Opacity, brightness, contrast and blend controls.
- Light spill and reflection intensity.
- Background brightness.
- Scale / X / Y / Z-rotation additive transform controls.
- Custom background image while retaining projection geometry.
- GSAP reveal.

Not implemented intentionally:

- 4-corner calibration.
- homography editor.
- architectural masks.
- multi-surface mapping.
- perspective auto-detection.
- export/video capture.
- Escaparates Pro integration.

## Hard isolation rule

This repository is standalone R&D. Nothing in Escaparates Pro is modified or imported during V0 validation. Integration may only begin after explicit visual approval.