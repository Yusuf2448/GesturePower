import React, { useState, useEffect, useRef } from 'react';
import { Zap, Shield, Eye, Flame, Sun, Moon, Star, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const CinematicTransition = ({
  isActive,
  transitionType = 'fade',
  powerColor = '#00f0ff',
  powerIcon = '⚡',
  onComplete,
  settings
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('entering');
  const [particles, setParticles] = useState([]);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const animationRef = useRef(null);
  const particleCanvasRef = useRef(null);

  // Initialize transition
  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setAnimationPhase('entering');
      setGlowIntensity(0);

      // Generate particles for transition effect
      const generateParticles = () => {
        const newParticles = [];
        const particleCount = transitionType === 'explosion' ? 50 : transitionType === 'portal' ? 30 : 20;

        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const velocity = 2 + Math.random() * 3;
          const size = 2 + Math.random() * 4;

          newParticles.push({
            id: Date.now() + i,
            x: 0,
            y: 0,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            size,
            color: powerColor,
            alpha: 1,
            life: 1.0
          });
        }

        setParticles(newParticles);
      };

      generateParticles();

      // Play transition sound
      if (!settings?.isMuted) {
        if (transitionType === 'explosion') {
          audioEngine.playPowerActivation('blast');
        } else if (transitionType === 'portal') {
          audioEngine.playPowerActivation('portal');
        } else if (transitionType === 'lightning') {
          audioEngine.playPowerActivation('lightning');
        } else {
          audioEngine.playPowerActivation('orb');
        }
      }

    } else {
      setIsVisible(false);
      setParticles([]);
    }
  }, [isActive, transitionType, powerColor, settings]);

  // Animation loop for particles and effects
  useEffect(() => {
    if (!isActive || particles.length === 0) return;

    const animate = () => {
      setParticles(prevParticles => {
        const updated = prevParticles
          .map(particle => {
            const newLife = particle.life - 0.016;
            if (newLife <= 0) return null;

            return {
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vy: particle.vy + 0.1, // gravity
              life: newLife,
              alpha: newLife
            };
          })
          .filter(particle => particle !== null);

        return updated;
      });

      // Update glow intensity
      setGlowIntensity(prev => {
        if (animationPhase === 'entering') {
          return Math.min(1, prev + 0.05);
        } else if (animationPhase === 'exiting') {
          return Math.max(0, prev - 0.05);
        }
        return prev;
      });

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animationPhase, particles.length]);

  // Handle animation phases
  useEffect(() => {
    if (!isActive) return;

    const phases = {
      'fade': { enterDuration: 800, exitDuration: 400 },
      'explosion': { enterDuration: 600, exitDuration: 500 },
      'portal': { enterDuration: 1000, exitDuration: 600 },
      'lightning': { enterDuration: 400, exitDuration: 300 },
      'morph': { enterDuration: 900, exitDuration: 400 }
    };

    const phase = phases[transitionType] || phases.fade;

    const enterTimer = setTimeout(() => {
      setAnimationPhase('active');
    }, phase.enterDuration);

    const exitTimer = setTimeout(() => {
      setAnimationPhase('exiting');

      const completeTimer = setTimeout(() => {
        setIsVisible(false);
        setParticles([]);
        setGlowIntensity(0);
        if (onComplete) onComplete();
      }, phase.exitDuration);

      return () => clearTimeout(completeTimer);
    }, phase.enterDuration + 2000); // Stay active for 2 seconds

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [isActive, transitionType, onComplete]);

  const getTransitionIcon = () => {
    switch (transitionType) {
      case 'explosion': return <Zap size={40} style={{ color: powerColor }} />;
      case 'portal': return <Eye size={40} style={{ color: powerColor }} />;
      case 'lightning': return <Sun size={40} style={{ color: powerColor }} />;
      case 'morph': return <Sparkles size={40} style={{ color: powerColor }} />;
      default: return <Shield size={40} style={{ color: powerColor }} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="cinematic-transition-container">
      {/* Background overlay */}
      <div
        className="transition-overlay"
        style={{
          background: `radial-gradient(circle, ${powerColor}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          opacity: glowIntensity * 0.8
        }}
      />

      {/* Central icon */}
      <div
        className="transition-icon"
        style={{
          color: powerColor,
          textShadow: `0 0 ${30 * glowIntensity}px ${powerColor}`,
          transform: `scale(${1 + glowIntensity * 0.2})`
        }}
      >
        {getTransitionIcon()}
      </div>

      {/* Particles */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="transition-particle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.alpha,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
          />
        ))}
      </div>

      {/* Energy waves */}
      <div className="energy-waves">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="energy-wave"
            style={{
              borderColor: powerColor,
              opacity: glowIntensity * (1 - i * 0.3)
            }}
          />
        ))}
      </div>

      {/* Scanning lines */}
      <div className="scanlines">
        <div className="scanline horizontal" />
        <div className="scanline vertical" />
      </div>
    </div>
  );
};

export default CinematicTransition;