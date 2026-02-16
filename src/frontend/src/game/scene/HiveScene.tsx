import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { usePlayerControls } from '../controls/usePlayerControls';
import { usePlayerControlsStore } from '../controls/usePlayerControlsStore';
import { useGameStore } from '../state/useGameStore';

export default function HiveScene() {
  const playerRef = useRef<THREE.Group>(null);
  const { movement, look } = usePlayerControls();
  const controlsStore = usePlayerControlsStore();
  const { hiveSpawnPosition } = useGameStore();
  
  // Jump physics state
  const [verticalVelocity, setVerticalVelocity] = useState(0);
  const [isGrounded, setIsGrounded] = useState(true);

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

  useFrame((state, delta) => {
    if (!playerRef.current) return;

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
    if (controlsStore.consumeJump() && isGrounded) {
      setVerticalVelocity(jumpForce);
      setIsGrounded(false);
    }

    // Apply gravity and vertical velocity
    setVerticalVelocity(prev => {
      const newVelocity = prev + gravity * delta;
      return newVelocity;
    });

    // Update vertical position
    playerRef.current.position.y += verticalVelocity * delta;

    // Ground collision
    if (playerRef.current.position.y <= floorHeight) {
      playerRef.current.position.y = floorHeight;
      setVerticalVelocity(0);
      setIsGrounded(true);
    }

    // Apply camera look
    state.camera.rotation.y += look.x * delta;
    state.camera.rotation.x += look.y * delta;
    state.camera.rotation.x = THREE.MathUtils.clamp(state.camera.rotation.x, -Math.PI / 3, Math.PI / 3);

    // Update camera position to follow player
    state.camera.position.x = playerRef.current.position.x;
    state.camera.position.y = playerRef.current.position.y + 1.6; // Eye height
    state.camera.position.z = playerRef.current.position.z;
  });

  return (
    <>
      <Environment preset="dawn" />
      <ambientLight intensity={0.6} color="#f0f0f5" />
      <directionalLight position={[10, 20, 10]} intensity={0.8} color="#ffffff" castShadow />
      <fog attach="fog" args={['#e8e8f0', 10, 40]} />

      {/* Player avatar */}
      <group ref={playerRef} position={hiveSpawnPosition}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
          <meshStandardMaterial color="#4a90e2" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>

      {/* Floor - white latex-like surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color="#f5f5fa" 
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* Procedural white latex trees */}
      {treePositions.map((pos, i) => (
        <LatexTree key={i} position={pos} seed={i} />
      ))}

      {/* Ambient white latex formations */}
      <LatexFormation position={[-8, 0, -8]} />
      <LatexFormation position={[8, 0, 8]} />
      <LatexFormation position={[-10, 0, 10]} />
      <LatexFormation position={[10, 0, -10]} />
    </>
  );
}

function LatexTree({ position, seed }: { position: [number, number, number]; seed: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Deterministic randomness based on seed
  const random = (offset: number) => {
    const x = Math.sin(seed * 12.9898 + offset) * 43758.5453;
    return x - Math.floor(x);
  };
  
  const height = 3 + random(1) * 2;
  const trunkRadius = 0.15 + random(2) * 0.1;
  const foliageSize = 0.8 + random(3) * 0.4;
  const branches = Math.floor(3 + random(4) * 3);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle sway animation
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3 + seed) * 0.05;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Smooth trunk */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[trunkRadius * 0.8, trunkRadius, height, 12]} />
        <meshStandardMaterial 
          color="#fafafa" 
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>
      
      {/* Foliage clusters */}
      {Array.from({ length: branches }).map((_, i) => {
        const angle = (i / branches) * Math.PI * 2;
        const branchHeight = height * 0.6 + random(i + 10) * height * 0.3;
        const branchRadius = 0.5 + random(i + 20) * 0.3;
        const offsetX = Math.cos(angle) * branchRadius;
        const offsetZ = Math.sin(angle) * branchRadius;
        
        return (
          <mesh 
            key={i} 
            position={[offsetX, branchHeight, offsetZ]} 
            castShadow
          >
            <sphereGeometry args={[foliageSize, 12, 12]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={0.4}
              roughness={0.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}
      
      {/* Top foliage */}
      <mesh position={[0, height + foliageSize * 0.5, 0]} castShadow>
        <sphereGeometry args={[foliageSize * 1.2, 12, 12]} />
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.4}
          roughness={0.2}
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}

function LatexFormation({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Organic blob-like formations */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial 
          color="#f8f8fc" 
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.6, 0.3, 0.4]} castShadow>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial 
          color="#f8f8fc" 
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-0.5, 0.4, -0.3]} castShadow>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial 
          color="#f8f8fc" 
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
