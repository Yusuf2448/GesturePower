# STAGE 4 – ADVANCED SUPERPOWERS AND IMMERSIVE VISUAL EFFECTS

We are continuing development of GesturePower – Superpower Simulator.

The existing application has:
- React + Vite frontend.
- Futuristic gaming interface.
- Real webcam integration.
- MediaPipe hand tracking.
- 21 hand landmarks per hand.
- Basic gesture recognition.
- Basic superpower visual effects from Stage 3.

IMPORTANT:
Do not rebuild the application from scratch.
Do not remove or break existing working features.
First inspect the entire existing codebase and understand its architecture before making changes.

Our objective is to transform GesturePower into an advanced interactive superpower simulator.

# 1. ADVANCED ENERGY ORB MANIPULATION

Upgrade the existing Energy Orb.

Features:
- Allow the user to control the orb using actual hand movements.
- The orb must follow the palm smoothly.
- Moving the hand upward should move the orb upward.
- Moving the hand sideways should move the orb sideways.
- Use hand rotation to rotate the energy rings.
- Increase orb size when the user holds an open palm.
- Add swirling energy particles.
- Add multiple rotating energy rings.
- Add a bright animated core and outer glow.
- Add realistic particle trails.

# 2. TWO-HAND ENERGY COLLISION

Implement an interactive two-hand energy manipulation system.

Gestures:
- Detect both hands simultaneously.
- Display a small energy sphere between the two palms.
- When hands move apart, gradually expand the sphere.
- When hands move closer, compress the sphere.
- When hands rotate, animate the surrounding energy rings.
- When both hands move rapidly toward each other, trigger an energy collision.
- When both hands push outward, release a large energy blast.

Visual effects:
- Bright energy sphere.
- Expanding shockwave.
- Particle explosion.
- Lightning surrounding the sphere.
- Glowing energy trails.
- Screen shake during the blast.

The effect must use actual tracked hand positions and distances.

# 3. ENERGY SHIELD

Create a new superpower called Energy Shield.

Activation:
- Detect both open palms facing toward the camera.
- Require the gesture to remain stable briefly before activation.

Features:
- Generate a large translucent futuristic energy shield in front of the user.
- Position it using both hands.
- Adjust shield size based on the distance between the hands.
- Add hexagonal energy patterns.
- Add glowing blue borders.
- Add animated waves across the shield.
- Add particle effects when the shield is activated.
- Close both hands to deactivate the shield.

# 4. MAGIC PORTAL

Create a new superpower called Dimensional Portal.

Activation:
- Detect both hands.
- Activate when the user holds their hands apart in the configured portal gesture.

Features:
- Create a large circular magical portal between the hands.
- Adjust portal diameter according to hand distance.
- Rotate the portal using hand movement.
- Add multiple rotating energy rings.
- Add a swirling particle vortex.
- Add a glowing central dimensional effect.
- Animate the portal opening and closing.
- Bring hands together to collapse the portal.

The portal should look like a futuristic dimensional gateway.

# 5. ADVANCED LIGHTNING STORM

Upgrade the existing Lightning Storm.

Features:
- Generate branching electrical arcs from fingertips.
- Allow lightning to travel between both hands.
- Add multiple electric branches.
- Add glowing sparks and particles.
- Add animated electric pulses.
- Allow the user to control lightning direction by moving their hands.
- Add temporary bright flashes when lightning is triggered.

Lightning must originate from actual hand and fingertip coordinates.

# 6. CINEMATIC VISUAL EFFECTS ENGINE

Create a reusable visual effects system.

Implement:
- Shockwave animations.
- Particle explosions.
- Energy trails.
- Glowing particles.
- Screen shake.
- Flash effects.
- Expanding energy rings.
- Smooth power transitions.
- Animated energy bursts.

Use Three.js, Canvas and existing dependencies where appropriate.

If using WebGL post-processing, implement bloom only if it improves visual quality and performance.

Do not add unnecessary dependencies.

# 7. ADVANCED POWER SELECTOR

Extend the existing power selection panel.

Add these selectable powers:
1. Energy Orb
2. Lightning Storm
3. Energy Projectile
4. Energy Blast
5. Energy Shield
6. Dimensional Portal
7. Two-Hand Energy Collision

Each power must have:
- Unique icon.
- Name.
- Short description.
- Activation gesture.
- Active/inactive state.

Selecting a power must actually activate its corresponding effect system.

# 8. GESTURE RECOGNITION IMPROVEMENTS

Improve gesture recognition for two-hand interactions.

Requirements:
- Track two hands independently.
- Identify left and right hands where possible.
- Calculate distance between hands.
- Detect hand movement direction.
- Detect stable gestures before activation.
- Add gesture cooldowns.
- Prevent accidental repeated activations.
- Smooth landmark positions.
- Handle cases where one hand disappears from the camera.

Avoid triggering multiple powers simultaneously unless explicitly intended.

# 9. USER INTERFACE

Preserve the existing futuristic interface and visual identity.

Improve the HUD to display:
- Current active power.
- Detected gestures for each hand.
- Number of detected hands.
- Current power charge.
- Energy level.
- Effect activation status.
- Camera status.
- FPS.

Add a power activation animation and subtle visual feedback when a gesture is recognized.

# 10. PERFORMANCE AND CODE QUALITY

- Preserve existing webcam and MediaPipe functionality.
- Reuse existing components and hooks.
- Keep gesture detection separate from rendering.
- Avoid unnecessary React re-renders.
- Use requestAnimationFrame efficiently.
- Clean up animation loops and WebGL resources.
- Optimize particle counts for ordinary laptops.
- Handle missing or temporarily lost hands gracefully.
- Ensure the application remains responsive.
- Avoid memory leaks.

# 11. TESTING REQUIREMENTS

Test every new feature independently.

Verify:
1. Energy orb follows actual hand movement.
2. Both hands control the energy sphere.
3. Hand collision triggers an energy blast.
4. Energy shield activates and deactivates correctly.
5. Portal opens, expands, rotates and closes.
6. Lightning travels between tracked hands.
7. Power selector switches between actual effects.
8. Existing Stage 3 powers continue working.

Do not claim a feature works unless it has actually been implemented and tested.

Fix all compilation errors and runtime errors.

# FINAL INSTRUCTION

Implement Stage 4 incrementally.

First implement two-hand tracking and energy manipulation.

Then implement Energy Shield.

Then implement Dimensional Portal.

Then upgrade Lightning Storm and add cinematic effects.

Finally integrate everything into the existing power selector and HUD.

Do not use prerecorded videos, fake hand movements or randomly positioned effects.

All interactions must respond to actual webcam hand tracking.

At completion, provide a summary of modified files, implemented features, known limitations and exact testing instructions.