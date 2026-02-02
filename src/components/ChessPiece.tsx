import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import gsap from 'gsap';
import type { Square } from 'chess.js';

interface ChessPieceProps {
    model: Group;
    position: [number, number, number];
    square: Square;
    isSelected: boolean;
    isValidMove: boolean;
    onClick: () => void;
}

export const ChessPiece = ({
    model,
    position,
    square,
    isSelected,
    isValidMove,
    onClick,
}: ChessPieceProps) => {
    const groupRef = useRef<Group>(null);
    const [hovered, setHovered] = useState(false);
    const targetPosition = useRef(new Vector3(...position));

    // Smooth position animation
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.lerp(targetPosition.current, 0.1);

            // Hover effect
            const targetY = position[1] + (hovered || isSelected ? 0.15 : 0);
            groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
        }
    });

    // Update target position when prop changes
    if (targetPosition.current.x !== position[0] ||
        targetPosition.current.z !== position[2]) {
        targetPosition.current.set(...position);
    }

    const handleClick = (e: any) => {
        e.stopPropagation();
        onClick();

        // Click animation
        if (groupRef.current) {
            gsap.to(groupRef.current.scale, {
                x: 1.1,
                y: 1.1,
                z: 1.1,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
            });
        }
    };

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <primitive
                object={model.clone()}
                scale={isSelected ? 1.05 : 1}
            />

            {/* Selection indicator */}
            {isSelected && (
                <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.25, 0.35, 32]} />
                    <meshBasicMaterial color="#4ade80" transparent opacity={0.6} />
                </mesh>
            )}

            {/* Valid move indicator */}
            {isValidMove && (
                <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.15, 32]} />
                    <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
                </mesh>
            )}
        </group>
    );
};
