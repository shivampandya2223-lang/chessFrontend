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

  /**
   * 🔥 Clone + extract real mesh root + center correctly
   */
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

        // First mesh parent = real piece root
        if (!renderRoot) {
          renderRoot = child.parent as Group;
        }
      }
    });

    if (!renderRoot) return null;

    // 🔥 Center X/Z, rest on board (Y)
    const box = new Box3().setFromObject(renderRoot);

    const center = new Vector3();
    box.getCenter(center);

    // center horizontally
    renderRoot.position.x -= center.x;
    renderRoot.position.z -= center.z;

    // place bottom on board
    renderRoot.position.y -= box.min.y;

    // normalize scale (tweak if needed)
    renderRoot.scale.setScalar(0.6);

    return renderRoot;
  }, [model]);

  /**
   * Init position immediately (prevents snapping)
   */
  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(...position);
    target.current.set(...position);
  }, []);

  /**
   * Update target when chess state changes
   */
  useEffect(() => {
    target.current.set(position[0], position[1], position[2]);
  }, [position]);

  /**
   * Smooth animation loop
   */
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
      {/* Selected ring */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.25, 0.35, 32]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Valid move dot */}
      {isValidMove && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
        </mesh>
      )}

      {/* REAL CHESS PIECE */}
      {clonedModel && <primitive object={clonedModel} />}
    </group>
  );
};
