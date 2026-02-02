import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ChessBoard } from './ChessBoard';
import { useGameStore } from '../store/gameStore';
import ChessModel from '../hooks/chess-model';
import type { Square } from 'chess.js';
import { Group, Mesh } from 'three';

export const ChessScene = () => {
    const { scene } = ChessModel();
    const { selectedSquare, validMoves, selectSquare } = useGameStore();
    const chessModelRef = useRef<Group>(null);

    // Clone the entire chess model once and enable shadows
    const fullChessSet = useMemo(() => {
        const clonedScene = scene.clone();

        clonedScene.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        return clonedScene;
    }, [scene]);

    // Simple animation for visual feedback
    useFrame((state) => {
        if (chessModelRef.current) {
            // Subtle rotation animation
            chessModelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
        }
    });

    const handleSquareClick = (square: Square) => {
        selectSquare(square);
    };

    return (
        <group>
            {/* Interactive chess board for game logic */}
            <ChessBoard onSquareClick={handleSquareClick} />

            {/* 3D Chess model - rendered as complete set */}
            <group ref={chessModelRef} position={[0, 0.1, 0]}>
                <primitive object={fullChessSet} scale={1} />
            </group>
        </group>
    );
};
