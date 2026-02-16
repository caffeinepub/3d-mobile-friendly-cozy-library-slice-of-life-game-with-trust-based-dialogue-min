import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ENEMY_CONSTANTS } from './types';

interface WhiteLatexBeastProps {
  spawnPosition: [number, number, number];
  playerPosition: [number, number, number];
  onCapture: () => void;
  disabled?: boolean;
}

type AIPhase = 'wander' | 'ambush' | 'chase';

export default function WhiteLatexBeast({
  spawnPosition,
  playerPosition,
  onCapture,
  disabled = false,
}: WhiteLatexBeastProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [position, setPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(...spawnPosition)
  );
  const [wanderDirection, setWanderDirection] = useState<THREE.Vector3>(
    new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize()
  );
  const [aiPhase, setAIPhase] = useState<AIPhase>('wander');
  const [captureTriggered, setCaptureTriggered] = useState(false);
  const wanderTimer = useRef(0);
  const ambushTimer = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || disabled || captureTriggered) return;

    const playerPos = new THREE.Vector3(...playerPosition);
    const currentPos = position.clone();
    const distanceToPlayer = currentPos.distanceTo(playerPos);

    // Check for capture
    if (distanceToPlayer < ENEMY_CONSTANTS.CAPTURE_RADIUS && !captureTriggered) {
      setCaptureTriggered(true);
      onCapture();
      return;
    }

    let newPosition = currentPos.clone();

    // AI State Machine
    if (aiPhase === 'wander') {
      // Check if player enters aggro radius - transition to ambush
      if (distanceToPlayer < ENEMY_CONSTANTS.AGGRO_RADIUS) {
        setAIPhase('ambush');
        ambushTimer.current = 0;
      } else {
        // Continue wandering
        wanderTimer.current += delta;

        if (wanderTimer.current > ENEMY_CONSTANTS.WANDER_CHANGE_INTERVAL) {
          // Change wander direction
          const newDir = new THREE.Vector3(
            Math.random() - 0.5,
            0,
            Math.random() - 0.5
          ).normalize();
          setWanderDirection(newDir);
          wanderTimer.current = 0;
        }

        // Apply wander movement
        const movement = wanderDirection.clone().multiplyScalar(ENEMY_CONSTANTS.WANDER_SPEED * delta);
        newPosition.add(movement);

        // Keep within wander radius of spawn
        const spawnPos = new THREE.Vector3(...spawnPosition);
        const distanceFromSpawn = newPosition.distanceTo(spawnPos);
        if (distanceFromSpawn > ENEMY_CONSTANTS.WANDER_RADIUS) {
          // Push back toward spawn
          const toSpawn = spawnPos.clone().sub(newPosition).normalize();
          newPosition.add(toSpawn.multiplyScalar(0.5));
        }
      }
    } else if (aiPhase === 'ambush') {
      // Play ambush animation/state for configured duration
      ambushTimer.current += delta;

      // Face player during ambush
      const lookDirection = playerPos.clone().sub(currentPos);
      lookDirection.y = 0;
      if (lookDirection.length() > 0.01) {
        const angle = Math.atan2(lookDirection.x, lookDirection.z);
        groupRef.current.rotation.y = angle;
      }

      // Transition to chase when ambush completes
      if (ambushTimer.current >= ENEMY_CONSTANTS.AMBUSH_DURATION) {
        setAIPhase('chase');
      }

      // No movement during ambush - position stays the same
    } else if (aiPhase === 'chase') {
      // Check if player has escaped
      if (distanceToPlayer > ENEMY_CONSTANTS.ESCAPE_DISTANCE) {
        // Return to wander
        setAIPhase('wander');
        wanderTimer.current = 0;
        // Reset wander direction
        const newDir = new THREE.Vector3(
          Math.random() - 0.5,
          0,
          Math.random() - 0.5
        ).normalize();
        setWanderDirection(newDir);
      } else {
        // Continuously track player's current position
        const direction = playerPos.clone().sub(currentPos).normalize();
        const movement = direction.multiplyScalar(ENEMY_CONSTANTS.CHASE_SPEED * delta);
        newPosition.add(movement);

        // Face movement direction (toward player)
        const lookDirection = playerPos.clone().sub(currentPos);
        lookDirection.y = 0;
        if (lookDirection.length() > 0.01) {
          const angle = Math.atan2(lookDirection.x, lookDirection.z);
          groupRef.current.rotation.y = angle;
        }
      }
    }

    // Keep on ground
    newPosition.y = 0;

    // Update position
    setPosition(newPosition);
    groupRef.current.position.copy(newPosition);

    // Update rotation for wander phase (chase/ambush handle their own rotation above)
    if (aiPhase === 'wander') {
      const angle = Math.atan2(wanderDirection.x, wanderDirection.z);
      groupRef.current.rotation.y = angle;
    }

    // Subtle idle animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  // Determine eye color based on AI phase
  const eyeColor = aiPhase === 'ambush' ? '#ffaa00' : aiPhase === 'chase' ? '#ff6b6b' : '#6bb6ff';
  const eyeIntensity = aiPhase === 'ambush' ? 1.2 : aiPhase === 'chase' ? 0.8 : 0.8;

  return (
    <group ref={groupRef} position={spawnPosition}>
      {/* Main body - glossy white latex creature */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={ENEMY_CONSTANTS.BODY_COLOR}
          metalness={ENEMY_CONSTANTS.METALNESS}
          roughness={1 - ENEMY_CONSTANTS.GLOSSINESS}
        />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={ENEMY_CONSTANTS.BODY_COLOR}
          metalness={ENEMY_CONSTANTS.METALNESS}
          roughness={1 - ENEMY_CONSTANTS.GLOSSINESS}
        />
      </mesh>

      {/* Eyes - glowing effect with phase-based colors */}
      <mesh position={[-0.12, 1.35, 0.3]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={eyeIntensity}
        />
      </mesh>
      <mesh position={[0.12, 1.35, 0.3]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color={eyeColor}
          emissive={eyeColor}
          emissiveIntensity={eyeIntensity}
        />
      </mesh>

      {/* Arms */}
      <mesh castShadow position={[-0.5, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.15, 0.6, 6, 12]} />
        <meshStandardMaterial
          color={ENEMY_CONSTANTS.BODY_COLOR}
          metalness={ENEMY_CONSTANTS.METALNESS}
          roughness={1 - ENEMY_CONSTANTS.GLOSSINESS}
        />
      </mesh>
      <mesh castShadow position={[0.5, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.15, 0.6, 6, 12]} />
        <meshStandardMaterial
          color={ENEMY_CONSTANTS.BODY_COLOR}
          metalness={ENEMY_CONSTANTS.METALNESS}
          roughness={1 - ENEMY_CONSTANTS.GLOSSINESS}
        />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[-0.2, 0.15, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 6, 12]} />
        <meshStandardMaterial
          color={ENEMY_CONSTANTS.BODY_COLOR}
          metalness={ENEMY_CONSTANTS.METALNESS}
          roughness={1 - ENEMY_CONSTANTS.GLOSSINESS}
        />
      </mesh>
      <mesh castShadow position={[0.2, 0.15, 0]}>
        <capsuleGeometry args={[0.15, 0.5, 6, 12]} />
        <meshStandardMaterial
          color={ENEMY_CONSTANTS.BODY_COLOR}
          metalness={ENEMY_CONSTANTS.METALNESS}
          roughness={1 - ENEMY_CONSTANTS.GLOSSINESS}
        />
      </mesh>
    </group>
  );
}
