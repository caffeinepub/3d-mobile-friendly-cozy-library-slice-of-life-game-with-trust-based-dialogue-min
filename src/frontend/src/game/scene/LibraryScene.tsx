import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Puro from '../characters/Puro';
import { usePlayerControls } from '../controls/usePlayerControls';
import { usePlayerControlsStore } from '../controls/usePlayerControlsStore';
import { useGameStore } from '../state/useGameStore';
import { useSettingsStore } from '../state/useSettingsStore';
import { toast } from 'sonner';

export default function LibraryScene() {
  const playerRef = useRef<THREE.Group>(null);
  const puroRef = useRef<THREE.Group>(null);
  const { movement, look } = usePlayerControls();
  const controlsStore = usePlayerControlsStore();
  const { libraryCustomizations, teleportToHive } = useGameStore();
  const { aimSensitivity } = useSettingsStore();
  
  // Jump physics state
  const [verticalVelocity, setVerticalVelocity] = useState(0);
  const [isGrounded, setIsGrounded] = useState(true);

  // Proximity trigger state
  const wasInProximity = useRef(false);
  const lastTriggerTime = useRef(0);
  const hasTeleported = useRef(false);

  // Load texture unconditionally (required by Rules of Hooks)
  // If it fails, drei will handle the error and we'll use fallback material
  let woodTexture: THREE.Texture | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    woodTexture = useTexture('/assets/generated/wood-paper-texture-tile.dim_512x512.png');
    if (woodTexture) {
      woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
      woodTexture.repeat.set(4, 4);
    }
  } catch (error) {
    // Texture loading failed, will use fallback material
    console.warn('Failed to load wood texture, using fallback material');
    woodTexture = null;
  }

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    // Apply horizontal movement
    const speed = 2;
    playerRef.current.position.x += movement.x * speed * delta;
    playerRef.current.position.z += movement.z * speed * delta;

    // Constrain to library bounds
    playerRef.current.position.x = THREE.MathUtils.clamp(playerRef.current.position.x, -8, 8);
    playerRef.current.position.z = THREE.MathUtils.clamp(playerRef.current.position.z, -8, 8);

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

    // Apply camera look with sensitivity multiplier
    state.camera.rotation.y += look.x * delta * aimSensitivity;
    state.camera.rotation.x += look.y * delta * aimSensitivity;
    state.camera.rotation.x = THREE.MathUtils.clamp(state.camera.rotation.x, -Math.PI / 3, Math.PI / 3);

    // Update camera position to follow player
    state.camera.position.x = playerRef.current.position.x;
    state.camera.position.y = playerRef.current.position.y + 1.6; // Eye height
    state.camera.position.z = playerRef.current.position.z;

    // Proximity detection with Puro for teleport
    if (puroRef.current && !hasTeleported.current) {
      const playerPos = new THREE.Vector3();
      const puroPos = new THREE.Vector3();
      
      playerRef.current.getWorldPosition(playerPos);
      puroRef.current.getWorldPosition(puroPos);
      
      const distance = playerPos.distanceTo(puroPos);
      const proximityRadius = 1.5; // Collision radius
      const hysteresisMargin = 0.3; // Prevent rapid re-triggering
      
      const isInProximity = distance < proximityRadius;
      const isOutsideHysteresis = distance > (proximityRadius + hysteresisMargin);
      
      // Trigger on entering proximity (one-shot with cooldown)
      if (isInProximity && !wasInProximity.current) {
        const now = Date.now();
        const cooldownMs = 2000; // 2 second cooldown
        
        if (now - lastTriggerTime.current > cooldownMs) {
          // Trigger teleport to hive
          toast.success('Teleporting to the hive...');
          hasTeleported.current = true;
          
          // Delay teleport slightly for toast visibility
          setTimeout(() => {
            teleportToHive();
          }, 500);
          
          lastTriggerTime.current = now;
        }
        wasInProximity.current = true;
      }
      
      // Reset proximity state when player moves away
      if (isOutsideHysteresis) {
        wasInProximity.current = false;
      }
    }
  });

  return (
    <>
      <Environment preset="apartment" />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#fff5e6" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#fff5e6" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#fff5e6" />

      {/* Player avatar (visible capsule) */}
      <group ref={playerRef} position={[0, 0, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
          <meshStandardMaterial color="#4a90e2" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        {woodTexture ? (
          <meshStandardMaterial map={woodTexture} />
        ) : (
          <meshStandardMaterial color="#8b7355" />
        )}
      </mesh>

      {/* Walls */}
      <mesh position={[0, 3, -10]} receiveShadow>
        <boxGeometry args={[20, 6, 0.2]} />
        <meshStandardMaterial color="#3a2f28" />
      </mesh>
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 6, 0.2]} />
        <meshStandardMaterial color="#3a2f28" />
      </mesh>
      <mesh position={[10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[20, 6, 0.2]} />
        <meshStandardMaterial color="#3a2f28" />
      </mesh>

      {/* Bookshelves */}
      <Bookshelf position={[-7, 0, -8]} />
      <Bookshelf position={[-3, 0, -8]} />
      <Bookshelf position={[3, 0, -8]} />
      <Bookshelf position={[7, 0, -8]} />
      <Bookshelf position={[-7, 0, 8]} rotation={[0, Math.PI, 0]} />
      <Bookshelf position={[-3, 0, 8]} rotation={[0, Math.PI, 0]} />

      {/* Central Bonsai Tree */}
      <BonsaiTree position={[0, 0, 0]} />

      {/* Vents */}
      <Vent position={[-8, 0.5, -5]} />
      <Vent position={[8, 0.5, 5]} />

      {/* Puro character */}
      <Puro position={[2, 0, -3]} ref={puroRef} />

      {/* Customization items */}
      {libraryCustomizations.map((item, index) => (
        <CustomizationItem key={index} item={item} />
      ))}
    </>
  );
}

function Bookshelf({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2, 3, 0.5]} />
        <meshStandardMaterial color="#4a3828" />
      </mesh>
      {/* Books */}
      {[0, 0.6, 1.2, 1.8, 2.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0.1]} castShadow>
          <boxGeometry args={[1.8, 0.5, 0.3]} />
          <meshStandardMaterial color={['#8b4513', '#654321', '#5c4033', '#704214', '#6b4423'][i]} />
        </mesh>
      ))}
    </group>
  );
}

function BonsaiTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.6, 8]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1.4, 6]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>
      {/* Oranges */}
      <mesh position={[-0.3, 1.8, 0.3]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ff8c00" emissive="#ff8c00" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.4, 2.1, -0.2]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ff8c00" emissive="#ff8c00" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function Vent({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.6, 0.4, 0.1]} />
      <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function CustomizationItem({ item }: { item: { itemName: string; location: string } }) {
  const position = parseLocation(item.location);

  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#8b7355" />
    </mesh>
  );
}

function parseLocation(location: string): [number, number, number] {
  // Simple parser for location strings like "shelf-1", "corner-left", etc.
  const positions: Record<string, [number, number, number]> = {
    'shelf-1': [-7, 1, -7],
    'shelf-2': [-3, 1, -7],
    'corner-left': [-8, 0.5, -8],
    'corner-right': [8, 0.5, 8],
    center: [0, 0.5, 0],
  };
  return positions[location] || [0, 0.5, 0];
}
