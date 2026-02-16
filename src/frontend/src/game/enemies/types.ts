// Shared enemy-related types and constants

export interface EnemyState {
  position: [number, number, number];
  velocity: [number, number, number];
  isChasing: boolean;
  captureTriggered: boolean;
}

export const ENEMY_CONSTANTS = {
  // Movement speeds
  WANDER_SPEED: 1.0,
  CHASE_SPEED: 3.5,
  
  // Detection radii
  AGGRO_RADIUS: 8.0,
  CAPTURE_RADIUS: 1.2,
  ESCAPE_DISTANCE: 15.0, // Distance player must reach to end chase
  
  // AI behavior
  WANDER_CHANGE_INTERVAL: 2.0, // seconds between direction changes
  WANDER_RADIUS: 15.0, // how far enemies can wander from spawn
  AMBUSH_DURATION: 1.5, // seconds to play ambush before chase begins
  
  // Visual
  BODY_COLOR: '#fafafa',
  GLOSSINESS: 0.6,
  METALNESS: 0.4,
} as const;
