import React from 'react';

export const POWER_TYPES = [
  {
    id: 'orb',
    name: 'Energy Orb',
    category: 'Elemental',
    description: 'Manifests a concentrated ball of pure plasma energy reacting to hand movement and rotation.',
    icon: '🔮',
    color: '#00f0ff',
    shadowColor: 'rgba(0, 240, 255, 0.5)',
    gestureHint: 'Open Palm',
    stats: { Power: '85%', Range: 'Medium', Control: 'High' }
  },
  {
    id: 'lightning',
    name: 'Lightning Storm',
    category: 'Energy',
    description: 'Channels high-voltage electrical arcs surging between fingertips and both hands.',
    icon: '⚡',
    color: '#9d4edd',
    shadowColor: 'rgba(157, 78, 221, 0.5)',
    gestureHint: 'Point & Move',
    stats: { Power: '92%', Range: 'Long', Control: 'Medium' }
  },
  {
    id: 'laser',
    name: 'Energy Projectile',
    category: 'Focused',
    description: 'Fires precision energy bolts by pinching and releasing.',
    icon: '🎯',
    color: '#ff007f',
    shadowColor: 'rgba(255, 0, 127, 0.5)',
    gestureHint: 'Pinch & Release',
    stats: { Power: '95%', Range: 'Extreme', Control: 'High' }
  },
  {
    id: 'blast',
    name: 'Energy Blast',
    category: 'Destructive',
    description: 'Unleashes a radial kinetic shockwave bursting on hand push.',
    icon: '💥',
    color: '#ffaa00',
    shadowColor: 'rgba(255, 170, 0, 0.5)',
    gestureHint: 'Closed Fist Push',
    stats: { Power: '99%', Range: 'Short', Control: 'Low' }
  },
  {
    id: 'shield',
    name: 'Energy Shield',
    category: 'Defensive',
    description: 'Deploys a massive hexagonal energy barrier in front of you.',
    icon: '🛡️',
    color: '#0072ff',
    shadowColor: 'rgba(0, 114, 255, 0.5)',
    gestureHint: 'Double Palm Open',
    stats: { Power: '80%', Range: 'Self', Control: 'High' }
  },
  {
    id: 'portal',
    name: 'Dimensional Portal',
    category: 'Mystical',
    description: 'Opens a gateway between two hands, expanding with hand separation.',
    icon: '🌀',
    color: '#00ff7f',
    shadowColor: 'rgba(0, 255, 127, 0.5)',
    gestureHint: 'Both Hands Apart',
    stats: { Power: '90%', Range: 'Spatial', Control: 'Medium' }
  },
  {
    id: 'collision',
    name: 'Energy Collision',
    category: 'Elemental',
    description: 'Collides energy between two hands to trigger massive kinetic blasts.',
    icon: '⚛️',
    color: '#ffffff',
    shadowColor: 'rgba(255, 255, 255, 0.5)',
    gestureHint: 'Both Hands Together',
    stats: { Power: '100%', Range: 'Area', Control: 'Low' }
  }
];
