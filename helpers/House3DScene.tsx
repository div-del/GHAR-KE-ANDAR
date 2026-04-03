import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Billboard, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { GameAction, Character } from './gameData';
import styles from './House3DScene.module.css';

export interface House3DSceneProps {
  currentLocation: string;
  onMoveTo: (locationId: string) => void;
  onTalkTo: (characterId: string) => void;
  onTask?: (taskId: string) => void;
  characters: Record<string, Character>;
  availableActions: GameAction[];
  dialogueActive: boolean;
}

// ----------------------------------------------------------------------------
// CONFIGURATIONS
// ----------------------------------------------------------------------------

const PORTAL_SLOTS: [number, number, number][] = [
  [0, 0, 3.5],
  [0, 0, -3.5],
  [3.5, 0, 0],
  [-3.5, 0, 0],
  [2.5, 0, 2.5],
  [-2.5, 0, 2.5],
  [2.5, 0, -2.5],
  [-2.5, 0, -2.5]
];

const TASK_SLOTS: [number, number, number][] = [
  [0, 1, 1.5],
  [2, 1, 2],
  [-2, 1, 2]
];

const getCharacterPosition = (id: string): [number, number, number] => {
  switch (id) {
    case 'maa': return [1.5, 0, -1.5]; // Kitchen standing
    case 'papa': return [-1.5, 0.5, -1]; // Living room sitting on sofa
    case 'dadi': return [-1.5, 0.6, -1]; // Bedroom sitting on bed
    case 'bhai': return [2, 0, 2]; // Street standing
    case 'aunty': return [-1, 0, -1]; // Neighbor house
    default: return [0, 0, 0];
  }
};

const getCharacterColor = (id: string): string => {
  switch (id) {
    case 'maa': return '#388e3c'; // Green sari
    case 'papa': return '#795548'; // Brown
    case 'dadi': return '#ffffff'; // White
    case 'bhai': return '#1976d2'; // Blue
    case 'aunty': return '#d81b60'; // Magenta / Pink
    default: return '#9e9e9e';
  }
};

// ----------------------------------------------------------------------------
// INTERACTIVE COMPONENTS
// ----------------------------------------------------------------------------

const Portal3D = ({
  action,
  position,
  onMove,
  disabled
}: {
  action: GameAction;
  position: [number, number, number];
  onMove: (id: string) => void;
  disabled: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered && !disabled ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, disabled]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, 1.5, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (!disabled && action.targetLocation) onMove(action.targetLocation);
        }}
        onPointerOver={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); setHovered(false); }}
      >
        <boxGeometry args={[1.5, 3, 0.2]} />
        <meshStandardMaterial
          color={hovered && !disabled ? "#ffffff" : "#ffeb3b"}
          transparent
          opacity={0.6}
          emissive={hovered && !disabled ? "#ffffff" : "#ffeb3b"}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Billboard position={[0, 3.5, 0]}>
        <Text fontSize={0.25} color="white" outlineWidth={0.02} outlineColor="black">
          🚪 {action.label}
        </Text>
      </Billboard>
    </group>
  );
};

const CharacterBody = ({ id, color }: { id: string, color: string }) => {
  const renderHead = (y: number) => (
    <mesh position={[0, y, 0]} castShadow>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial color="#ffccbc" />
    </mesh>
  );

  if (id === 'maa') {
    return (
      <group>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 1.2, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.2, 0.9, 0.2]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.3, 1]} />
          <meshStandardMaterial color="#f0f0f0" side={THREE.DoubleSide} />
        </mesh>
        {renderHead(1.4)}
      </group>
    );
  }
  if (id === 'dadi') {
    return (
      <group>
        <mesh position={[0, 0.5, 0]} castShadow>
          <coneGeometry args={[0.45, 1, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.8, 0.2]} rotation={[Math.PI / 6, 0, 0]}>
          <boxGeometry args={[0.6, 0.1, 0.3]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
        {renderHead(1.2)}
      </group>
    );
  }
  if (id === 'papa') {
    return (
      <group>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.3, 0.7, 0.3]} rotation={[0, -Math.PI / 4, 0]}>
          <boxGeometry args={[0.4, 0.6, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {renderHead(1.4)}
      </group>
    );
  }
  if (id === 'bhai') {
    return (
      <group>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 1, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.3, 0.4, 0.2]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        {renderHead(1.2)}
      </group>
    );
  }
  if (id === 'aunty') {
    return (
      <group>
        <mesh position={[0, 0.7, 0]} castShadow>
          <coneGeometry args={[0.4, 1.4, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Earring */}
        <mesh position={[0.28, 1.4, 0.1]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        {renderHead(1.6)}
      </group>
    );
  }
  
  // Default
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 1.2, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {renderHead(1.4)}
    </group>
  );
};

const Character3D = ({
  character,
  position,
  color,
  canTalk,
  onTalk,
  disabled
}: {
  character: Character;
  position: [number, number, number];
  color: string;
  canTalk: boolean;
  onTalk: (id: string) => void;
  disabled: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered && canTalk && !disabled ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, canTalk, disabled]);

  const heightOffset = character.id === 'aunty' ? 2.4 : character.id === 'bhai' || character.id === 'dadi' ? 1.8 : 2.2;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (canTalk && !disabled) onTalk(character.id);
      }}
      onPointerOver={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); setHovered(false); }}
    >
      <CharacterBody id={character.id} color={color} />

      {canTalk && !disabled && (
        <Billboard position={[0, heightOffset, 0]}>
          <Text fontSize={0.25} color="white" outlineWidth={0.02} outlineColor="black">
            💬 Talk
          </Text>
        </Billboard>
      )}

      <Billboard position={[0, heightOffset - 0.3, 0]}>
        <Text fontSize={0.2} color="#ffffff" outlineWidth={0.015} outlineColor="black">
          {character.name}
        </Text>
      </Billboard>

      {/* Hover Highlight Ring */}
      {hovered && canTalk && !disabled && (
        <mesh position={[0, heightOffset / 2, 0]}>
          <cylinderGeometry args={[0.5, 0.55, heightOffset, 16]} />
          <meshBasicMaterial color="#ffffff" side={THREE.BackSide} transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
};

const Task3D = ({
  action,
  position,
  onComplete,
  disabled
}: {
  action: GameAction;
  position: [number, number, number];
  onComplete: (id: string) => void;
  disabled: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.05;
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered && !disabled ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, disabled]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (!disabled && action.targetTask) onComplete(action.targetTask);
        }}
        onPointerOver={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); setHovered(false); }}
      >
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial
          color={hovered && !disabled ? "#4caf50" : "#81c784"}
          emissive={hovered && !disabled ? "#4caf50" : "#81c784"}
          emissiveIntensity={0.5}
        />
      </mesh>
      <Billboard position={[0, 0.8, 0]}>
        <Text fontSize={0.25} color="white" outlineWidth={0.02} outlineColor="black">
          ⭐ {action.label}
        </Text>
      </Billboard>
    </group>
  );
};

// ----------------------------------------------------------------------------
// ROOM GEOMETRIES
// ----------------------------------------------------------------------------

const BedroomGeometry = () => (
  <group>
    <gridHelper args={[15, 15, '#cbaacb', '#e6e6e6']} position={[0, 0.01, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#d2b48c" />
    </mesh>
    <mesh position={[0, 2, -4]} receiveShadow>
      <boxGeometry args={[8, 4, 0.2]} />
      <meshStandardMaterial color="#fdf5e6" />
    </mesh>
    <mesh position={[-4, 2, 0]} receiveShadow>
      <boxGeometry args={[0.2, 4, 8]} />
      <meshStandardMaterial color="#fdf5e6" />
    </mesh>
    {/* Ceiling */}
    <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
    {/* Bed */}
    <mesh position={[-2, 0.4, -1.5]} castShadow receiveShadow>
      <boxGeometry args={[2.5, 0.8, 4]} />
      <meshStandardMaterial color="#8d6e63" />
    </mesh>
    {/* Desk */}
    <mesh position={[2, 0.5, -3]} castShadow receiveShadow>
      <boxGeometry args={[2, 1, 1]} />
      <meshStandardMaterial color="#5d4037" />
    </mesh>
    {/* Window */}
    <mesh position={[-4, 2, -1]} castShadow>
      <boxGeometry args={[0.3, 1.5, 2]} />
      <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
    </mesh>
  </group>
);

const KitchenGeometry = () => (
  <group>
    <gridHelper args={[15, 15, '#cccccc', '#dddddd']} position={[0, 0.01, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#9e9e9e" />
    </mesh>
    <mesh position={[0, 2, -4]} receiveShadow>
      <boxGeometry args={[8, 4, 0.2]} />
      <meshStandardMaterial color="#fff3e0" />
    </mesh>
    <mesh position={[4, 2, 0]} receiveShadow>
      <boxGeometry args={[0.2, 4, 8]} />
      <meshStandardMaterial color="#fff3e0" />
    </mesh>
    {/* Ceiling */}
    <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
    {/* Counters */}
    <mesh position={[0, 0.6, -3.2]} castShadow receiveShadow>
      <boxGeometry args={[5, 1.2, 1.5]} />
      <meshStandardMaterial color="#455a64" />
    </mesh>
    {/* Fridge */}
    <mesh position={[3, 1.5, -3]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 3, 1.5]} />
      <meshStandardMaterial color="#cfd8dc" />
    </mesh>
  </group>
);

const LivingRoomGeometry = () => (
  <group>
    <gridHelper args={[15, 15, '#c7bca8', '#dfd5c4']} position={[0, 0.01, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#d7ccc8" />
    </mesh>
    <mesh position={[0, 2, -5]} receiveShadow>
      <boxGeometry args={[10, 4, 0.2]} />
      <meshStandardMaterial color="#f5f5f5" />
    </mesh>
    {/* Ceiling */}
    <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
    {/* Sofa */}
    <mesh position={[-2, 0.5, -2]} castShadow receiveShadow>
      <boxGeometry args={[4, 1, 1.5]} />
      <meshStandardMaterial color="#ffb74d" />
    </mesh>
    <mesh position={[-2, 0.75, -2.75]} castShadow receiveShadow>
      <boxGeometry args={[4, 1.5, 0.5]} />
      <meshStandardMaterial color="#ffb74d" />
    </mesh>
    {/* TV Unit */}
    <mesh position={[3, 0.4, -2]} castShadow receiveShadow>
      <boxGeometry args={[3, 0.8, 1]} />
      <meshStandardMaterial color="#5d4037" />
    </mesh>
    {/* TV */}
    <mesh position={[3, 1.6, -2]} castShadow>
      <boxGeometry args={[2.5, 1.5, 0.1]} />
      <meshStandardMaterial color="#212121" />
    </mesh>
  </group>
);

const StreetGeometry = () => (
  <group>
    <gridHelper args={[20, 20, '#8d7870', '#9d8880']} position={[0, 0.01, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#a1887f" />
    </mesh>
    {/* Boundary Wall */}
    <mesh position={[0, 1.25, -7]} castShadow receiveShadow>
      <boxGeometry args={[20, 2.5, 0.5]} />
      <meshStandardMaterial color="#bcaaa4" />
    </mesh>
    {/* Tree Trunk */}
    <mesh position={[-6, 0.5, -5]} castShadow>
      <cylinderGeometry args={[0.3, 0.4, 1.5]} />
      <meshStandardMaterial color="#5d4037" />
    </mesh>
    {/* Tree Leaves */}
    <mesh position={[-6, 2.5, -5]} castShadow>
      <sphereGeometry args={[2]} />
      <meshStandardMaterial color="#4caf50" />
    </mesh>

    {/* Parked Scooter */}
    <group position={[5, 0.4, -4]} rotation={[0, -Math.PI / 4, 0]}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 1.5]} />
        <meshStandardMaterial color="#90a4ae" />
      </mesh>
      <mesh position={[0, 0.5, 0.5]} castShadow>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#90a4ae" />
      </mesh>
      {/* Wheels */}
      <mesh position={[0, -0.2, 0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
        <meshStandardMaterial color="#212121" />
      </mesh>
      <mesh position={[0, -0.2, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 16]} />
        <meshStandardMaterial color="#212121" />
      </mesh>
    </group>

    {/* Stray Dog */}
    <group position={[-2, 0.2, -2]} rotation={[0, Math.PI / 6, 0]}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 0.6]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>
      <mesh position={[0, 0.2, 0.3]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>
    </group>

    {/* Clothes Line */}
    <group position={[-4, 2, -6]}>
      <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 4]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      <mesh position={[1, -0.3, 0]} castShadow>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial color="#f44336" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[3, -0.4, 0]} castShadow>
        <planeGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="#2196f3" side={THREE.DoubleSide} />
      </mesh>
    </group>

    {/* Small Temple */}
    <group position={[-8, 0.5, -6]}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#ffcc80" />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color="#ef6c00" />
      </mesh>
    </group>
  </group>
);

const ShopGeometry = () => (
  <group>
    <gridHelper args={[10, 10, '#7d5e53', '#8d6e63']} position={[0, 0.01, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial color="#8d6e63" />
    </mesh>
    <mesh position={[0, 2, -3]} receiveShadow>
      <boxGeometry args={[6, 4, 0.2]} />
      <meshStandardMaterial color="#d7ccc8" />
    </mesh>
    {/* Ceiling */}
    <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
    {/* Main Counter */}
    <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
      <boxGeometry args={[4, 1.2, 1]} />
      <meshStandardMaterial color="#5d4037" />
    </mesh>
    {/* Shelves */}
    <mesh position={[0, 1.75, -2.5]} castShadow receiveShadow>
      <boxGeometry args={[5, 3.5, 1]} />
      <meshStandardMaterial color="#795548" />
    </mesh>
    {/* Items on shelves */}
    <mesh position={[-1, 1, -2]} castShadow>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#f44336" />
    </mesh>
    <mesh position={[1, 2, -2]} castShadow>
      <boxGeometry args={[0.5, 0.8, 0.5]} />
      <meshStandardMaterial color="#2196f3" />
    </mesh>
    <mesh position={[0, 2.5, -2]} castShadow>
      <boxGeometry args={[0.6, 0.5, 0.6]} />
      <meshStandardMaterial color="#ffeb3b" />
    </mesh>
  </group>
);

const NeighborHouseGeometry = () => (
  <group>
    <gridHelper args={[15, 15, '#d1c4e9', '#ede7f6']} position={[0, 0.01, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#f8bbd0" />
    </mesh>
    <mesh position={[0, 2, -5]} receiveShadow>
      <boxGeometry args={[10, 4, 0.2]} />
      <meshStandardMaterial color="#fce4ec" />
    </mesh>
    <mesh position={[-5, 2, 0]} receiveShadow>
      <boxGeometry args={[0.2, 4, 10]} />
      <meshStandardMaterial color="#fce4ec" />
    </mesh>
    {/* Ceiling */}
    <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
    
    {/* Sofa Set */}
    <mesh position={[2, 0.5, -3]} castShadow receiveShadow>
      <boxGeometry args={[3, 1, 1.5]} />
      <meshStandardMaterial color="#880e4f" />
    </mesh>
    <mesh position={[2, 1, -3.5]} castShadow receiveShadow>
      <boxGeometry args={[3, 1, 0.5]} />
      <meshStandardMaterial color="#880e4f" />
    </mesh>
    
    {/* Decorative Shelf */}
    <mesh position={[-4.8, 2, -2]} castShadow receiveShadow>
      <boxGeometry args={[0.4, 2, 1.5]} />
      <meshStandardMaterial color="#5d4037" />
    </mesh>
    {/* Photo frame */}
    <mesh position={[0, 2.5, -4.8]} castShadow>
      <boxGeometry args={[1.5, 1, 0.1]} />
      <meshStandardMaterial color="#4e342e" />
    </mesh>
    <mesh position={[0, 2.5, -4.75]} castShadow>
      <planeGeometry args={[1.3, 0.8]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
  </group>
);

const DairyGeometry = () => (
  <group>
    <gridHelper args={[10, 10, '#b3e5fc', '#e1f5fe']} position={[0, 0.01, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#e1f5fe" />
    </mesh>
    <mesh position={[0, 2, -4]} receiveShadow>
      <boxGeometry args={[8, 4, 0.2]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    {/* Ceiling */}
    <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
    
    {/* Counter */}
    <mesh position={[0, 0.6, -1]} castShadow receiveShadow>
      <boxGeometry args={[4, 1.2, 1]} />
      <meshStandardMaterial color="#bbdefb" />
    </mesh>
    
    {/* Milk containers */}
    <mesh position={[-1, 1.5, -1]} castShadow>
      <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
    <mesh position={[0, 1.5, -1]} castShadow>
      <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
    <mesh position={[1, 1.5, -1]} castShadow>
      <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>

    {/* Fridge */}
    <mesh position={[3, 1.5, -3]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 3, 1.5]} />
      <meshStandardMaterial color="#eceff1" />
    </mesh>
    {/* Crates */}
    <mesh position={[-3, 0.5, -3]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2196f3" />
    </mesh>
    <mesh position={[-3, 1.5, -3]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2196f3" />
    </mesh>
  </group>
);

const SchoolGeometry = () => (
  <group>
    <gridHelper args={[20, 20, '#fff59d', '#fff9c4']} position={[0, 0.01, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[15, 15]} />
      <meshStandardMaterial color="#e0e0e0" />
    </mesh>
    <mesh position={[0, 2.5, -7.5]} receiveShadow>
      <boxGeometry args={[15, 5, 0.2]} />
      <meshStandardMaterial color="#fff9c4" />
    </mesh>
    <mesh position={[-7.5, 2.5, 0]} receiveShadow>
      <boxGeometry args={[0.2, 5, 15]} />
      <meshStandardMaterial color="#fff9c4" />
    </mesh>
    {/* Ceiling */}
    <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[15, 15]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>

    {/* Blackboard */}
    <mesh position={[0, 2.5, -7.4]} castShadow>
      <planeGeometry args={[6, 2.5]} />
      <meshStandardMaterial color="#1b5e20" />
    </mesh>

    {/* Teacher Desk */}
    <mesh position={[0, 0.6, -5]} castShadow receiveShadow>
      <boxGeometry args={[2, 1.2, 1]} />
      <meshStandardMaterial color="#8d6e63" />
    </mesh>

    {/* Desks */}
    {[[-3, 0], [0, 0], [3, 0], [-3, 3], [0, 3], [3, 3]].map((pos, i) => (
      <group position={[pos[0], 0, pos[1]]} key={i}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 1, 0.8]} />
          <meshStandardMaterial color="#a1887f" />
        </mesh>
        <mesh position={[0, 0.3, 0.8]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.6, 0.5]} />
          <meshStandardMaterial color="#a1887f" />
        </mesh>
      </group>
    ))}
  </group>
);


// ----------------------------------------------------------------------------
// SCENE CONTROLLERS
// ----------------------------------------------------------------------------

const CameraReseter = ({ currentLocation }: { currentLocation: string }) => {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as any;

  useEffect(() => {
    // Reset camera position gracefully on room switch
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);
    if (controls?.target) {
      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [currentLocation, camera, controls]);

  return null;
};

const SceneLighting = ({ currentLocation }: { currentLocation: string }) => {
  const isOutside = currentLocation === 'street';
  const isSchool = currentLocation === 'school';
  const isDairy = currentLocation === 'dairy';
  const isNeighbor = currentLocation === 'neighbor_house';

  let ambientIntensity = 0.4;
  let pointIntensity = 1.2;
  let pointColor = '#ffe0b2';

  if (isOutside) {
    ambientIntensity = 0.7;
    pointIntensity = 1.5;
    pointColor = '#e0f7fa';
  } else if (isSchool) {
    ambientIntensity = 0.6;
    pointIntensity = 1.4;
    pointColor = '#ffffff';
  } else if (isDairy) {
    ambientIntensity = 0.5;
    pointIntensity = 1.3;
    pointColor = '#e3f2fd';
  } else if (isNeighbor) {
    ambientIntensity = 0.3;
    pointIntensity = 1.0;
    pointColor = '#ffccbc';
  }

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <pointLight
        position={[0, 5, 0]}
        intensity={pointIntensity}
        color={pointColor}
        castShadow
      />
      {isOutside && (
        <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" castShadow />
      )}
    </>
  );
};

// ----------------------------------------------------------------------------
// MAIN COMPONENT EXPORT
// ----------------------------------------------------------------------------

export const House3DScene = ({
  currentLocation,
  onMoveTo,
  onTalkTo,
  onTask,
  characters,
  availableActions,
  dialogueActive
}: House3DSceneProps) => {
  
  // Filter appropriate actions for rendering interactive nodes
  const moveActions = availableActions.filter(a => a.type === 'move' && a.requiredLocation === currentLocation);
  const taskActions = availableActions.filter(a => a.type === 'task' && a.requiredLocation === currentLocation);

  return (
    <div className={styles.sceneWrapper}>
      <Canvas shadows camera={{ position: [0, 5, 8], fov: 50 }}>
        <Suspense fallback={<Html center><div className={styles.loader}>Loading World...</div></Html>}>
          
          <SceneLighting currentLocation={currentLocation} />
          <CameraReseter currentLocation={currentLocation} />
          
          {/* Controls - Disabled during dialogue */}
          <OrbitControls
            enabled={!dialogueActive}
            enablePan={false}
            enableZoom={true}
            minDistance={4}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2 - 0.1} // Prevent looking completely below the ground
          />

          {/* Core Geometry Based on Location */}
          {currentLocation === 'home_bedroom' && <BedroomGeometry />}
          {currentLocation === 'home_kitchen' && <KitchenGeometry />}
          {currentLocation === 'home_living_room' && <LivingRoomGeometry />}
          {currentLocation === 'street' && <StreetGeometry />}
          {currentLocation === 'shop' && <ShopGeometry />}
          {currentLocation === 'neighbor_house' && <NeighborHouseGeometry />}
          {currentLocation === 'dairy' && <DairyGeometry />}
          {currentLocation === 'school' && <SchoolGeometry />}

          {/* Render Characters currently in the room */}
          {Object.values(characters).map((char) => {
            if (char.currentLocation !== currentLocation) return null;
            
            const canTalk = availableActions.some(a => a.type === 'talk' && a.targetCharacter === char.id);
            
            return (
              <Character3D
                key={char.id}
                character={char}
                position={getCharacterPosition(char.id)}
                color={getCharacterColor(char.id)}
                canTalk={canTalk}
                onTalk={onTalkTo}
                disabled={dialogueActive}
              />
            );
          })}

          {/* Render Portals (Doors to other rooms) */}
          {moveActions.map((action, index) => (
            <Portal3D
              key={action.id}
              action={action}
              position={PORTAL_SLOTS[index % PORTAL_SLOTS.length]}
              onMove={onMoveTo}
              disabled={dialogueActive}
            />
          ))}

          {/* Render Active Tasks */}
          {onTask && taskActions.map((action, index) => (
            <Task3D
              key={action.id}
              action={action}
              position={TASK_SLOTS[index % TASK_SLOTS.length]}
              onComplete={onTask}
              disabled={dialogueActive}
            />
          ))}

        </Suspense>
      </Canvas>
    </div>
  );
};
