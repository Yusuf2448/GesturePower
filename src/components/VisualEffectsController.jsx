import React, { useState, useEffect, useRef } from 'react';

const VisualEffectsController = ({
  enabled = true,
  screenShake = true,
  particleSettings = { density: 0.5, speed: 1.0, size: 1.0 },
  onEffectTrigger,
  onScreenShake
}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const screenShakeRef = useRef({ active: false, intensity: 0, startTime: 0 });
  const containerRef = useRef(null);

  // Initialize visual effects controller
  useEffect(() => {
    setIsEnabled(enabled);
    setScreenShake(screenShake);
  }, [enabled, screenShake]);

  // Screen shake effect with smooth animation
  useEffect(() => {
    let shakeAnimationFrame = null;

    const animateShake = () => {
      if (screenShakeRef.current.active && Date.now() - screenShakeRef.current.startTime < 500) {
        const elapsed = Date.now() - screenShakeRef.current.startTime;
        const progress = elapsed / 500;
        const intensity = screenShakeRef.current.intensity * (1 - progress);

        // Apply shake effect to document body
        const angle = (Math.random() - 0.5) * intensity * 0.2;
        const offsetX = (Math.random() - 0.5) * intensity * 5;
        const offsetY = (Math.random() - 0.5) * intensity * 5;

        if (containerRef.current) {
          containerRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${angle}deg)`;
        }

        shakeAnimationFrame = requestAnimationFrame(animateShake);
      } else {
        // Reset shake
        screenShakeRef.current.active = false;
        setIsScreenShaking(false);

        if (containerRef.current) {
          containerRef.current.style.transform = '';
        }
      }
    };

    return () => {
      if (shakeAnimationFrame) {
        cancelAnimationFrame(shakeAnimationFrame);
      }
    };
  }, []);

  const triggerScreenShake = useCallback((intensity = 10) => {
    if (!screenShake) return;

    // Cancel any existing shake
    screenShakeRef.current.active = false;
    if (containerRef.current) {
      containerRef.current.style.transform = '';
    }

    // Start new shake
    screenShakeRef.current = {
      active: true,
      intensity: intensity,
      startTime: Date.now()
    };
    setIsScreenShaking(true);

    if (onScreenShake) {
      onScreenShake(intensity);
    }
  }, [screenShake, onScreenShake]);

  const triggerEffect = useCallback((effectType, params = {}) => {
    if (!isEnabled) return;

    switch (effectType) {
      case 'screenShake':
        triggerScreenShake(params.intensity || 10);
        break;
      case 'particleBurst':
        if (onEffectTrigger) {
          onEffectTrigger('particleBurst', params);
        }
        break;
      case 'shockwave':
        if (onEffectTrigger) {
          onEffectTrigger('shockwave', params);
        }
        break;
      case 'cinematicTransition':
        if (onEffectTrigger) {
          onEffectTrigger('cinematicTransition', params);
        }
        break;
      default:
        console.warn(`Unknown effect type: ${effectType}`);
    }
  }, [isEnabled, triggerScreenShake, onEffectTrigger]);

  // Listen for global effect triggers
  useEffect(() => {
    const handleGlobalEffect = (event) => {
      const { type, params } = event.detail;
      triggerEffect(type, params);
    };

    window.addEventListener('visual-effect-trigger', handleGlobalEffect);
    return () => window.removeEventListener('visual-effect-trigger', handleGlobalEffect);
  }, [triggerEffect]);

  return (
    <div ref={containerRef} className="visual-effects-controller">
      {/* This component controls visual effects globally */}
    </div>
  );
};

export default VisualEffectsController;