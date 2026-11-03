import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, Cpu, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// Hand landmark connections according to MediaPipe Hands specification
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle finger
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring finger
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm base connections
  [5, 9], [9, 13], [13, 17]
];

// Helper to calculate distance between two points
const distance = (p1, p2) => {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
};

// Gesture recognition logic based on 21 landmarks
const recognizeGesture = (landmarks) => {
  if (!landmarks || landmarks.length !== 21) return 'Unknown';

  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const indexMcp = landmarks[5];
  const middleMcp = landmarks[9];
  const ringMcp = landmarks[13];
  const pinkyMcp = landmarks[17];

  const indexExt = distance(wrist, indexTip) > distance(wrist, indexMcp) * 1.3;
  const middleExt = distance(wrist, middleTip) > distance(wrist, middleMcp) * 1.3;
  const ringExt = distance(wrist, ringTip) > distance(wrist, ringMcp) * 1.3;
  const pinkyExt = distance(wrist, pinkyTip) > distance(wrist, pinkyMcp) * 1.3;

  const pinchDist = distance(thumbTip, indexTip);
  const isPinch = pinchDist < 0.05;

  if (isPinch) return 'Pinch';
  if (indexExt && middleExt && ringExt && pinkyExt) return 'Open Palm';
  if (!indexExt && !middleExt && !ringExt && !pinkyExt) return 'Closed Fist';
  if (indexExt && !middleExt && !ringExt && !pinkyExt) return 'Index Finger Pointing';

  return 'Open Palm';
};

const CameraPreview = ({ isCameraActive, onToggleCamera, selectedPower, onGestureUpdate, onHandCountUpdate }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState('OFF');
  const [errorMessage, setErrorMessage] = useState('');
  const [effectsEnabled, setEffectsEnabled] = useState(true);

  const handLandmarkerRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  // Projectile state refs for smooth animation across frames
  const projectilesRef = useRef([]); // {x, y, vx, vy, radius, color, alpha, handId}
  const blastShockwavesRef = useRef([]); // {x, y, radius, maxRadius, color, alpha, handId}
  const prevWristPosRef = useRef({}); // {handId: {x, y}} For push / blast detection

  // Two-hand state refs - track each hand independently
  const handStatesRef = useRef({}); // {handIndex: {x, y, landmarkData, gesture, lastUpdate, depthInfo}}

  // Depth tracking refs
  const referenceHandSizesRef = useRef({}); // {handId: {palmSize, depthReference}}
  const currentHandDepthsRef = useRef({}); // {handId: {depth, palmSize}}

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    let isMounted = true;
    const initMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        if (!isMounted) return;

        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });

        if (isMounted) {
          handLandmarkerRef.current = landmarker;
        }
      } catch (err) {
        console.error("Failed to initialize MediaPipe HandLandmarker with GPU:", err);
        try {
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
          );
          if (!isMounted) return;
          const landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
              delegate: "CPU"
            },
            runningMode: "VIDEO",
            numHands: 2
          });
          if (isMounted) {
            handLandmarkerRef.current = landmarker;
          }
        } catch (cpuErr) {
          console.error("CPU fallback also failed:", cpuErr);
        }
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  // Handle webcam stream start/stop
  useEffect(() => {
    let currentStream = null;

    const startCamera = async () => {
      if (!isCameraActive) return;

      setCameraStatus('INITIALIZING');
      setErrorMessage('');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        });

        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraStatus('LIVE');
        }
      } catch (err) {
        console.error("Webcam access error:", err);
        setCameraStatus('ERROR');
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setErrorMessage('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setErrorMessage('No webcam device found connected to your system.');
        } else {
          setErrorMessage(`Could not start webcam: ${err.message || 'Unknown error'}`);
        }
      }
    };

    if (isCameraActive) {
      startCamera();
    } else {
      setCameraStatus('OFF');
      if (onGestureUpdate) onGestureUpdate('None');
      if (onHandCountUpdate) onHandCountUpdate(0);
      // Clear hand states when camera stops
      handStatesRef.current = {};
      referenceHandSizesRef.current = {};
      currentHandDepthsRef.current = {};
      prevWristPosRef.current = {};
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, onGestureUpdate, onHandCountUpdate]);

  // Detection loop and real-time superpower effects rendering using Canvas & requestAnimationFrame
  const runDetection = useCallback(() => {
    if (!isCameraActive || cameraStatus !== 'LIVE') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = handLandmarkerRef.current;

    if (video && canvas && landmarker && video.readyState >= 2) {
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        try {
          const startTimeMs = performance.now();
          const results = landmarker.detectForVideo(video, startTimeMs);

          const handCount = results.landmarks ? results.landmarks.length : 0;
          if (onHandCountUpdate) {
            onHandCountUpdate(handCount);
          }

          if (handCount > 0) {
            // Track each hand independently
            const updatedHandStates = {};

            results.landmarks.forEach((landmarks, handIndex) => {
              const detectedGesture = recognizeGesture(landmarks);
              const palmCenter = landmarks[0];
              const currentPos = {
                x: palmCenter.x * canvas.width,
                y: palmCenter.y * canvas.height
              };

              // Calculate palm size for depth tracking
              const indexMcp = landmarks[5];
              const pinkyMcp = landmarks[17];
              const palmSize = distance(indexMcp, pinkyMcp);

              // Initialize reference size if not set
              if (!referenceHandSizesRef.current[handIndex]) {
                referenceHandSizesRef.current[handIndex] = {
                  palmSize: palmSize,
                  referenceTime: performance.now()
                };
              }

              updatedHandStates[handIndex] = {
                x: currentPos.x,
                y: currentPos.y,
                landmarks: landmarks,
                gesture: detectedGesture,
                lastUpdate: performance.now(),
                palmSize: palmSize,
                wristPos: currentPos
              };

              // Update depth tracking
              if (referenceHandSizesRef.current[handIndex]) {
                const refSize = referenceHandSizesRef.current[handIndex].palmSize;
                const sizeRatio = refSize > 0 ? palmSize / refSize : 1.0;
                // Depth multiplier: larger palm = closer = larger orb
                const depthMultiplier = Math.max(0.5, Math.min(2.0, sizeRatio));
                currentHandDepthsRef.current[handIndex] = {
                  depthMultiplier: depthMultiplier,
                  palmSize: palmSize,
                  sizeRatio: sizeRatio
                };
              }
            });

            handStatesRef.current = updatedHandStates;

            // Clean up old hand states
            Object.keys(handStatesRef.current).forEach(handIndex => {
              if (!(handIndex in updatedHandStates)) {
                delete referenceHandSizesRef.current[handIndex];
                delete currentHandDepthsRef.current[handIndex];
              }
            });

            // Determine overall gesture status
            const handGesturesForHud = Object.values(handStatesRef.current).map(s => s.gesture);
            let gestureDisplayForHud = 'Waiting for Hand';
            if (handGesturesForHud.length > 0) {
              gestureDisplayForHud = handGesturesForHud.length > 1
                ? `${handGesturesForHud[0]} + ${handGesturesForHud[1]}`
                : handGesturesForHud[0];
            }
            if (onGestureUpdate) {
              onGestureUpdate(gestureDisplayForHud);
            }

            // 1. Draw Hand Landmarks & Connections
            results.landmarks.forEach((landmarks, index) => {
              const handColor = index === 0 ? selectedPower.color : '#00f0ff';
              const secondaryColor = index === 0 ? '#ffffff' : '#9d4edd';

              ctx.lineWidth = 3;
              ctx.strokeStyle = handColor;
              HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
                const start = landmarks[startIdx];
                const end = landmarks[endIdx];
                ctx.beginPath();
                ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
                ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
                ctx.stroke();
              });

              landmarks.forEach((landmark, ptIdx) => {
                const x = landmark.x * canvas.width;
                const y = landmark.y * canvas.height;
                ctx.beginPath();
                ctx.arc(x, y, ptIdx === 4 || ptIdx === 8 || ptIdx === 12 || ptIdx === 16 || ptIdx === 20 ? 6 : 4, 0, 2 * Math.PI);
                ctx.fillStyle = ptIdx === 0 ? '#ff007f' : secondaryColor;
                ctx.fill();
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = '#000000';
                ctx.stroke();
              });
            });

            // 2. Render Superpower Effects if Enabled
            if (effectsEnabled) {
              // Process effects for each hand independently
              results.landmarks.forEach((landmarks, handIndex) => {
                const gesture = recognizeGesture(landmarks);
                const wrist = landmarks[0];
                const currentPos = { x: wrist.x * canvas.width, y: wrist.y * canvas.height };
                const indexTip = landmarks[8];
                const thumbTip = landmarks[4];

                // Track previous position for velocity
                if (!prevWristPosRef.current[handIndex]) {
                  prevWristPosRef.current[handIndex] = { x: currentPos.x, y: currentPos.y };
                }

                const prevWristPos = prevWristPosRef.current[handIndex];
                const dx = currentPos.x - prevWristPos.x;
                const dy = currentPos.y - prevWristPos.y;
                const pushVelocity = Math.hypot(dx, dy);

                // Update previous position
                prevWristPosRef.current[handIndex] = { x: currentPos.x, y: currentPos.y };

                // Hand-specific blast/shockwave detection
                if (pushVelocity > 45 && gesture === 'Closed Fist' && selectedPower.id === 'blast') {
                  blastShockwavesRef.current.push({
                    x: currentPos.x,
                    y: currentPos.y,
                    radius: 20,
                    maxRadius: Math.max(canvas.width, canvas.height) * 0.6,
                    color: selectedPower.color,
                    alpha: 1.0,
                    handId: handIndex
                  });
                }

                    // Single Hand Superpowers
                // Energy Orb with depth scaling
                if (selectedPower.id === 'orb' && gesture === 'Open Palm') {
                  const orbX = currentPos.x;
                  const orbY = currentPos.y - 60;
                  const time = performance.now() * 0.003 + handIndex * Math.PI;
                  const depthScale = currentHandDepthsRef.current[handIndex]?.depthMultiplier || 1.0;
                  const radius = (55 + Math.sin(time * 3) * 8) * depthScale;

                  ctx.save();
                  const gradient = ctx.createRadialGradient(orbX, orbY, 5, orbX, orbY, radius * 1.8);
                  gradient.addColorStop(0, selectedPower.color);
                  gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.4)');
                  gradient.addColorStop(1, 'transparent');

                  ctx.fillStyle = gradient;
                  ctx.beginPath();
                  ctx.arc(orbX, orbY, radius * 1.8, 0, Math.PI * 2);
                  ctx.fill();

                  ctx.fillStyle = '#ffffff';
                  ctx.beginPath();
                  ctx.arc(orbX, orbY, radius * 0.4, 0, Math.PI * 2);
                  ctx.fill();

                  ctx.strokeStyle = selectedPower.color;
                  ctx.lineWidth = 3 * depthScale;
                  ctx.beginPath();
                  ctx.arc(orbX, orbY, radius, time, time + Math.PI * 1.5);
                  ctx.stroke();

                  // Energy rings
                  for (let ring = 0; ring < 3; ring++) {
                    const ringRadius = radius + ring * 20;
                    ctx.lineWidth = 2 * depthScale;
                    ctx.beginPath();
                    ctx.arc(orbX, orbY, ringRadius, time * (1 + ring * 0.5), time * (1 + ring * 0.5) + Math.PI);
                    ctx.stroke();
                  }

                  // Floating particles
                  for (let i = 0; i < 8; i++) {
                    const angle = time * 2 + (i * Math.PI / 4) + handIndex * Math.PI * 2;
                    const px = orbX + Math.cos(angle) * (radius * 1.3);
                    const py = orbY + Math.sin(angle) * (radius * 1.3);
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(px, py, 3 * depthScale, 0, Math.PI * 2);
                    ctx.fill();
                  }

                  // Electric arcs
                  ctx.strokeStyle = '#00ffff';
                  ctx.lineWidth = 1 * depthScale;
                  ctx.shadowColor = '#00ffff';
                  ctx.shadowBlur = 10;
                  for (let i = 0; i < 3; i++) {
                    const arcAngle = time * 3 + (i * Math.PI * 2 / 3) + handIndex * Math.PI;
                    const startX = orbX + Math.cos(arcAngle) * radius * 0.6;
                    const startY = orbY + Math.sin(arcAngle) * radius * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    for (let j = 0; j < 3; j++) {
                      ctx.lineTo(
                        startX + (Math.random() - 0.5) * 20 * depthScale,
                        startY + (Math.random() - 0.5) * 20 * depthScale
                      );
                    }
                    ctx.stroke();
                  }
                  ctx.restore();
                }

                // Lightning Storm per-hand
                if (selectedPower.id === 'lightning' && gesture === 'Index Finger Pointing') {
                  const tipX = indexTip.x * canvas.width;
                  const tipY = indexTip.y * canvas.height;
                  const time = performance.now() * 0.001 + handIndex * Math.PI;

                  ctx.save();
                  ctx.strokeStyle = selectedPower.color;
                  ctx.lineWidth = 3;
                  ctx.shadowColor = selectedPower.color;
                  ctx.shadowBlur = 15;

                  for (let arc = 0; arc < 3; arc++) {
                    ctx.beginPath();
                    ctx.moveTo(tipX, tipY);
                    let currX = tipX;
                    let currY = tipY;
                    for (let seg = 0; seg < 5; seg++) {
                      currX += (Math.random() - 0.5) * 60 * Math.sin(time + arc);
                      currY += (Math.random() - 0.5) * 60 * Math.cos(time + arc) - 30;
                      ctx.lineTo(currX, currY);
                    }
                    ctx.stroke();
                  }

                  // Electric sparks
                  ctx.fillStyle = '#ffffff';
                  for (let i = 0; i < 8; i++) {
                    const angle = time * 5 + i * Math.PI * 2 / 8;
                    const sparkX = tipX + Math.cos(angle) * 30;
                    const sparkY = tipY + Math.sin(angle) * 30;
                    ctx.beginPath();
                    ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
                    ctx.fill();
                  }
                  ctx.restore();
                }

                // Energy Projectile per-hand
                if (selectedPower.id === 'laser' && gesture === 'Pinch') {
                  const pinchX = ((thumbTip.x + indexTip.x) / 2) * canvas.width;
                  const pinchY = ((thumbTip.y + indexTip.y) / 2) * canvas.height;
                  const time = performance.now() * 0.01;

                  ctx.save();
                  ctx.fillStyle = selectedPower.color;
                  ctx.shadowColor = selectedPower.color;
                  ctx.shadowBlur = 20;
                  ctx.beginPath();
                  ctx.arc(pinchX, pinchY, 20 + Math.sin(time) * 4, 0, Math.PI * 2);
                  ctx.fill();

                  // Charge effect
                  ctx.strokeStyle = '#ffffff';
                  ctx.lineWidth = 2;
                  for (let ring = 0; ring < 3; ring++) {
                    const ringRadius = (time * 20 + ring * 15) % 60;
                    ctx.globalAlpha = Math.max(0, 1 - ringRadius / 60);
                    ctx.beginPath();
                    ctx.arc(pinchX, pinchY, ringRadius, 0, Math.PI * 2);
                    ctx.stroke();
                  }
                  ctx.restore();

                  // Shoot projectiles
                  if (Math.random() < 0.1) {
                    projectilesRef.current.push({
                      x: pinchX,
                      y: pinchY,
                      vx: (Math.random() - 0.5) * 4,
                      vy: -15 - Math.random() * 5,
                      radius: 6,
                      color: selectedPower.color,
                      alpha: 1.0,
                      handId: handIndex
                    });
                  }
                }

                // Energy Blast (Closed Fist) per-hand
                if ((selectedPower.id === 'blast' || selectedPower.id === 'orb') && gesture === 'Closed Fist') {
                  const time = performance.now() * 0.005 + handIndex * Math.PI;

                  ctx.save();
                  ctx.strokeStyle = selectedPower.color;
                  ctx.lineWidth = 2;
                  ctx.shadowColor = selectedPower.color;
                  ctx.shadowBlur = 15;

                  // Expanding rings
                  for (let ring = 0; ring < 3; ring++) {
                    const ringRadius = (time * 40 + ring * 30) % 120;
                    ctx.globalAlpha = Math.max(0, 1 - ringRadius / 120);
                    ctx.beginPath();
                    ctx.arc(currentPos.x, currentPos.y, ringRadius, 0, Math.PI * 2);
                    ctx.stroke();
                  }

                  // Energy particles
                  ctx.fillStyle = '#ffffff';
                  for (let i = 0; i < 12; i++) {
                    const angle = time * 3 + i * Math.PI * 2 / 12;
                    const px = currentPos.x + Math.cos(angle) * 30;
                    const py = currentPos.y + Math.sin(angle) * 30;
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fill();
                  }
                  ctx.restore();
                }
              });

              // Two Hands Superpowers - Process at end for both hands
              if (handCount >= 2) {
                const hand1 = results.landmarks[0][0];
                const hand2 = results.landmarks[1][0];
                const p1 = { x: hand1.x * canvas.width, y: hand1.y * canvas.height };
                const p2 = { x: hand2.x * canvas.width, y: hand2.y * canvas.height };
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;
                const handsDist = distance(p1, p2);

                // Energy Shield
                if (selectedPower.id === 'shield') {
                  ctx.save();
                  const shieldRadius = Math.max(80, handsDist * 0.8);
                  ctx.strokeStyle = selectedPower.color;
                  ctx.lineWidth = 4;
                  ctx.shadowColor = selectedPower.color;
                  ctx.shadowBlur = 25;

                  ctx.beginPath();
                  for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3 + performance.now() * 0.001;
                    const hx = midX + Math.cos(angle) * shieldRadius;
                    const hy = midY + Math.sin(angle) * shieldRadius;
                    if (i === 0) ctx.moveTo(hx, hy);
                    else ctx.lineTo(hx, hy);
                  }
                  ctx.closePath();
                  ctx.fillStyle = 'rgba(0, 114, 255, 0.2)';
                  ctx.fill();
                  ctx.stroke();

                  ctx.beginPath();
                  ctx.arc(midX, midY, shieldRadius * 0.6, 0, Math.PI * 2);
                  ctx.strokeStyle = '#ffffff';
                  ctx.stroke();
                  ctx.restore();
                }

                // Advanced Dimensional Portal
                if (selectedPower.id === 'portal') {
                  ctx.save();
                  const portalRadius = Math.max(60, handsDist * 0.6);
                  const time = performance.now() * 0.003;

                  // Cosmic dimensional portal with multiple layers
                  // Layer 1: Central Core
                  const coreGrad = ctx.createRadialGradient(midX, midY, 0, midX, midY, portalRadius * 0.3);
                  coreGrad.addColorStop(0, '#ffffff');
                  coreGrad.addColorStop(0.3, '#c0a0ff');
                  coreGrad.addColorStop(1, 'transparent');
                  ctx.fillStyle = coreGrad;
                  ctx.beginPath();
                  ctx.arc(midX, midY, portalRadius * 0.3, 0, Math.PI * 2);
                  ctx.fill();

                  // Layer 2: Inner Vortex Rings
                  for (let i = 0; i < 5; i++) {
                    const ringRadius = portalRadius * (0.2 + i * 0.15);
                    ctx.strokeStyle = `rgba(100, 200, 255, ${0.3 - i * 0.05})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(midX + Math.sin(time + i) * 20, midY + Math.cos(time + i) * 20, ringRadius, 0, Math.PI * 2);
                    ctx.stroke();
                  }

                  // Layer 3: Nebula clouds
                  const nebulaGrad = ctx.createRadialGradient(midX, midY, portalRadius * 0.5, midX, midY, portalRadius);
                  nebulaGrad.addColorStop(0, 'rgba(150, 100, 255, 0.2)');
                  nebulaGrad.addColorStop(0.5, 'rgba(100, 150, 255, 0.1)');
                  nebulaGrad.addColorStop(1, 'transparent');
                  ctx.fillStyle = nebulaGrad;
                  ctx.beginPath();
                  ctx.arc(midX, midY, portalRadius, 0, Math.PI * 2);
                  ctx.fill();

                  // Layer 4: Outer Energy Rings
                  for (let i = 0; i < 3; i++) {
                    const ringRadius = portalRadius * (1 - i * 0.2);
                    ctx.strokeStyle = i === 0 ? '#00ffff' : i === 1 ? '#9933ff' : '#6633ff';
                    ctx.lineWidth = 3;
                    ctx.shadowColor = ctx.strokeStyle;
                    ctx.shadowBlur = 15;
                    ctx.beginPath();
                    ctx.arc(midX, midY, ringRadius, time * (1 + i * 0.3), time * (1 + i * 0.3) + Math.PI * 2);
                    ctx.stroke();
                  }

                  // Layer 5: Particle Field
                  for (let i = 0; i < 20; i++) {
                    const particleAngle = time * 2 + i * Math.PI * 2 / 20;
                    const particleRadius = portalRadius * (0.3 + 0.7 * Math.sin(time + i));
                    const px = midX + Math.cos(particleAngle) * particleRadius;
                    const py = midY + Math.sin(particleAngle) * particleRadius;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fill();
                  }
                  ctx.restore();
                }

                // Two-Hand Energy Collision
                if (selectedPower.id === 'collision') {
                  ctx.save();
                  const sphereRadius = Math.max(20, 150 - handsDist * 0.5);
                  ctx.fillStyle = '#ffffff';
                  ctx.shadowColor = selectedPower.color;
                  ctx.shadowBlur = 30;

                  ctx.beginPath();
                  ctx.arc(midX, midY, sphereRadius, 0, Math.PI * 2);
                  ctx.fill();

                  ctx.strokeStyle = selectedPower.color;
                  ctx.lineWidth = 3;
                  ctx.beginPath();
                  ctx.moveTo(p1.x, p1.y);
                  ctx.lineTo(midX + (Math.random() - 0.5) * 40, midY + (Math.random() - 0.5) * 40);
                  ctx.lineTo(p2.x, p2.y);
                  ctx.stroke();
                  ctx.restore();
                }

                // Lightning connection between hands
                if (selectedPower.id === 'lightning') {
                  const hand1Gesture = recognizeGesture(results.landmarks[0]);
                  const hand2Gesture = recognizeGesture(results.landmarks[1]);

                  if (hand1Gesture === 'Index Finger Pointing' && hand2Gesture === 'Index Finger Pointing') {
                    ctx.save();
                    ctx.strokeStyle = selectedPower.color;
                    ctx.lineWidth = 3;
                    ctx.shadowColor = selectedPower.color;
                    ctx.shadowBlur = 30;

                    // Multiple branching paths
                    for (let branch = 0; branch < 3; branch++) {
                      ctx.beginPath();
                      ctx.moveTo(p1.x, p1.y);
                      let currX = p1.x;
                      let currY = p1.y;
                      for (let seg = 0; seg < 6; seg++) {
                        const midX = currX + (p2.x - currX) * 0.3 + (Math.random() - 0.5) * 60;
                        const midY = currY + (p2.y - currY) * 0.3 + (Math.random() - 0.5) * 60;
                        ctx.lineTo(midX, midY);
                        currX = midX;
                        currY = midY;
                      }
                      ctx.lineTo(p2.x, p2.y);
                      ctx.stroke();
                    }
                    ctx.restore();
                  }
                }
              }
            }

            // Render active Projectiles
            projectilesRef.current.forEach((proj, idx) => {
              proj.x += proj.vx;
              proj.y += proj.vy;
              proj.alpha -= 0.02;

              ctx.save();
              ctx.globalAlpha = Math.max(0, proj.alpha);
              ctx.fillStyle = proj.color;
              ctx.shadowColor = proj.color;
              ctx.shadowBlur = 12;
              ctx.beginPath();
              ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              if (proj.alpha <= 0 || proj.y < 0 || proj.x < 0 || proj.x > canvas.width) {
                projectilesRef.current.splice(idx, 1);
              }
            });

            // Render Blast Shockwaves
            blastShockwavesRef.current.forEach((shock, idx) => {
              shock.radius += 18;
              shock.alpha -= 0.03;

              ctx.save();
              ctx.globalAlpha = Math.max(0, shock.alpha);
              ctx.strokeStyle = shock.color;
              ctx.lineWidth = 4;
              ctx.shadowColor = shock.color;
              ctx.shadowBlur = 20;
              ctx.beginPath();
              ctx.arc(shock.x, shock.y, shock.radius, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();

              if (shock.alpha <= 0 || shock.radius >= shock.maxRadius) {
                blastShockwavesRef.current.splice(idx, 1);
              }
            });

            // Update final gesture status for HUD display
            const handGestures = Object.values(handStatesRef.current).map(s => s.gesture);
            let gestureDisplay = 'Waiting for Hand';
            if (handGestures.length > 0) {
              gestureDisplay = handGestures.length > 1
                ? `${handGestures[0]} + ${handGestures[1]}`
                : handGestures[0];
            }
            if (onGestureUpdate) {
              onGestureUpdate(gestureDisplay);
            }

            // Clean up stale hand states
            const currentTime = performance.now();
            Object.keys(handStatesRef.current).forEach(handIndex => {
              const handState = handStatesRef.current[handIndex];
              if (currentTime - handState.lastUpdate > 1000) {
                delete handStatesRef.current[handIndex];
                delete referenceHandSizesRef.current[handIndex];
                delete currentHandDepthsRef.current[handIndex];
              }
            });

          } else {
            if (onGestureUpdate) onGestureUpdate('Waiting for Hand');
          }
        } catch (err) {
          console.error("Hand detection & effects error:", err);
        }
      }
    }

    animationFrameIdRef.current = requestAnimationFrame(runDetection);
  }, [isCameraActive, cameraStatus, selectedPower, effectsEnabled, onGestureUpdate, onHandCountUpdate]);

  useEffect(() => {
    if (cameraStatus === 'LIVE') {
      animationFrameIdRef.current = requestAnimationFrame(runDetection);
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [cameraStatus, runDetection]);

  return (
    <div className="camera-container glass-panel">
      {/* Corner Sci-Fi Frames */}
      <div className="hud-corner top-left"></div>
      <div className="hud-corner top-right"></div>
      <div className="hud-corner bottom-left"></div>
      <div className="hud-corner bottom-right"></div>

      {/* Crosshair target overlay when offline */}
      {!isCameraActive && (
        <div className="cam-crosshair">
          <div className="crosshair-ring"></div>
          <div className="crosshair-line line-v"></div>
          <div className="crosshair-line line-h"></div>
        </div>
      )}

      {isCameraActive ? (
        <div className="camera-active-feed" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)', // Mirror effect for natural webcam interaction
              borderRadius: '8px'
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)', // Mirror canvas to match mirrored video
              pointerEvents: 'none',
              borderRadius: '8px',
              zIndex: 10
            }}
          />
          {cameraStatus === 'INITIALIZING' && (
            <div className="sim-status" style={{ zIndex: 20, position: 'absolute' }}>
              INITIALIZING HARDWARE SENSOR & STAGE 4 FX...
            </div>
          )}
          {cameraStatus === 'ERROR' && (
            <div className="camera-placeholder" style={{ zIndex: 20, position: 'absolute', inset: 0, background: 'rgba(5,8,20,0.95)' }}>
              <ShieldAlert size={52} style={{ color: '#ff007f' }} />
              <h3>CAMERA SENSOR ERROR</h3>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="camera-placeholder">
          <div className="placeholder-icon-wrapper">
            <CameraOff size={52} className="offline-icon" />
            <div className="pulse-ring"></div>
          </div>
          <h3>CAMERA FEED STANDBY</h3>
          <p>Real-time webcam, MediaPipe hand tracking & Stage 4 Cinematic Superpower FX pipeline ready. Click below to activate.</p>

          <div className="placeholder-specs">
            <div className="spec-badge"><Cpu size={14} /> MediaPipe Dual HandLandmarker</div>
            <div className="spec-badge"><Sparkles size={14} /> Shield, Portal & Collision FX</div>
          </div>
        </div>
      )}

      {/* Overlay Status Strip */}
      <div className="camera-control-strip">
        <div className="cam-status">
          <span className={`status-dot ${cameraStatus === 'LIVE' ? 'online' : 'standby'}`}></span>
          <span className="status-text">
            {cameraStatus === 'LIVE' ? `STAGE 4 FX ACTIVE [${selectedPower.name.toUpperCase()}]` : cameraStatus === 'INITIALIZING' ? 'INITIALIZING...' : cameraStatus === 'ERROR' ? 'ERROR' : 'SENSOR STANDBY'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className={`cam-toggle-btn ${effectsEnabled ? 'active' : ''}`}
            onClick={() => setEffectsEnabled(prev => !prev)}
            style={{ fontSize: '0.75rem', padding: '0.5rem 0.75rem' }}
          >
            <Sparkles size={14} />
            <span>{effectsEnabled ? 'FX: ON' : 'FX: OFF'}</span>
          </button>

          <button
            className={`cam-toggle-btn ${isCameraActive ? 'active' : ''}`}
            onClick={onToggleCamera}
          >
            {isCameraActive ? <Camera size={16} /> : <RefreshCw size={16} />}
            <span>{isCameraActive ? 'STOP CAMERA' : 'START CAMERA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraPreview;