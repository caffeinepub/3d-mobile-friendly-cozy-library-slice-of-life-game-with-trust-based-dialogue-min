import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../state/useGameStore';
import { toast } from 'sonner';

interface PuroProps {
  position: [number, number, number];
}

export default function Puro({ position }: PuroProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setShowDialogue } = useGameStore();
  const lastInteraction = useRef(0);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle idle animation
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  const handleClick = () => {
    const now = Date.now();
    if (now - lastInteraction.current < 1000) return;
    lastInteraction.current = now;
    
    setShowDialogue(true);
  };

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#1a1a1a" : "#0a0a0a"} 
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#1a1a1a" : "#0a0a0a"}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.12, 1.85, 0.3]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.12, 1.85, 0.3]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.25, 2.1, 0]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0.25, 2.1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
    </group>
  );
}
