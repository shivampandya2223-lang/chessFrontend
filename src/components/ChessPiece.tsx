/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3, Mesh, Box3 } from "three";
import gsap from "gsap";

const MANUAL_OFFSETS: Record<string, [number, number, number]> = {
  w_k: [-0.01, 0, 0.36],
  w_q: [0, 0, -0.36],
  b_k: [0, 0, 0],
};

interface ChessPieceProps {
  model: Group;
  position: [number, number, number];
  isSelected: boolean;
  isValidMove: boolean;
  pieceKey: string; // 2. Add this prop
  onClick: () => void;
}

export const ChessPiece = ({
  model,
  position,
  isSelected,
  isValidMove,
  pieceKey, // 3. Destructure prop
  onClick,
}: ChessPieceProps) => {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const target = useRef(new Vector3(...position));

  const clonedModel = useMemo(() => {
    const clone = model.clone(true);

    clone.traverse((child) => {
      child.visible = true;
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.geometry.computeBoundingBox();
        child.geometry.computeBoundingSphere();
      }
    });

    const renderRoot = clone;

    const box = new Box3().setFromObject(renderRoot);
    const size = new Vector3();
    box.getSize(size);
    const center = new Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.z);
    const scaleFactor = 0.25 / (maxDim || 1);

    renderRoot.scale.setScalar(scaleFactor);

    // 4. Apply Auto-centering
    renderRoot.position.x = -center.x * scaleFactor;
    renderRoot.position.z = -center.z * scaleFactor;
    renderRoot.position.y = -box.min.y * scaleFactor;

    // 5. Apply Manual Offsets
    // Since we scaled the object, the offset needs to be relative to world space
    const offsets = MANUAL_OFFSETS[pieceKey];
    if (offsets) {
      renderRoot.position.x += offsets[0]; // Adjust X
      renderRoot.position.y += offsets[1]; // Adjust Y (rarely needed)
      renderRoot.position.z += offsets[2]; // Adjust Z
    }

    return renderRoot;
  }, [model, pieceKey]);

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
