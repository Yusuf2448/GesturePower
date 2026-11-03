import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import HudDisplay from './components/HudDisplay';
import CameraPreview from './components/CameraPreview';
import PowerSelection from './components/PowerSelection';
import { POWER_TYPES } from './constants/powers';
import './App.css';

function App() {
  const [inExperience, setInExperience] = useState(false);
  const [selectedPower, setSelectedPower] = useState(POWER_TYPES[0]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState('Waiting for Hand');
  const [handCount, setHandCount] = useState(0);
  const [settings, setSettings] = useState({ isMuted: false, bgmEnabled: false, screenShake: true });

  const handleStartExperience = () => {
    setInExperience(true);
  };

  const handleReturnHome = () => {
    setInExperience(false);
    setIsCameraActive(false); // Stop camera when returning home
  };

  const handleToggleCamera = () => {
    setIsCameraActive((prev) => !prev);
  };

  return (
    <div className="app-container">
      {!inExperience ? (
        <LandingScreen onStart={handleStartExperience} />
      ) : (
        <div className="experience-dashboard">
          {/* Top Heads-Up Display (HUD) */}
          <HudDisplay
            selectedPower={selectedPower}
            isCameraActive={isCameraActive}
            onReturnHome={handleReturnHome}
            currentGesture={currentGesture}
            handCount={handCount}
            settings={settings}
            onUpdateSettings={setSettings}
          />

          {/* Main Interactive Grid */}
          <main className="dashboard-grid">
            <section className="camera-section">
              <CameraPreview
                isCameraActive={isCameraActive}
                onToggleCamera={handleToggleCamera}
                selectedPower={selectedPower}
                onGestureUpdate={setCurrentGesture}
                onHandCountUpdate={setHandCount}
              />
            </section>

            <section className="powers-section">
              <PowerSelection
                selectedPower={selectedPower}
                onSelectPower={setSelectedPower}
              />
            </section>
          </main>

          {/* Footer Bar */}
          <footer className="hud-footer glass-panel">
            <div className="footer-status">
              <span className="dot-blink"></span> SYSTEM ACTIVE — HAND TRACKING PIPELINE: MEDIAPIPE VISION TASKS
            </div>
            <div className="footer-credits">
              GESTUREPOWER ENGINE © 2026
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
