import React from 'react';
import { Play, Zap, Shield, Eye, Radio, Sparkles } from 'lucide-react';
import { POWER_TYPES } from '../constants/powers';

const LandingScreen = ({ onStart }) => {
  return (
    <div className="landing-container">
      {/* Background Decorative Elements */}
      <div className="cyber-grid"></div>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <div className="landing-content">
        <div className="badge-wrapper">
          <span className="cyber-badge">
            <Radio size={14} className="pulse-icon" /> NEXT-GEN WEBCAM GESTURE ENGINE v1.0
          </span>
        </div>

        <h1 className="hero-title">
          GESTURE<span className="cyan-text">POWER</span>
        </h1>
        <p className="hero-subtitle">
          SUPERPOWER SIMULATOR
        </p>
        <p className="hero-description">
          Transform your physical hands into mystical destruction elements using real-time spatial gesture interaction.
        </p>

        <div className="powers-preview-grid">
          {POWER_TYPES.map((power) => (
            <div key={power.id} className="preview-card" style={{ '--card-accent': power.color }}>
              <div className="preview-icon">{power.icon}</div>
              <div className="preview-name">{power.name}</div>
              <div className="preview-hint">{power.gestureHint}</div>
            </div>
          ))}
        </div>

        <button className="start-btn" onClick={onStart}>
          <div className="btn-glow"></div>
          <span className="btn-content">
            <Play fill="#00f0ff" size={20} />
            <span>START EXPERIENCE</span>
            <Sparkles size={18} className="sparkle-icon" />
          </span>
        </button>

        <div className="footer-specs">
          <div className="spec-item">
            <Shield size={16} /> <span>ZERO PRE-RECORDED MEDIA</span>
          </div>
          <div className="spec-item">
            <Eye size={16} /> <span>REAL-TIME CAMERA READY</span>
          </div>
          <div className="spec-item">
            <Zap size={16} /> <span>MODULAR HUD INTEGRATION</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
