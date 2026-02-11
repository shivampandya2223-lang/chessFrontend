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
  pieceKey: string; // 2. Add this prop
  onClick: () => void;
}

export const ChessPiece = ({
  model,
  position,
  isSelected,
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

        // Premium Material Override
        if (child.material) {
          // White pieces material
          if (pieceKey.startsWith("w_")) {
            child.material = child.material.clone() as any;
            child.material.color.set("#ffffff");
            child.material.metalness = 0.2;
            child.material.roughness = 0.1;
          }
          // Black pieces material
          else if (pieceKey.startsWith("b_")) {
            child.material = child.material.clone() as any;
            child.material.color.set("#1a1a1a");
            child.material.metalness = 0.4;
            child.material.roughness = 0.3;
          }
        }
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
      {clonedModel && <primitive object={clonedModel} />}
    </group>
  );
};
