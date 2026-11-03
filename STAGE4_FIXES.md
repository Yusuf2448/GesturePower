# GESTUREPOWER – STAGE 4.1
# DUAL-HAND POWERS, DEPTH AWARENESS AND ADVANCED PORTAL VFX

We are improving the existing GesturePower application.

The current application already has:
- React + Vite.
- Webcam integration.
- MediaPipe hand tracking.
- Two-hand landmark detection.
- Basic gesture recognition.
- Energy Orb.
- Lightning Storm.
- Energy Blast.
- Dimensional Portal.
- Existing futuristic HUD and power selector.

There are four important problems that must be fixed.

IMPORTANT:
Inspect the entire existing codebase before modifying anything.
Do not rebuild the application from scratch.
Preserve all existing working functionality.
Do not replace real webcam tracking with simulated coordinates.

# ISSUE 1 – INDEPENDENT ENERGY ORBS FOR BOTH HANDS

CURRENT PROBLEM:
Only one hand can generate an energy orb.

REQUIRED BEHAVIOUR:

- Both hands must independently generate energy orbs.
- When the user opens their left palm, an orb appears above the left palm.
- When the user opens their right palm, another orb appears above the right palm.
- When both palms are open, two separate orbs must appear simultaneously.
- Each orb must follow its own hand independently.
- Each orb must have independent position, size, rotation, brightness and particle animation.
- Closing one hand must remove only that hand's orb.
- The other hand's orb must continue working.
- Losing one hand from the camera must not affect the other hand.

VISUAL QUALITY:

Each orb should have:
- Bright animated energy core.
- Multiple rotating energy rings.
- Glowing outer aura.
- Floating particles.
- Small electric arcs.
- Smooth particle trails.

Do not create two copies at the same screen position.

Use the actual palm landmarks for each individual hand.

# ISSUE 2 – LIGHTNING FROM BOTH HANDS

CURRENT PROBLEM:
Lightning only works with one hand.

REQUIRED BEHAVIOUR:

- Both hands must independently generate lightning.
- Lightning must originate from the actual index fingertip of each hand.
- Both hands can shoot lightning simultaneously.
- Each hand's lightning direction must follow its own movement.
- Add branching electric arcs and electric particles.
- Support independent activation and deactivation.

ADDITIONAL FEATURE:

When both hands are pointing toward each other or positioned appropriately, allow lightning to connect between the two hands.

Create a visually impressive electrical connection with:
- Multiple branching lightning paths.
- Pulsating electric energy.
- Bright electrical sparks.
- Blue-white glowing arcs.

If one hand stops pointing, its lightning should disappear without disabling the other hand's lightning.

# ISSUE 3 – ENERGY BLAST FROM BOTH HANDS

CURRENT PROBLEM:
Energy blasting is limited to one hand.

REQUIRED BEHAVIOUR:

- Either hand can independently charge and release an energy blast.
- Both hands can charge simultaneously.
- Both hands can release separate projectiles simultaneously.
- Projectiles must originate from the actual hand position.
- Projectile direction should be determined by the hand's movement and orientation.
- Add glowing energy trails.
- Add particle explosions when projectiles reach the screen boundary.
- Add shockwaves and bright flashes during release.

DUAL-HAND BLAST:

When both hands are charging energy, allow the user to push both hands forward to release two powerful simultaneous energy blasts.

Ensure the two blasts originate from different hand positions.

Use separate cooldowns for each hand to prevent accidental repeated activation.

# ISSUE 4 – DEPTH-AWARE ENERGY ORB SCALING

CURRENT PROBLEM:
When the user moves their hand toward the camera, the actual hand becomes bigger, but the energy orb remains the same size.

This breaks the illusion of depth.

REQUIRED BEHAVIOUR:

The energy orb must scale according to the apparent distance of its corresponding hand from the camera.

When the hand moves toward the camera:
- The hand appears larger.
- The orb must grow proportionally.
- The energy rings must also grow.
- Particle size and glow intensity should increase slightly.
- The orb should appear closer to the viewer.

When the hand moves away from the camera:
- The hand appears smaller.
- The orb must shrink proportionally.
- Its rings and particles should become smaller.
- The orb should appear farther away.

IMPLEMENTATION:

Use a combination of:

1. MediaPipe landmark depth information, especially relative Z values.
2. Apparent palm size calculated from palm landmark distances or hand bounding-box dimensions.
3. A smoothed depth estimate.
4. A configurable scaling multiplier.

Use the distance between stable palm landmarks, such as index MCP and pinky MCP, or a normalized palm bounding box as a practical apparent-size measurement.

Establish a reference palm size when the hand first becomes visible.

Calculate an independent depth and scale value for each hand.

Use smoothing to prevent sudden orb size changes.

Clamp the scaling range to prevent extreme values.

IMPORTANT:
Do not use only the distance between the thumb and index fingertip, because that changes when the user opens and closes their fingers.

Do not assume MediaPipe relative Z is a direct measurement in meters. Combine it with apparent hand size for a more robust approximation.

The depth scaling must work independently for both hands.

# ISSUE 5 – COMPLETE DIMENSIONAL PORTAL REDESIGN

CURRENT PROBLEM:
The current portal is extremely basic and mostly looks like a green-coloured space.

I want a significantly more advanced portal.

Use the uploaded reference image as the visual inspiration.

The reference has:
- Deep blue and purple cosmic colours.
- A bright white luminous central core.
- Multiple concentric swirling rings.
- Nebula-like energy clouds.
- A deep tunnel or vortex appearance.
- Thousands of glowing particles.
- A strong sense of depth and motion.

DESIGN DIRECTION:

Create a spectacular cosmic dimensional vortex.

COLOUR PALETTE:

- Electric blue.
- Deep navy.
- Vibrant purple.
- Violet.
- Cyan.
- White-hot luminous centre.

Avoid the existing plain green portal appearance.

PORTAL LAYERS:

Layer 1 – Central Core:
- Very bright white-blue central light.
- Pulsating energy.
- Strong bloom and glow.

Layer 2 – Inner Vortex:
- Multiple rotating concentric energy rings.
- Swirling blue and purple energy.
- Dynamic radial motion.
- Distorted space-like appearance.

Layer 3 – Cosmic Nebula:
- Purple and blue animated nebula clouds.
- Volumetric-looking energy formations.
- Subtle glowing gradients.

Layer 4 – Outer Energy Rings:
- Several independently rotating rings.
- Different rotation speeds and directions.
- Glowing cyan and violet edges.
- Small electric arcs around the circumference.

Layer 5 – Particle Field:
- Hundreds or thousands of animated particles, optimized for performance.
- Particles spiralling toward the centre.
- Depth-based particle sizes.
- Small glowing stars and sparks.

Layer 6 – Depth and Vortex:
- Create the illusion of a deep tunnel extending into another dimension.
- Use layered rings with different sizes, positions, brightness and speeds.
- Add a subtle radial distortion or swirling shader effect where practical.

PORTAL INTERACTION:

- The portal must remain controlled by the user's two hands.
- Both hands should determine the portal's position.
- Moving hands apart should expand the portal.
- Moving hands closer should shrink it.
- Moving both hands should reposition the portal.
- Hand rotation or coordinated movement should influence its rotation.
- Bringing hands together should trigger a closing animation.
- Opening the hands again should allow the portal to reopen.

VISUAL QUALITY:

The portal should look like a cinematic science-fiction dimensional gateway, not a flat green circle or simple CSS gradient.

The uploaded image is the primary visual reference for the portal's appearance.

# ISSUE 6 – FIX MULTI-HAND TRACKING ARCHITECTURE

Inspect the existing MediaPipe implementation.

Ensure:

- numHands is configured to detect two hands.
- Both hand landmark arrays are processed during every detection frame.
- Each hand has independent gesture recognition.
- Each hand has independent visual effect state.
- Hand identities are handled consistently using MediaPipe handedness information and temporal tracking.
- Do not assume the first detected hand is always the left hand.
- Account for mirrored webcam display.
- Ensure each hand's effect is associated with the correct tracked hand.
- Handle temporary hand detection loss.
- Prevent one hand from overwriting the other hand's effect state.

Use separate effect instances or stable hand identifiers.

For example:

leftHand:
- landmark data
- gesture
- energy orb
- lightning
- projectile
- depth scale

rightHand:
- landmark data
- gesture
- energy orb
- lightning
- projectile
- depth scale

Avoid using a single global effect position or a single global gesture variable for both hands.

# ISSUE 7 – PERFORMANCE AND COMPATIBILITY

- Preserve the existing camera implementation.
- Preserve existing Stage 3 and Stage 4 functionality.
- Avoid unnecessary React re-renders.
- Use efficient Canvas or Three.js rendering.
- Optimize particle counts.
- Reuse particle systems where possible.
- Smooth hand position and scale changes.
- Clean up animation loops and GPU resources.
- Avoid memory leaks.
- Ensure acceptable performance on an ordinary laptop.

# ISSUE 8 – TESTING

Test each feature independently.

TEST A – ENERGY ORB:
1. Open left palm.
2. Verify left orb appears.
3. Open right palm.
4. Verify right orb appears independently.
5. Open both palms.
6. Verify two separate orbs appear.
7. Move one hand toward the camera.
8. Verify only its orb grows proportionally.
9. Move that hand away.
10. Verify its orb shrinks.

TEST B – LIGHTNING:
1. Point left index finger.
2. Verify lightning originates from the left fingertip.
3. Point right index finger.
4. Verify lightning originates from the right fingertip.
5. Point both fingers.
6. Verify both produce lightning simultaneously.
7. Test the lightning connection between hands.

TEST C – ENERGY BLAST:
1. Charge with the left hand and release.
2. Charge with the right hand and release.
3. Charge and release both hands together.
4. Verify separate projectile origins and animations.

TEST D – PORTAL:
1. Activate the portal using both hands.
2. Verify the cosmic vortex appears.
3. Move hands apart and together.
4. Verify portal size changes smoothly.
5. Move hands and verify the portal responds.
6. Verify the closing animation works.

# FINAL REQUIREMENTS

Implement these fixes incrementally.

First fix independent two-hand effect handling.

Then implement depth-aware orb scaling.

Finally redesign the dimensional portal.

Preserve the existing interface and all working functionality.

Do not declare a feature complete unless it has been implemented and tested.

After completion, provide:
- Summary of changes.
- Files modified.
- New dependencies, if any.
- Known limitations.
- Testing instructions for each feature.