import React, { useState, useRef, useEffect } from 'react';
import { POWER_TYPES } from '../constants/powers';
import { Sparkles, Check, Flame, Zap, Shield, Eye, Dices } from 'lucide-react';

const PowerSelection = ({ selectedPower, onSelectPower }) => {
  const [hoveredPower, setHoveredPower] = useState(null);
  const [selectedPowerId, setSelectedPowerId] = useState(selectedPower?.id || POWER_TYPES[0].id);
  const [activeCategory, setActiveCategory] = useState('All');
  const cardRefs = useRef({});

  // Animation variants for different categories
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Energy':
        return <Zap size={14} color="#ffaa00" />;
      case 'Elemental':
        return <Flame size={14} color="#ff007f" />;
      case 'Space':
        return <Eye size={14} color="#00ff7f" />;
      case 'Focused':
        return <Shield size={14} color="#00f0ff" />;
      case 'Defensive':
        return <Sparkles size={14} color="#9d4edd" />;
      case 'Mystical':
        return <Dices size={14} color="#ffffff" />;
      default:
        return <Sparkles size={14} color="#00f0ff" />;
    }
  };

  // Get CSS custom properties for dynamic styling
  const getCardStyles = (power) => {
    return {
      '--card-accent': power.color,
      '--shadow-color': power.shadowColor,
      '--glow-intensity': selectedPowerId === power.id ? '0.8' : '0.3'
    };
  };

  // Generate energy particles for animated background
  const generateEnergyParticles = (powerId) => {
    const particles = [];
    const count = powerId === 'orb' ? 6 : 4;

    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count + (Date.now() * 0.001 % Math.PI);
      const distance = 20 + Math.random() * 30;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 2 + Math.random() * 3;
      const opacity = 0.3 + Math.random() * 0.7;
      const animationDelay = Math.random() * 2;

      particles.push({
        id: `${powerId}-particle-${i}`,
        x, y, size, opacity, animationDelay
      });
    }

    return particles;
  };

  const handleCardClick = (power) => {
    if (power.id === 'collision') {
      return; // Prevent locked powers from being selected or activated
    }
    setSelectedPowerId(power.id);
    onSelectPower(power);
  };

  const handleMouseEnter = (powerId) => {
    setHoveredPower(powerId);
  };

  const handleMouseLeave = () => {
    setHoveredPower(null);
  };

  // Add CSS animations for power selection
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes powerCardPulse {
        0%, 100% { box-shadow: 0 0 20px var(--shadow-color); }
        50% { box-shadow: 0 0 40px var(--card-accent), 0 0 20px var(--shadow-color); }
      }

      @keyframes energyFlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      @keyframes particleFloat {
        0%, 100% {
          transform: 'translate(0, 0) scale(1)';
          opacity: 0.3;
        }
        50% {
          transform: 'translate(var(--float-x), var(--float-y)) scale(1.2)';
          opacity: 0.8;
        }
      }

      .power-card.selected {
        animation: powerCardPulse 2s infinite ease-in-out;
      }

      .power-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 15px 35px var(--shadow-color), 0 5px 15px var(--card-accent);
      }

      .power-card.selected:hover {
        box-shadow: 0 20px 40px var(--shadow-color), 0 10px 20px var(--card-accent);
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
    <div className="power-selection-panel glass-panel">
      <div className="panel-header">
        <div className="header-title">
          <Flame className="header-icon" size={20} />
          <h2>ARMAMENT SELECTOR</h2>
        </div>
        <span className="power-count">
          {POWER_TYPES.filter(p => p.id !== 'collision').length} ACTIVE POWERS |
          {POWER_TYPES.filter(p => p.id === 'collision').length} LOCKED
        </span>
      </div>

      <div className="categories-section">
        <div className="category-filters">
          {['All', 'Energy', 'Elemental', 'Focused', 'Destructive', 'Defensive', 'Mystical'].map(category => {
            const IconComponent = category === 'All' ? <Sparkles size={14} color="#00f0ff" /> : getCategoryIcon(category);
            const isSelectedCategory = activeCategory === category;
            const count = category === 'All' ? POWER_TYPES.length : POWER_TYPES.filter(p => p.category === category).length;

            return (
              <button
                key={category}
                className={`category-filter ${isSelectedCategory ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {IconComponent}
                <span>{category}</span>
                <span className="category-count">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="powers-grid" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {POWER_TYPES
          .filter(power => activeCategory === 'All' || power.category === activeCategory)
          .map((power) => {
          const isSelected = selectedPowerId === power.id;
          const isHovered = hoveredPower === power.id;
          const energyParticles = generateEnergyParticles(power.id);

          return (
            <div
              key={power.id}
              ref={el => cardRefs.current[power.id] = el}
              className={`power-card glass-card ${isSelected ? 'selected' : ''}`}
              style={getCardStyles(power)}
              onClick={() => handleCardClick(power)}
              onMouseEnter={() => handleMouseEnter(power.id)}
              onMouseLeave={handleMouseLeave}
            >
              {isSelected && (
                <div
                  className="active-badge"
                  style={{
                    backgroundColor: power.color,
                    boxShadow: `0 0 20px ${power.color}`
                  }}
                >
                  <Check size={12} color="#000" strokeWidth={3} />
                </div>
              )}

              <div className="card-glow-effect" style={{
                borderColor: power.color,
                boxShadow: isSelected ? `0 0 30px ${power.color}` : 'none'
              }} />

              <div className="card-top">
                <span className="power-icon-lg">{power.icon}</span>
                <div className="category-icon-wrapper">
                  {getCategoryIcon(power.category)}
                </div>
                <span className="power-cat">{power.category}</span>
              </div>

              <div className="card-info">
                <h3 style={{
                  color: isSelected ? power.color : '#fff',
                  textShadow: isSelected ? `0 0 20px ${power.color}` : 'none'
                }}>
                  {power.name}
                </h3>
                <p className="card-desc">{power.description}</p>
              </div>

              <div className="card-stats">
                {Object.entries(power.stats).map(([statName, val]) => (
                  <div key={statName} className="stat-row">
                    <span className="stat-label">{statName}</span>
                    <span
                      className="stat-val"
                      style={{
                        color: isSelected ? power.color : '#fff',
                        textShadow: isSelected ? `0 0 10px ${power.color}` : 'none'
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              <div className="gesture-trigger-hint">
                <Sparkles size={12} style={{ color: power.color }} />
                <span>Trigger: <strong style={{ color: power.color }}>{power.gestureHint}</strong></span>
              </div>

              {/* Animated energy particles */}
              <div className="energy-particles-container">
                {energyParticles.map(particle => (
                  <div
                    key={particle.id}
                    className="energy-particle"
                    style={{
                      left: `${50 + particle.x}%`,
                      top: `${50 + particle.y}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      opacity: particle.opacity,
                      animationDelay: `${particle.animationDelay}s`,
                      '--float-x': `${(Math.random() - 0.5) * 40}px`,
                      '--float-y': `${(Math.random() - 0.5) * 40}px`
                    }}
                  />
                ))}
              </div>

              {/* Locked state for collision power */}
              {power.id === 'collision' && (
                <div className="locked-overlay">
                  <div className="locked-content">
                    <Dices size={32} color="rgba(255, 255, 255, 0.3)" />
                    <span>Locked - Complete Training to Unlock</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="selection-footer">
        <div className="power-system-status">
          <div className="status-indicator active" />
          <span>System: OPERATIONAL</span>
        </div>
        <div className="selected-power-info">
          {selectedPower && (
            <>
              <span className="selected-icon">{selectedPower.icon}</span>
              <span className="selected-name">{selectedPower.name}</span>
              <span className="selected-gesture">({selectedPower.gestureHint})</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PowerSelection;
