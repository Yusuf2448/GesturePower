import React from 'react';
import { Volume2, VolumeX, Music, Settings } from 'lucide-react';

const AudioControls = ({ settings, onUpdateSettings }) => {
  const handleMuteToggle = () => {
    onUpdateSettings({ ...settings, isMuted: !settings.isMuted });
  };

  const handleBgmToggle = () => {
    onUpdateSettings({ ...settings, bgmEnabled: !settings.bgmEnabled });
  };

  const handleSfxVolumeChange = (e) => {
    onUpdateSettings({ ...settings, sfxVolume: parseFloat(e.target.value) });
  };

  const handleBgmVolumeChange = (e) => {
    onUpdateSettings({ ...settings, bgmVolume: parseFloat(e.target.value) });
  };

  const handleVisualEffectsToggle = () => {
    onUpdateSettings({ ...settings, visualEffectsEnabled: !settings.visualEffectsEnabled });
  };

  const handleScreenShakeToggle = () => {
    onUpdateSettings({ ...settings, screenShake: !settings.screenShake });
  };

  return (
    <div className="audio-controls-panel">
      <div className="controls-grid">
        <div className="control-group">
          <label className="control-label">
            <Volume2 size={16} /> SFX Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.sfxVolume || 0.5}
            onChange={handleSfxVolumeChange}
            className="volume-slider"
          />
        </div>

        <div className="control-group">
          <label className="control-label">
            <Music size={16} /> BGM Volume
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.bgmVolume || 0.2}
            onChange={handleBgmVolumeChange}
            className="volume-slider"
          />
        </div>

        <div className="control-group toggle-group">
          <button
            className={`toggle-btn ${settings.isMuted ? 'active' : ''}`}
            onClick={handleMuteToggle}
          >
            {settings.isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>Mute</span>
          </button>
        </div>

        <div className="control-group toggle-group">
          <button
            className={`toggle-btn ${settings.bgmEnabled ? 'active' : ''}`}
            onClick={handleBgmToggle}
          >
            <Music size={18} />
            <span>Background Music</span>
          </button>
        </div>

        <div className="control-group toggle-group">
          <button
            className={`toggle-btn ${settings.visualEffectsEnabled ? 'active' : ''}`}
            onClick={handleVisualEffectsToggle}
          >
            <span className="effect-icon">✨</span>
            <span>Visual Effects</span>
          </button>
        </div>

        <div className="control-group toggle-group">
          <button
            className={`toggle-btn ${settings.screenShake ? 'active' : ''}`}
            onClick={handleScreenShakeToggle}
          >
            <span className="effect-icon">📳</span>
            <span>Screen Shake</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioControls;