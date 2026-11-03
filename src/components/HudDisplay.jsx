import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Video, Zap, Cpu, Wifi, Hand, Volume2, VolumeX, Music, Settings } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const HudDisplay = ({
  selectedPower,
  isCameraActive,
  onReturnHome,
  currentGesture,
  handCount,
  settings = { isMuted: false, bgmEnabled: false, screenShake: true },
  onUpdateSettings
}) => {
  const [fps, setFps] = useState(60);

  // Simple pseudo FPS variance simulation for HUD realism
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Calculate power cooldown (mocked based on power type)
  const [cooldown, setCooldown] = useState(100);
  useEffect(() => {
    if (selectedPower.id === 'blast' || selectedPower.id === 'laser') {
      const interval = setInterval(() => {
        setCooldown(prev => (prev >= 100 ? 0 : prev + 2));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setCooldown(100);
    }
  }, [selectedPower]);

  // Initialize Audio
  useEffect(() => {
    audioEngine.init();
    if (settings.bgmEnabled && !settings.isMuted) {
      audioEngine.startBgm();
    } else {
      audioEngine.stopBgm();
    }
    audioEngine.setMuted(settings.isMuted);
  }, [settings.bgmEnabled, settings.isMuted]);

  return (
    <div className="hud-header glass-panel">
      {/* Brand Title */}
      <div className="hud-brand" onClick={onReturnHome} style={{ cursor: 'pointer' }}>
        <Zap className="hud-logo-icon" size={24} />
        <div className="brand-text">
          <h1>GESTURE<span className="cyan-text">POWER</span></h1>
          <span className="sub-tag">HUD V1.0 // CINEMATIC ENGINE</span>
        </div>
      </div>

      {/* Main Indicators */}
      <div className="hud-metrics">
        {/* Audio Controls */}
        <div className="hud-metric-box audio-controls">
          <span className="metric-label">AUDIO / SFX</span>
          <div className="metric-value-group">
            <button className="icon-btn" onClick={() => onUpdateSettings({ ...settings, isMuted: !settings.isMuted })}>
              {settings.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button className="icon-btn" onClick={() => onUpdateSettings({ ...settings, bgmEnabled: !settings.bgmEnabled })}>
              <Music size={16} className={settings.bgmEnabled ? 'cyan-text' : 'muted-text'} />
            </button>
          </div>
        </div>

        {/* Selected Power Meter */}
        <div className="hud-metric-box">
          <span className="metric-label">CURRENT POWER</span>
          <div className="metric-value-group">
            <span className="power-mini-icon">{selectedPower.icon}</span>
            <span className="metric-title" style={{ color: selectedPower.color }}>
              {selectedPower.name.toUpperCase()}
            </span>
          </div>
          {/* Energy Meter */}
          <div className="energy-meter-container">
            <div className="energy-bar" style={{
              width: `${cooldown}%`,
              backgroundColor: selectedPower.color,
              boxShadow: `0 0 10px ${selectedPower.color}`
            }} />
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
          <span className="metric-label">DETECTION STATUS</span>
          <div className="metric-value-group">
            <div className="hand-status-indicators">
              <span className={`hand-indicator ${handCount >= 1 ? 'active' : ''}`}>L</span>
              <span className={`hand-indicator ${handCount >= 2 ? 'active' : ''}`}>R</span>
            </div>
            <span className={`status-pill ${isCameraActive ? 'pill-active' : 'pill-standby'}`}>
              {isCameraActive ? `LIVE` : 'STANDBY'}
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
