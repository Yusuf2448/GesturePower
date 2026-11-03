import React from 'react';
import { POWER_TYPES } from '../constants/powers';
import { Sparkles, Check, Flame } from 'lucide-react';

const PowerSelection = ({ selectedPower, onSelectPower }) => {
  return (
    <div className="power-selection-panel glass-panel">
      <div className="panel-header">
        <div className="header-title">
          <Flame className="header-icon" size={20} />
          <h2>ARMAMENT SELECTOR</h2>
        </div>
        <span className="power-count">{POWER_TYPES.length} POWERS READY</span>
      </div>

      <div className="powers-grid" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {POWER_TYPES.map((power) => {
          const isSelected = selectedPower.id === power.id;
          return (
            <div
              key={power.id}
              className={`power-card glass-card ${isSelected ? 'selected' : ''}`}
              style={{
                '--card-accent': power.color,
                '--shadow-color': power.shadowColor
              }}
              onClick={() => onSelectPower(power)}
            >
              {isSelected && (
                <div className="active-badge" style={{ backgroundColor: power.color }}>
                  <Check size={12} color="#000" strokeWidth={3} />
                </div>
              )}

              <div className="card-top">
                <span className="power-icon-lg">{power.icon}</span>
                <span className="power-cat">{power.category}</span>
              </div>

              <div className="card-info">
                <h3 style={{ color: isSelected ? power.color : '#fff' }}>{power.name}</h3>
                <p className="card-desc">{power.description}</p>
              </div>

              <div className="card-stats">
                {Object.entries(power.stats).map(([statName, val]) => (
                  <div key={statName} className="stat-row">
                    <span className="stat-label">{statName}</span>
                    <span className="stat-val">{val}</span>
                  </div>
                ))}
              </div>

              <div className="gesture-trigger-hint">
                <Sparkles size={12} />
                <span>Trigger: <strong>{power.gestureHint}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PowerSelection;
