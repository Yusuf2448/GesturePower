import React, { useEffect, useState, useRef } from 'react';
import { audioEngine } from '../utils/audioEngine';

const PowerActivationEffects = ({ isActive, powerId, settings, position, handId }) => {
  const [particles, setParticles] = useState([]);
  const [shockwaves, setShockwaves] = useState([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isActive || !settings?.visualEffectsEnabled) return;

    const powerColors = {
      orb: '#9d4edd',
      lightning: '#00f0ff',
      blast: '#ff007f',
      laser: '#ffaa00',
      portal: '#ff00ff',
      shield: '#0072ff',
      collision: '#ffffff'
    };

    const createParticles = () => {
      const newParticles = [];
      const particleCount = 20;

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const velocity = 2 + Math.random() * 3;
        const size = 2 + Math.random() * 3;

        newParticles.push({
          id: Date.now() + i,
          x: position.x + (Math.random() - 0.5) * 30,
          y: position.y + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size,
          color: powerColors[powerId] || '#00f0ff',
          alpha: 1,
          life: 1.0
        });
      }

      setParticles(prev => [...prev, ...newParticles]);
    };

    const createShockwave = () => {
      const radius = 20;
      const maxRadius = 100;
      setShockwaves(prev => [...prev, {
        id: Date.now(),
        x: position.x,
        y: position.y,
        radius,
        maxRadius,
        color: powerColors[powerId] || '#00f0ff',
        alpha: 0.6
      }]);
    };

    createParticles();
    createShockwave();

    if (!settings?.isMuted) {
      audioEngine.playPowerEffect(powerId);
    }

    return () => {
      setParticles([]);
      setShockwaves([]);
    };
  }, [isActive, powerId, settings, position]);

  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles(prevParticles => {
        const updated = prevParticles
          .map(p => {
            const newLife = p.life - 0.016;
            if (newLife <= 0) return null;

            return {
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.2, // gravity
              life: newLife,
              alpha: newLife
            };
          })
          .filter(p => p !== null);

        return updated;
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
  }, [particles.length]);

  useEffect(() => {
    setShockwaves(prev => prev.map(sw => {
      const progress = sw.radius / sw.maxRadius;
      return {
        ...sw,
        radius: sw.radius + 3,
        alpha: sw.alpha * (1 - progress)
      };
    }));
  }, [particles.length]);

  return (
    <div className="power-effects-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="power-particle"
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
      {shockwaves.map(shockwave => (
        <div
          key={shockwave.id}
          className="power-shockwave"
          style={{
            left: `${shockwave.x}px`,
            top: `${shockwave.y}px`,
            width: `${shockwave.radius * 2}px`,
            height: `${shockwave.radius * 2}px`,
            borderColor: shockwave.color,
            opacity: shockwave.alpha
          }}
        />
      ))}
    </div>
  );
};

export default PowerActivationEffects;