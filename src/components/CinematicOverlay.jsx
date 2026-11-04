import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const CinematicOverlay = ({ selectedPower, onTriggerShake, settings }) => {
  const [activeTransition, setActiveTransition] = useState(false);
  const [displayPower, setDisplayPower] = useState(selectedPower);

  useEffect(() => {
    if (selectedPower.id !== displayPower.id) {
      setActiveTransition(true);

      // Play sound effect
      if (!settings?.isMuted) {
        audioEngine.playPowerActivation(selectedPower.id);
      }

      // Trigger screen shake on heavy powers
      if (settings?.screenShake && (selectedPower.id === 'blast' || selectedPower.id === 'portal' || selectedPower.id === 'lightning')) {
        onTriggerShake?.(500);
      }

      const timer = setTimeout(() => {
        setDisplayPower(selectedPower);
        setActiveTransition(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [selectedPower, displayPower, settings, onTriggerShake]);

  if (!activeTransition) return null;

  return (
    <div className="cinematic-overlay" style={{ borderColor: selectedPower.color }}>
      <div className="cinematic-flash" style={{ background: `radial-gradient(circle, ${selectedPower.color}44 0%, transparent 70%)` }}></div>
      <div className="cinematic-content">
        <div className="cinematic-icon-glow" style={{ color: selectedPower.color, textShadow: `0 0 30px ${selectedPower.color}` }}>
          {selectedPower.icon}
        </div>
        <h2 className="cinematic-title" style={{ color: selectedPower.color }}>
          INITIALIZING {selectedPower.name.toUpperCase()}
        </h2>
        <p className="cinematic-desc">{selectedPower.description}</p>
        <div className="cinematic-scanline"></div>
      </div>
    </div>
  );
};

export default CinematicOverlay;
