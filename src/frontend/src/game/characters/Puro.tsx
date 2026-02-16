import { forwardRef, useState, useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../state/useGameStore';

interface PuroProps {
  position: [number, number, number];
}

const Puro = forwardRef<THREE.Group, PuroProps>(({ position }, ref) => {
  const [hovered, setHovered] = useState(false);
  const { setShowDialogue } = useGameStore();
  const lastInteraction = useRef(0);
  
  // Load Puro sprite textures
  const idleTexture = useLoader(THREE.TextureLoader, '/assets/generated/puro-idle-front.dim_512x512.png');
  const hoverTexture = useLoader(THREE.TextureLoader, '/assets/generated/puro-hover.dim_512x512.png');

  // Configure textures for transparency
  useEffect(() => {
    [idleTexture, hoverTexture].forEach(texture => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });
  }, [idleTexture, hoverTexture]);

  useFrame((state) => {
    if (!ref || typeof ref === 'function' || !ref.current) return;
    // Gentle idle animation
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
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

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  const currentTexture = hovered ? hoverTexture : idleTexture;

  return (
    <group 
      ref={ref} 
      position={position}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Billboard sprite that always faces camera */}
      <sprite scale={[2, 2, 1]}>
        <spriteMaterial 
          map={currentTexture} 
          transparent={true}
          alphaTest={0.1}
          depthWrite={false}
        />
      </sprite>
      
      {/* Hover glow effect */}
      {hovered && (
        <pointLight 
          position={[0, 1, 0]} 
          intensity={0.5} 
          distance={3} 
          color="#ffffff" 
        />
      )}
    </group>
  );
});

Puro.displayName = 'Puro';

export default Puro;
