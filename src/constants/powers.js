import React from 'react';

export const POWER_TYPES = [
  {
    id: 'orb',
    name: 'Energy Orb',
    description: 'Summon a floating orb that tracks hand movements and releases concentrated energy beams',
    icon: '⚡',
    color: '#00f0ff',
    shadowColor: 'rgba(0, 240, 255, 0.6)',
    category: 'Energy',
    gestureHint: 'Pinch & Drag',
    stats: { 'Energy Capacity': '100%', 'Recharge': 'Instant' }
  },
  {
    id: 'lightning',
    name: 'Lightning Strike',
    description: 'Channel powerful electrical discharges between fingertips',
    icon: '⚡',
    color: '#ffaa00',
    shadowColor: 'rgba(255, 170, 0, 0.6)',
    category: 'Elemental',
    gestureHint: 'Rapid Swipe',
    stats: { 'Energy Capacity': '80%', 'Range': 'Medium' }
  },
  {
    id: 'blast',
    name: 'Shockwave Blast',
    description: 'Powerful explosion creating massive shockwaves that knock back enemies',
    icon: '💥',
    color: '#ff007f',
    shadowColor: 'rgba(255, 0, 127, 0.6)',
    category: 'Destructive',
    gestureHint: 'Closed Fist',
    stats: { 'Energy Capacity': '60%', 'Area': 'Large' }
  },
  {
    id: 'laser',
    name: 'Precision Laser',
    description: 'Focuses energy into a precise, high-damage laser beam',
    icon: '🔮',
    color: '#00ff7f',
    shadowColor: 'rgba(0, 255, 127, 0.6)',
    category: 'Focused',
    gestureHint: 'Index Finger Point',
    stats: { 'Energy Capacity': '90%', 'Damage': 'High' }
  },
  {
    id: 'portal',
    name: 'Cosmic Portal',
    description: 'Creates temporary dimensional portals for instant transportation',
    icon: '🌌',
    color: '#9d4edd',
    shadowColor: 'rgba(157, 78, 221, 0.6)',
    category: 'Space',
    gestureHint: 'Spreading Motion',
    stats: { 'Energy Capacity': '70%', 'Duration': '10s' }
  },
  {
    id: 'collision',
    name: 'Collision Field',
    description: 'Creates a defensive field that redirects incoming attacks back at the source',
    icon: '🛡️',
    color: '#ffffff',
    shadowColor: 'rgba(255, 255, 255, 0.6)',
    category: 'Defensive',
    gestureHint: 'Shield Formation',
    stats: { 'Energy Capacity': '50%', 'Range': 'Small' }
  },
  {
    id: 'shield',
    name: 'Energy Shield',
    description: 'Creates a reinforced barrier protecting you from all incoming threats',
    icon: '🛡️',
    color: '#0072ff',
    shadowColor: 'rgba(0, 114, 255, 0.6)',
    category: 'Defensive',
    gestureHint: 'Two-Handed Shield',
    stats: { 'Energy Capacity': '80%', 'Duration': 'Continuous' }
  }
];

export const AUDIO_SOUNDS = {
  orb: {
    activation: {
      file: '/audio/sfx/power-up-coin.wav',
      volume: 0.8,
      loop: false
    },
    effect: {
      file: '/audio/sfx/orb-humm.mp3',
      volume: 0.6,
      loop: true
    }
  },
  lightning: {
    activation: {
      file: '/audio/sfx/thunder-1.wav',
      volume: 0.9,
      loop: false
    },
    effect: {
      file: '/audio/sfx/lightning-loop.mp3',
      volume: 0.5,
      loop: true
    }
  },
  blast: {
    activation: {
      file: '/audio/sfx/explosion-1.wav',
      volume: 1.0,
      loop: false
    },
    effect: {
      file: '/audio/sfx/explosion-loop.mp3',
      volume: 0.4,
      loop: true
    }
  },
  laser: {
    activation: {
      file: '/audio/sfx/laser-beam.wav',
      volume: 0.7,
      loop: false
    },
    effect: {
      file: '/audio/sfx/laser-loop.mp3',
      volume: 0.3,
      loop: true
    }
  },
  portal: {
    activation: {
      file: '/audio/sfx/portal-open.wav',
      volume: 0.8,
      loop: false
    },
    effect: {
      file: '/audio/sfx/portal-loop.mp3',
      volume: 0.5,
      loop: true
    }
  },
  shield: {
    activation: {
      file: '/audio/sfx/shield-up.wav',
      volume: 0.7,
      loop: false
    },
    effect: {
      file: '/audio/sfx/shield-loop.mp3',
      volume: 0.4,
      loop: true
    }
  },
  collision: {
    activation: {
      file: '/audio/sfx/shield-up.wav',
      volume: 0.7,
      loop: false
    },
    effect: {
      file: '/audio/sfx/shield-loop.mp3',
      volume: 0.4,
      loop: true
    }
  }
};