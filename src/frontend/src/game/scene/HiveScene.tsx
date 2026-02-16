import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayerControls } from '../controls/usePlayerControls';
import { usePlayerControlsStore } from '../controls/usePlayerControlsStore';
import { useGameStore } from '../state/useGameStore';
import { useSettingsStore } from '../state/useSettingsStore';
import WhiteLatexBeast from '../enemies/WhiteLatexBeast';
import { useRecordTransfurred } from '../../hooks/useQueries';

export default function HiveScene() {
  const playerRef = useRef<THREE.Group>(null);
  const { movement, look } = usePlayerControls();
  const controlsStore = usePlayerControlsStore();
  const { 
    hiveSpawnPosition, 
    isInTransfurEncounter,
    startTransfurEncounter,
    resolveTransfurEncounter,
    recordTransfur,
  } = useGameStore();
  const { aimSensitivity } = useSettingsStore();
  const recordTransfurredMutation = useRecordTransfurred();
  
  // Jump physics state - using refs to avoid per-frame re-renders
  const verticalVelocityRef = useRef(0);
  const isGroundedRef = useRef(true);
  const playerWorldPositionRef = useRef<[number, number, number]>([0, 0, 0]);
  const captureCooldown = useRef(0);

  // Generate procedural forest layout
  const treePositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const gridSize = 30;
    const spacing = 4;
    const randomOffset = 1.5;
    
    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let z = -gridSize; z <= gridSize; z += spacing) {
        // Skip center area for spawn
        if (Math.abs(x) < 6 && Math.abs(z) < 6) continue;
        
        const offsetX = (Math.random() - 0.5) * randomOffset;
        const offsetZ = (Math.random() - 0.5) * randomOffset;
        positions.push([x + offsetX, 0, z + offsetZ]);
      }
    }
    return positions;
  }, []);

  // Enemy spawn positions
  const enemySpawns = useMemo<Array<[number, number, number]>>(() => [
    [8, 0, 8],
    [-10, 0, 6],
    [6, 0, -10],
    [-8, 0, -8],
  ], []);

  const handleEnemyCapture = () => {
    if (captureCooldown.current > 0 || isInTransfurEncounter) return;
    
    // Start encounter
    const messages = [
      "The white latex creature envelops you in a warm embrace...",
      "You feel yourself changing as the latex spreads...",
      "The transformation is complete. You are one with the hive now.",
      "The white latex absorbs you into its collective...",
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    startTransfurEncounter(message);
    recordTransfur();
    
    // Record to backend if online (non-blocking)
    recordTransfurredMutation.mutate(undefined, {
      onError: (error) => {
        console.warn('Failed to sync transfur to backend (offline mode):', error);
      },
    });
    
    // Set cooldown
    captureCooldown.current = 3.0;
  };

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // Update capture cooldown
    if (captureCooldown.current > 0) {
      captureCooldown.current -= delta;
    }

    // Disable movement during encounter
    if (isInTransfurEncounter) {
      return;
    }

    // Apply horizontal movement
    const speed = 2;
    playerRef.current.position.x += movement.x * speed * delta;
    playerRef.current.position.z += movement.z * speed * delta;

    // Constrain to hive bounds
    playerRef.current.position.x = THREE.MathUtils.clamp(playerRef.current.position.x, -25, 25);
    playerRef.current.position.z = THREE.MathUtils.clamp(playerRef.current.position.z, -25, 25);

    // Jump physics
    const gravity = -15;
    const jumpForce = 6;
    const floorHeight = 0;

    // Check for jump request
    if (controlsStore.consumeJump() && isGroundedRef.current) {
      verticalVelocityRef.current = jumpForce;
      isGroundedRef.current = false;
    }

    // Apply gravity and vertical velocity
    verticalVelocityRef.current += gravity * delta;

    // Update vertical position
    playerRef.current.position.y += verticalVelocityRef.current * delta;

    // Ground collision
    if (playerRef.current.position.y <= floorHeight) {
      playerRef.current.position.y = floorHeight;
      verticalVelocityRef.current = 0;
      isGroundedRef.current = true;
    }

    // Update player world position ref for enemies (no re-render)
    playerWorldPositionRef.current = [
      playerRef.current.position.x,
      playerRef.current.position.y,
      playerRef.current.position.z,
    ];

    // Apply camera look with sensitivity multiplier
    state.camera.rotation.y += look.x * delta * aimSensitivity;
    state.camera.rotation.x += look.y * delta * aimSensitivity;
    state.camera.rotation.x = THREE.MathUtils.clamp(state.camera.rotation.x, -Math.PI / 3, Math.PI / 3);

    // Update camera position to follow player
    state.camera.position.x = playerRef.current.position.x;
    state.camera.position.y = playerRef.current.position.y + 1.6; // Eye height
    state.camera.position.z = playerRef.current.position.z;
  });

  const handleTransfurComplete = () => {
    resolveTransfurEncounter();
  };

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#e8f4ff" castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />

      {/* Player avatar */}
      <group ref={playerRef} position={hiveSpawnPosition}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
          <meshStandardMaterial color="#4a90e2" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#d4d4d4" roughness={0.8} />
      </mesh>

      {/* White latex forest */}
      {treePositions.map((pos, i) => (
        <WhiteLatexTree key={i} position={pos} />
      ))}

      {/* White Latex Beast enemies - pass ref getter for player position */}
      {enemySpawns.map((spawn, i) => (
        <WhiteLatexBeast
          key={i}
          spawnPosition={spawn}
          playerPositionRef={playerWorldPositionRef}
          onCapture={handleEnemyCapture}
          disabled={isInTransfurEncounter}
        />
      ))}
    </>
  );
}

function WhiteLatexTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
        <meshStandardMaterial 
          color="#f0f0f0" 
          metalness={0.3} 
          roughness={0.4}
        />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.4} 
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}
