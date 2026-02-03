/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3, Mesh, Box3 } from "three";
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

  const clonedModel = useMemo(() => {
    const clone = model.clone(true);
    let renderRoot: Group | null = null;

    clone.traverse((child) => {
      child.visible = true;
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.geometry.computeBoundingBox();
        child.geometry.computeBoundingSphere();
        if (!renderRoot) renderRoot = child.parent as Group;
      }
    });

    if (!renderRoot) return null;

    const box = new Box3().setFromObject(renderRoot);
    const center = new Vector3();
    box.getCenter(center);

    (renderRoot as Group).position.x -= center.x;
    (renderRoot as Group).position.z -= center.z;
    (renderRoot as Group).position.y -= box.min.y;

    (renderRoot as Group).scale.setScalar(0.6);

    return renderRoot;
  }, [model]);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(...position);
    target.current.set(...position);
  }, []);

  useEffect(() => {
    target.current.set(...position);
  }, [position]);

  useFrame(() => {
    if (!groupRef.current) return;

    const pos = groupRef.current.position;
    pos.x += (target.current.x - pos.x) * 0.12;
    pos.z += (target.current.z - pos.z) * 0.12;

    const lift = hovered || isSelected ? 0.15 : 0;
    const targetY = target.current.y + lift;
    pos.y += (targetY - pos.y) * 0.12;
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

      {clonedModel && <primitive object={clonedModel} />}
    </group>
  );
};
