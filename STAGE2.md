# STAGE 2 – REAL WEBCAM AND MEDIAPIPE HAND TRACKING

We are continuing development of GesturePower – Superpower Simulator.

The existing React application and futuristic interface are already created. Preserve the existing design and components. Do not rebuild the application from scratch.

## Objective

Replace the simulated camera feed with a fully functional real-time webcam and hand tracking system.

## 1. Real webcam integration

- Use the browser's navigator.mediaDevices.getUserMedia() API.
- Request webcam video permission.
- Display the actual live webcam feed inside the existing camera preview area.
- Add functional Start Camera and Stop Camera controls.
- Display camera status: OFF, INITIALIZING, LIVE or ERROR.
- Handle permission denied, unavailable camera and other errors.
- Stop all camera tracks when the camera is disabled or the component unmounts.

## 2. MediaPipe hand tracking

Use @mediapipe/tasks-vision and the HandLandmarker solution.

Requirements:
- Detect up to two hands simultaneously.
- Track all 21 landmarks per hand.
- Run detection continuously using requestAnimationFrame.
- Use GPU acceleration when available, with a fallback if necessary.
- Properly initialize and clean up the MediaPipe resources.
- Load the actual hand landmark model, not simulated data.

## 3. Hand landmark visualization

Draw the following over the live camera feed:

- 21 visible tracking points.
- Connections between finger joints.
- Palm connections.
- Different colors for different hands.
- Smooth tracking without excessive flickering.

Use a transparent Canvas overlay positioned above the video.

## 4. Gesture recognition

Implement basic gesture recognition using actual hand landmarks.

Recognize:
- Open Palm
- Closed Fist
- Index Finger Pointing
- Pinch
- Two Hands Detected

Display the currently detected gesture in the HUD.

## 5. Interface integration

Keep the existing futuristic UI.

Replace all simulated camera status indicators with real camera status.

Update the existing CameraPreview component and related components instead of creating duplicate interfaces.

The camera must open only when the user clicks START CAMERA or START EXPERIENCE.

## 6. Technical requirements

- Use React hooks correctly.
- Avoid unnecessary camera initialization.
- Handle asynchronous loading and errors.
- Prevent memory leaks.
- Keep hand tracking separate from UI components.
- Use real webcam frames for all detection.
- Do not use prerecorded videos, placeholder images or fake tracking coordinates.

## 7. Testing

After implementation:

1. Install any missing dependencies.
2. Run the application.
3. Verify that the actual webcam opens.
4. Verify that hand landmarks follow real hand movements.
5. Verify that gestures change when the user changes hand positions.
6. Fix compilation errors and runtime errors.

Finally, explain how to test the camera and gestures.

IMPORTANT: Do not implement the energy orb or other superpower effects yet. First make real webcam access and hand tracking work reliably.