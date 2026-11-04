import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Settings, Zap, Shield, Eye, Flame, Sun, Moon, Monitor } from 'lucide-react';

const CinematicSettingsPanel = ({ settings, onUpdateSettings, isOpen, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [activeTab, setActiveTab] = useState('audio');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize settings with defaults
  useEffect(() => {
    setLocalSettings({
      isMuted: false,
      bgmEnabled: false,
      sfxVolume: 0.7,
      bgmVolume: 0.3,
      visualEffectsEnabled: true,
      screenShake: true,
      quality: 'high',
      resolution: 'auto',
      fps: 60,
      brightness: 0.8,
      contrast: 1.0,
      ...settings // Override with provided settings
    });
  }, [settings]);

  // Save settings when changed
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdateSettings(localSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save on settings change (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(localSettings) !== JSON.stringify(settings)) {
        saveSettings();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [localSettings, settings]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setLocalSettings({
      isMuted: false,
      bgmEnabled: false,
      sfxVolume: 0.7,
      bgmVolume: 0.3,
      visualEffectsEnabled: true,
      screenShake: true,
      quality: 'high',
      resolution: 'auto',
      fps: 60,
      brightness: 0.8,
      contrast: 1.0
    });
  };

  const renderAudioTab = () => (
    <div className="settings-tab-content">
      <div className="control-group">
        <label className="control-label">
          <Volume2 size={18} /> Audio Master Volume
        </label>
        <div className="volume-control-large">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={localSettings.isMuted ? 0 : Math.max(localSettings.sfxVolume, localSettings.bgmVolume)}
            onChange={(e) => {
              const volume = parseFloat(e.target.value);
              handleSettingChange('sfxVolume', volume);
              handleSettingChange('bgmVolume', volume);
            }}
            className="volume-slider-large"
          />
          <div className="volume-value">
            {Math.round((localSettings.isMuted ? 0 : Math.max(localSettings.sfxVolume, localSettings.bgmVolume)) * 100)}%
          </div>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">
          <Zap size={18} /> Sound Effects Volume
        </label>
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={localSettings.sfxVolume}
            onChange={(e) => handleSettingChange('sfxVolume', parseFloat(e.target.value))}
            className="volume-slider"
          />
          <span className="volume-percent">
            {Math.round(localSettings.sfxVolume * 100)}%
          </span>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">
          <Music size={18} /> Background Music Volume
        </label>
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={localSettings.bgmVolume}
            onChange={(e) => handleSettingChange('bgmVolume', parseFloat(e.target.value))}
            className="volume-slider"
          />
          <span className="volume-percent">
            {Math.round(localSettings.bgmVolume * 100)}%
          </span>
        </div>
      </div>

      <div className="toggle-group">
        <button
          className={`toggle-btn ${localSettings.isMuted ? 'active' : ''}`}
          onClick={() => handleSettingChange('isMuted', !localSettings.isMuted)}
        >
          {localSettings.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          <span>Mute All Audio</span>
        </button>
      </div>

      <div className="toggle-group">
        <button
          className={`toggle-btn ${localSettings.bgmEnabled ? 'active' : ''}`}
          onClick={() => handleSettingChange('bgmEnabled', !localSettings.bgmEnabled)}
        >
          <Music size={20} />
          <span>Enable Background Music</span>
        </button>
      </div>
    </div>
  );

  const renderVisualTab = () => (
    <div className="settings-tab-content">
      <div className="control-group">
        <label className="control-label">
          <Zap size={18} /> Visual Effects
        </label>
        <button
          className={`toggle-btn ${localSettings.visualEffectsEnabled ? 'active' : ''}`}
          onClick={() => handleSettingChange('visualEffectsEnabled', !localSettings.visualEffectsEnabled)}
        >
          <Zap size={20} />
          <span>Enable Visual Effects</span>
        </button>
      </div>

      <div className="control-group">
        <label className="control-label">
          <Sun size={18} /> Screen Shake
        </label>
        <button
          className={`toggle-btn ${localSettings.screenShake ? 'active' : ''}`}
          onClick={() => handleSettingChange('screenShake', !localSettings.screenShake)}
        >
          <Sun size={20} />
          <span>Enable Screen Shake</span>
        </button>
      </div>

      <div className="control-group">
        <label className="control-label">
          <Monitor size={18} /> Quality Settings
        </label>
        <select
          value={localSettings.quality}
          onChange={(e) => handleSettingChange('quality', e.target.value)}
          className="select-control"
        >
          <option value="low">Low - Better Performance</option>
          <option value="medium">Medium - Balanced</option>
          <option value="high">High - Best Quality</option>
        </select>
      </div>

      <div className="control-group">
        <label className="control-label">
          <Moon size={18} /> Resolution
        </label>
        <select
          value={localSettings.resolution}
          onChange={(e) => handleSettingChange('resolution', e.target.value)}
          className="select-control"
        >
          <option value="auto">Auto</option>
          <option value="720p">720p</option>
          <option value="1080p">1080p</option>
          <option value="1440p">1440p</option>
        </select>
      </div>

      <div className="control-group">
        <label className="control-label">
          <Settings size={18} /> Target FPS
        </label>
        <select
          value={localSettings.fps}
          onChange={(e) => handleSettingChange('fps', parseInt(e.target.value))}
          className="select-control"
        >
          <option value="30">30 FPS</option>
          <option value="60">60 FPS</option>
          <option value="120">120 FPS</option>
          <option value="144">144 FPS</option>
        </select>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="settings-tab-content">
      <div className="control-group">
        <label className="control-label">
          Brightness
        </label>
        <div className="range-control">
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={localSettings.brightness}
            onChange={(e) => handleSettingChange('brightness', parseFloat(e.target.value))}
            className="range-slider"
          />
          <span className="range-value">
            {Math.round(localSettings.brightness * 100)}%
          </span>
        </div>
      </div>

      <div className="control-group">
        <label className="control-label">
          Contrast
        </label>
        <div className="range-control">
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={localSettings.contrast}
            onChange={(e) => handleSettingChange('contrast', parseFloat(e.target.value))}
            className="range-slider"
          />
          <span className="range-value">
            {Math.round(localSettings.contrast * 100)}%
          </span>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel glass-panel">
        <div className="settings-header">
          <h2>Cinematic Settings</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            Audio
          </button>
          <button
            className={`tab-btn ${activeTab === 'visual' ? 'active' : ''}`}
            onClick={() => setActiveTab('visual')}
          >
            Visual
          </button>
          <button
            className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'audio' && renderAudioTab()}
          {activeTab === 'visual' && renderVisualTab()}
          {activeTab === 'advanced' && renderAdvancedTab()}
        </div>

        <div className="settings-footer">
          <button
            className="btn-secondary"
            onClick={resetToDefaults}
            disabled={isSaving}
          >
            Reset to Defaults
          </button>
          <button
            className="btn-primary"
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinematicSettingsPanel;