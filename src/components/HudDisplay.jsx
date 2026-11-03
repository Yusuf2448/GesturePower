import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Video, Zap, Cpu, Wifi, Hand } from 'lucide-react';

const HudDisplay = ({ selectedPower, isCameraActive, onReturnHome, currentGesture, handCount }) => {
  const [fps, setFps] = useState(60);

  // Simple pseudo FPS variance simulation for HUD realism
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hud-header glass-panel">
      {/* Brand Title */}
      <div className="hud-brand" onClick={onReturnHome} style={{ cursor: 'pointer' }}>
        <Zap className="hud-logo-icon" size={24} />
        <div className="brand-text">
          <h1>GESTURE<span className="cyan-text">POWER</span></h1>
          <span className="sub-tag">HUD V1.0 // MEDIAPIPE TRACKING</span>
        </div>
      </div>

      {/* Main Indicators */}
      <div className="hud-metrics">
        {/* Selected Power Meter */}
        <div className="hud-metric-box">
          <span className="metric-label">CURRENT POWER</span>
          <div className="metric-value-group">
            <span className="power-mini-icon">{selectedPower.icon}</span>
            <span className="metric-title" style={{ color: selectedPower.color }}>
              {selectedPower.name.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Gesture Recognition Status */}
        <div className="hud-metric-box">
          <span className="metric-label">DETECTED GESTURE</span>
          <div className="metric-value-group">
            <Hand size={16} className="cyan-text" />
            <span className="status-pill pill-active">
              {isCameraActive ? (currentGesture || 'Waiting for Hand') : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Camera Hardware Status */}
        <div className="hud-metric-box">
          <span className="metric-label">CAMERA SENSOR</span>
          <div className="metric-value-group">
            <Video size={16} className={isCameraActive ? 'cyan-text' : 'muted-text'} />
            <span className={`status-pill ${isCameraActive ? 'pill-active' : 'pill-standby'}`}>
              {isCameraActive ? `LIVE (${handCount} Hand${handCount !== 1 ? 's' : ''})` : 'STANDBY MODE'}
            </span>
          </div>
        </div>

        {/* Performance telemetry */}
        <div className="hud-metric-box hide-mobile">
          <span className="metric-label">ENGINE TELEMETRY</span>
          <div className="metric-value-group">
            <Cpu size={16} className="cyan-text" />
            <span className="metric-detail">{fps} FPS</span>
            <span className="metric-divider">|</span>
            <Wifi size={14} className="cyan-text" />
            <span className="metric-detail">0.4ms</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <button className="hud-home-btn" onClick={onReturnHome}>
        MAIN MENU
      </button>
    </div>
  );
};

export default HudDisplay;
