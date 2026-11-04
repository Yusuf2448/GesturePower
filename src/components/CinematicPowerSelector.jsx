import React, { useState, useEffect, useRef } from 'react';
import { Zap, Flame, Shield, Eye, Music, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const CinematicPowerSelector = ({ selectedPower, onSelectPower, settings }) => {
  const [hoveredPower, setHoveredPower] = useState(null);
  const [selectedPowerId, setSelectedPowerId] = useState(selectedPower?.id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const powerCardsRef = useRef({});

  // Power categories with icons and descriptions
  const powerCategories = [
    { id: 'energy', name: 'Energy Powers', icon: <Zap size={16} />, color: '#00f0ff' },
    { id: 'elemental', name: 'Elemental', icon: <Flame size={16} />, color: '#ff007f' },
    { id: 'focused', name: 'Focused', icon: <Eye size={16} />, color: '#00ff7f' },
    { id: 'defensive', name: 'Defensive', icon: <Shield size={16} />, color: '#0072ff' }
  ];

  const [activeCategory, setActiveCategory] = useState('energy');

  // Powers data based on STAGE5.md Phase 3 requirements
  const powerTypes = [
    {
      id: 'orb',
      name: 'Energy Orb',
      description: 'Floating energy sphere that tracks hand movements',
      icon: '⚡',
      color: '#00f0ff',
      category: 'energy',
      effect: 'Creates concentrated energy beams from hand movements',
      gesture: 'Pinch & Drag',
      audio: 'orb'
    },
    {
      id: 'lightning',
      name: 'Lightning Strike',
      description: 'Channel electrical discharges between fingertips',
      icon: '⚡',
      color: '#ffaa00',
      category: 'elemental',
      effect: 'Powerful electrical arcs with crackling sound',
      gesture: 'Rapid Swipe',
      audio: 'lightning'
    },
    {
      id: 'blast',
      name: 'Shockwave Blast',
      description: 'Massive explosion creating shockwaves',
      icon: '💥',
      color: '#ff007f',
      category: 'destructive',
      effect: 'Powerful explosion with massive shockwaves',
      gesture: 'Closed Fist',
      audio: 'blast'
    },
    {
      id: 'laser',
      name: 'Precision Laser',
      description: 'High-damage laser beam focus',
      icon: '🔮',
      color: '#00ff7f',
      category: 'focused',
      effect: 'Precise laser beam with pinpoint accuracy',
      gesture: 'Index Finger Point',
      audio: 'laser'
    },
    {
      id: 'portal',
      name: 'Cosmic Portal',
      description: 'Dimensional transportation gateway',
      icon: '🌌',
      color: '#9d4edd',
      category: 'space',
      effect: 'Creates temporary dimensional portals',
      gesture: 'Spreading Motion',
      audio: 'portal'
    },
    {
      id: 'collision',
      name: 'Collision Field',
      description: 'Defensive field protection',
      icon: '🛡️',
      color: '#ffffff',
      category: 'defensive',
      effect: 'Creates defensive field redirecting attacks',
      gesture: 'Shield Formation',
      audio: 'collision'
    }
  ];

  // Handle power selection with cinematic transition
  const handlePowerSelect = (power) => {
    if (power.id === 'collision') return; // Locked power

    setIsTransitioning(true);
    setSelectedPowerId(power.id);

    // Play activation sound
    if (!settings?.isMuted) {
      audioEngine.playPowerActivation(power.id);
    }

    // Trigger screen shake for heavy powers
    if (settings?.screenShake && (power.id === 'blast' || power.id === 'portal' || power.id === 'lightning')) {
      window.dispatchEvent(new CustomEvent('triggerScreenShake', {
        detail: { intensity: 15, duration: 500 }
      }));
    }

    setTimeout(() => {
      onSelectPower(power);
      setIsTransitioning(false);
    }, 800);
  };

  // Filter powers by category
  const filteredPowers = powerTypes.filter(power =>
    activeCategory === 'all' || power.category === activeCategory
  );

  // Add CSS animations dynamically
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes powerCardSelect {
        0%, 100% { transform: scale(1); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
        50% { transform: scale(1.05); box-shadow: 0 8px 30px var(--card-glow), 0 0 20px var(--card-glow); }
      }

      @keyframes powerCardHover {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      @keyframes powerCardGlow {
        0%, 100% { box-shadow: 0 0 20px var(--card-glow); }
        50% { box-shadow: 0 0 40px var(--card-glow), 0 0 60px var(--card-glow); }
      }

      @keyframes categorySwitch {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      .power-card-selecting {
        animation: powerCardSelect 0.5s ease-in-out;
      }

      .power-card-hover {
        animation: powerCardHover 0.3s ease-in-out;
      }

      .power-card-glow {
        animation: powerCardGlow 2s ease-in-out infinite;
      }

      .category-transition {
        animation: categorySwitch 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="cinematic-power-selector">
      {/* Category Filters */}
      <div className="power-categories">
        <button
          className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          <span>All Powers</span>
        </button>
        {powerCategories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
            style={{ '--category-color': category.color }}
          >
            <span className="category-icon">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Power Grid */}
      <div className={`power-grid ${isTransitioning ? 'transitioning' : ''}`}>
        {filteredPowers.map((power, index) => {
          const isSelected = selectedPowerId === power.id;
          const isHovered = hoveredPower === power.id;

          return (
            <div
              key={power.id}
              ref={el => powerCardsRef.current[power.id] = el}
              className={`power-card ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isTransitioning ? 'transitioning' : ''}`}
              style={{
                '--power-color': power.color,
                '--card-glow': `${power.color}80`,
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => handlePowerSelect(power)}
              onMouseEnter={() => setHoveredPower(power.id)}
              onMouseLeave={() => setHoveredPower(null)}
            >
              {/* Locked overlay for collision power */}
              {power.id === 'collision' && (
                <div className="locked-overlay">
                  <div className="lock-icon">🔒</div>
                  <span>Locked - Complete Training</span>
                </div>
              )}

              {/* Power Icon */}
              <div className="power-icon-container">
                <span className="power-icon" style={{ color: power.color }}>{power.icon}</span>
                {isSelected && (
                  <div className="selected-indicator" style={{ backgroundColor: power.color }}>
                    <Zap size={12} />
                  </div>
                )}
              </div>

              {/* Power Info */}
              <div className="power-info">
                <h3 className="power-name" style={{ color: isSelected ? power.color : '#fff' }}>{power.name}</h3>
                <p className="power-description">{power.description}</p>
                <div className="power-details">
                  <span className="power-effect">
                    <span className="effect-label">Effect:</span>
                    <span>{power.effect}</span>
                  </span>
                  <span className="power-gesture">
                    <span className="gesture-label">Gesture:</span>
                    <span style={{ color: power.color }}>{power.gesture}</span>
                  </span>
                </div>
              </div>

              {/* Hover glow effect */}
              <div
                className="power-card-glow"
                style={{ background: `radial-gradient(circle, ${power.color}40 0%, transparent 70%)` }}
              />

              {/* Selection indicator */}
              {isSelected && (
                <div className="selection-effects">
                  <div className="selection-ring" style={{ borderColor: power.color }}></div>
                  <div className="selection-pulse" style={{ backgroundColor: power.color }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Power Preview */}
      <div className="power-preview-panel glass-panel">
        <div className="preview-header">
          <h4>Power Preview</h4>
          <div className="audio-status">
            {settings?.isMuted ? (
              <VolumeX size={16} className="muted" />
            ) : (
              <Volume2 size={16} className="active" />
            )}
            <span>Audio: {settings?.isMuted ? 'OFF' : 'ON'}</span>
          </div>
        </div>
        <div className="preview-content">
          {selectedPower ? (
            <div className="preview-power-info">
              <div className="preview-icon-large" style={{ color: selectedPower.color }}>
                {selectedPower.icon}
              </div>
              <div className="preview-details">
                <h5>{selectedPower.name}</h5>
                <p>{selectedPower.effect || selectedPower.description}</p>
                <div className="preview-stats">
                  <div className="stat-item">
                    <span className="stat-label">Activation:</span>
                    <span>{selectedPower.gesture || 'Manual'}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Audio:</span>
                    <span>{selectedPower.audio || 'Standard'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-power-selected">
              <p>Select a power to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CinematicPowerSelector;