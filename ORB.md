Fix ONLY the Energy Orb depth-scaling behaviour in `src/components/CameraPreview.jsx`.

CURRENT BUG:
The scaling is inverted. When I move my hand closer to the camera, the orb becomes smaller. When I move my hand farther away, the orb becomes bigger.

EXPECTED BEHAVIOUR:
1. Hand moves closer to camera → orb grows larger.
2. Hand moves farther from camera → orb shrinks.
3. Hand remains at the same distance → orb maintains its size.

IMPLEMENTATION:
- Inspect the existing depth-scaling calculation and identify why the direction is inverted.
- Correct the scaling direction.
- Use apparent palm size as the primary distance indicator: a larger apparent palm means the hand is closer, so the orb must grow.
- Verify MediaPipe Z-depth direction before using it in the calculation. Do not blindly invert Z.
- Keep smooth interpolation to prevent sudden size jumps.
- Maintain the existing scaling limits of 0.5x to 2.0x.
- Keep depth tracking independent for each hand.
- Ensure all orb rings, particles, glow and other orb elements scale together.

IMPORTANT:
- Do not modify lightning, energy blasts, portal effects, gesture detection or camera tracking.
- Do not rewrite the component.
- Make the smallest necessary change.
- Run `npm run build` after the fix and report the result.