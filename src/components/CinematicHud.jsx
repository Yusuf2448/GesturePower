import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Music, Settings, Zap, Shield, Eye, Flame, Sun, Moon, Monitor } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const CinematicHud = ({ settings, onUpdateSettings, onToggleAudioPanel }) => {
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0.5);

  // Initialize audio engine
  useEffect(() => {
    audioEngine.init();
    audioEngine.setMuted(localSettings.isMuted || false);
    audioEngine.setSfxVolume(localSettings.sfxVolume || 0.5);
    audioEngine.setBgmVolume(localSettings.bgmVolume || 0.2);
  }, []);

  // Sync local settings with parent
  useEffect(() => {
    if (JSON.stringify(localSettings) !== JSON.stringify(settings)) {
      setLocalSettings(settings || {});
    }
  }, [settings]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = !localSettings.isMuted;
    setLocalSettings(prev => ({ ...prev, isMuted: newMuted }));
    audioEngine.setMuted(newMuted);
    onUpdateSettings({ ...localSettings, isMuted: newMuted });
  }, [localSettings, onUpdateSettings]);

  const handleBgmToggle = useCallback(() => {
    const newBgmEnabled = !localSettings.bgmEnabled;
    setLocalSettings(prev => ({ ...prev, bgmEnabled: newBgmEnabled }));
    if (newBgmEnabled && !localSettings.isMuted) {
      audioEngine.startBgm();
    } else {
      audioEngine.stopBgm();
    }
    onUpdateSettings({ ...localSettings, bgmEnabled: newBgmEnabled });
  }, [localSettings, onUpdateSettings]);

  const handleSfxVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setLocalSettings(prev => ({ ...prev, sfxVolume: newVolume }));
    audioEngine.setSfxVolume(newVolume);
    onUpdateSettings({ ...localSettings, sfxVolume: newVolume });
  }, [localSettings, onUpdateSettings]);

  const handleBgmVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setLocalSettings(prev => ({ ...prev, bgmVolume: newVolume }));
    audioEngine.setBgmVolume(newVolume);
    onUpdateSettings({ ...localSettings, bgmVolume: newVolume });
  }, [localSettings, onUpdateSettings]);

  const handleVisualEffectsToggle = useCallback(() => {
    const newVisualEffects = !localSettings.visualEffectsEnabled;
    setLocalSettings(prev => ({ ...prev, visualEffectsEnabled: newVisualEffects }));
    onUpdateSettings({ ...localSettings, visualEffectsEnabled: newVisualEffects });
  }, [localSettings, onUpdateSettings]);

  const handleScreenShakeToggle = useCallback(() => {
    const newScreenShake = !localSettings.screenShake;
    setLocalSettings(prev => ({ ...prev, screenShake: newScreenShake }));
    onUpdateSettings({ ...localSettings, screenShake: newScreenShake });
  }, [localSettings, onUpdateSettings]);

  // Audio level simulation for visualization
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 0.3 + 0.5);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cinematic-hud glass-panel">
      {/* Main HUD Header */}
      <div className="hud-header">
        <div className="hud-brand">
          <span className="brand-icon">⚡</span>
          <div className="brand-text">
            <h1>GESTURE<span className="brand-accent">POWER</span></h1>
            <span className="brand-subtitle">CINEMATIC ENGINE v2.0</span>
          </div>
        </div>

        <div className="hud-status-indicators">
          <div className="status-item">
            <div className="status-icon">
              <Zap size={16} className="cyan-text" />
            </div>
            <span className="status-value">SYSTEM ACTIVE</span>
          </div>

          <div className="status-item">
            <div className="status-icon">
              <Shield size={16} className="cyan-text" />
            </div>
            <span className="status-value">MEDIAPIPE v2.1</span>
          </div>
        </div>

        <div className="hud-controls">
          <button
            className="control-btn audio-control"
            onClick={handleMuteToggle}
            title="Toggle Audio"
          >
            {localSettings.isMuted ?
              <VolumeX size={20} className="muted-icon" /> :
              <Volume2 size={20} className="active-icon" />
            }
          </button>

          <button
            className="control-btn music-control"
            onClick={handleBgmToggle}
            title="Toggle Background Music"
          >
            <Music size={20} className={localSettings.bgmEnabled ? 'active-icon' : ''} />
          </button>

          <button
            className="control-btn settings-control"
            onClick={() => onToggleAudioPanel && onToggleAudioPanel()}
            title="Settings Panel"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Audio Visualization */}
      <div className="audio-visualization">
        <div className="visualization-bars">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="visual-bar"
              style={{
                height: `${Math.max(20, audioLevel * 100 + Math.sin(Date.now() / 1000 + i) * 30)}px`,
                backgroundColor: localSettings.isMuted ? '#666' : `hsl(${220 + i * 30}, 70%, 50%)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Compact Settings Summary */}
      <div className="settings-summary">
        <div className="settings-row">
          <div className="setting-item">
            <span className="setting-label">SFX:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={localSettings.sfxVolume || 0.5}
              onChange={handleSfxVolumeChange}
              className="compact-slider"
            />
          </div>

          <div className="setting-item">
            <span className="setting-label">BGM:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={localSettings.bgmVolume || 0.2}
              onChange={handleBgmVolumeChange}
              className="compact-slider"
            />
          </div>

          <div className="setting-item toggle-item">
            <button
              className={`toggle-btn ${localSettings.visualEffectsEnabled ? 'active' : ''}`}
              onClick={handleVisualEffectsToggle}
              title="Visual Effects"
            >
              ✨
            </button>
          </div>

          <div className="setting-item toggle-item">
            <button
              className={`toggle-btn ${localSettings.screenShake ? 'active' : ''}`}
              onClick={handleScreenShakeToggle}
              title="Screen Shake"
            >
              📳
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicHud;