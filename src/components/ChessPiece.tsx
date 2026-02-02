import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import gsap from "gsap";

interface ChessPieceProps {
  model: Group;
  position: [number, number, number];
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

export const ChessPiece = ({
  model,
  position,
  isSelected,
  isValidMove,
  onClick,
}: ChessPieceProps) => {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const target = useRef(new Vector3(...position));
  const clonedModel = useMemo(() => model.clone(), [model]);

  // Update target when chess state changes
  useEffect(() => {
    target.current.set(position[0], position[1], position[2]);
  }, [position]);

  useFrame(() => {
    if (!groupRef.current) return;

    const pos = groupRef.current.position;

    // Smooth X/Z movement
    pos.x += (target.current.x - pos.x) * 0.12;
    pos.z += (target.current.z - pos.z) * 0.12;

    // Independent Y hover / select lift
    const lift = hovered || isSelected ? 0.15 : 0;
    const targetY = position[1] + lift;
    pos.y += (targetY - pos.y) * 0.1;
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();

    if (!groupRef.current) return;

    gsap.fromTo(
      groupRef.current.scale,
      { x: 1, y: 1, z: 1 },
      {
        x: 1.1,
        y: 1.1,
        z: 1.1,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      },
    );
  };

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={clonedModel} scale={isSelected ? 1.05 : 1} />

      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.25, 0.35, 32]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.6} />
        </mesh>
      )}

      {isValidMove && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};
