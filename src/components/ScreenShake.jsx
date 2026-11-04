import React, { useState, useEffect, useRef } from 'react';

const ScreenShake = ({
  enabled = true,
  intensity = 10,
  duration = 500,
  smoothing = 0.1,
  onShakeComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const shakeRef = useRef({ active: false, currentIntensity: 0, targetIntensity: 0, elapsed: 0 });
  const animationFrameRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize shake controller
  useEffect(() => {
    if (!enabled) return;

    const animateShake = () => {
      if (shakeRef.current.active) {
        const { currentIntensity, targetIntensity, elapsed } = shakeRef.current;

        // Smooth interpolation
        if (Math.abs(currentIntensity - targetIntensity) > 0.01) {
          const newIntensity = currentIntensity + (targetIntensity - currentIntensity) * smoothing;
          setShakeIntensity(newIntensity);
          shakeRef.current.currentIntensity = newIntensity;
        }

        elapsed += 16; // assuming ~60fps
        shakeRef.current.elapsed = elapsed;

        if (elapsed < duration) {
          animationFrameRef.current = requestAnimationFrame(animateShake);
        } else {
          // Shake complete
          shakeRef.current.active = false;
          setIsActive(false);
          setShakeIntensity(0);
          shakeRef.current.currentIntensity = 0;
          shakeRef.current.targetIntensity = 0;

          if (onShakeComplete) {
            onShakeComplete();
          }
        }
      }
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, intensity, duration, smoothing, onShakeComplete]);

  const startShake = useCallback((shakeIntensity = intensity) => {
    if (!enabled) return;

    shakeRef.current = {
      active: true,
      currentIntensity: shakeIntensity,
      targetIntensity: shakeIntensity,
      elapsed: 0
    };
    setIsActive(true);
    setShakeIntensity(shakeIntensity);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateShake);
  }, [enabled, intensity]);

  const stopShake = useCallback(() => {
    shakeRef.current.active = false;
    setIsActive(false);
    setShakeIntensity(0);
    shakeRef.current.currentIntensity = 0;
    shakeRef.current.targetIntensity = 0;
  }, []);

  // Apply shake effect to container
  useEffect(() => {
    if (containerRef.current) {
      const angle = (Math.random() - 0.5) * shakeIntensity * 0.2;
      const offsetX = (Math.random() - 0.5) * shakeIntensity * 5;
      const offsetY = (Math.random() - 0.5) * shakeIntensity * 5;

      containerRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${angle}deg)`;
    }
  }, [shakeIntensity]);

  return (
    <div ref={containerRef} className="screen-shake-container">
      {/* Shake effects are applied to this container */}
    </div>
  );
};

export default ScreenShake;