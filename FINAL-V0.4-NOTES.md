# Projection / Video Mapping Experience — V0.4 Final

Final polish approved for the standalone Projection experience.

## V0.4 additions

- Background light range expanded to 0.05–2.50 with quick Darker / Brighter controls.
- Projection text authoring restored as an independent layer inside the transformed projection plane.
- Text controls: enable/disable, content, size, opacity, color.
- Text settings are included in Save / Restore.
- Standalone HTML and temporary embed include the projection text.

## Protected working core

The verified V0 upload/playback path remains the base:
- custom background upload;
- local video/image upload;
- direct URL modes;
- play / pause / restart;
- Rubik Sota matrix3d geometry.

No Projection Guide is included.

## Source reference

Rubik Sota Director's Cut uses `.dc-word` as a separate absolute layer inside `.dc-box`, so the text shares the projection plane/perspective rather than being burned into the video.
