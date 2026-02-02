import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";
import type { Square, Piece } from "chess.js";

import { ChessBoard } from "./ChessBoard";
import { ChessPiece } from "./ChessPiece";
import { useGameStore } from "../store/gameStore";
import ChessModel from "../hooks/chess-model";

/**
 * Convert chess square index → 3D world position
 */
const squareToPosition = (
  file: number,
  rank: number,
): [number, number, number] => {
  const x = (file - 3.5) * 0.5;
  const z = (3.5 - rank) * 0.5;
  return [x, 0.1, z];
};

/**
 * Map chess.js piece → model name
 * (you MUST match names inside your GLTF)
 */
const pieceKey = (piece: Piece) => `${piece.color}_${piece.type}`;

export const ChessScene = () => {
  const { scene } = ChessModel();
  const { chess, selectedSquare, validMoves, selectSquare } = useGameStore();

  const boardRef = useRef<Group>(null);

  /**
   * Clone scene ONCE
   * Hide pieces (we render them dynamically)
   */
  const boardModel = useMemo(() => {
    const clone = scene.clone();

    clone.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // hide piece meshes inside GLTF
        if (
          child.name.toLowerCase().includes("pawn") ||
          child.name.toLowerCase().includes("rook") ||
          child.name.toLowerCase().includes("knight") ||
          child.name.toLowerCase().includes("bishop") ||
          child.name.toLowerCase().includes("queen") ||
          child.name.toLowerCase().includes("king")
        ) {
          child.visible = false;
        }
      }
    });

    return clone;
  }, [scene]);

  /**
   * Extract individual piece models
   */
  const pieceModels = useMemo(() => {
    const map = new Map<string, Group>();

    scene.traverse((child) => {
      if (child instanceof Group) {
        const name = child.name.toLowerCase();

        if (
          name.includes("pawn") ||
          name.includes("rook") ||
          name.includes("knight") ||
          name.includes("bishop") ||
          name.includes("queen") ||
          name.includes("king")
        ) {
          map.set(name, child);
        }
      }
    });

    return map;
  }, [scene]);

  /**
   * Slight board idle animation
   */
  useFrame((state) => {
    if (!boardRef.current) return;
    boardRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
  });

  const board = chess.board();

  return (
    <group>
      {/* CLICKABLE LOGIC BOARD */}
      <ChessBoard onSquareClick={selectSquare} />

      {/* STATIC BOARD MODEL */}
      <group ref={boardRef} position={[0, 0, 0]}>
        <primitive object={boardModel} />
      </group>

      {/* DYNAMIC PIECES */}
      {board.map((rank, r) =>
        rank.map((piece, f) => {
          if (!piece) return null;

          const square = `${"abcdefgh"[f]}${8 - r}` as Square;
          const pos = squareToPosition(f, r);
          const key = pieceKey(piece);

          const model =
            pieceModels.get(`${piece.color}_${piece.type}`.toLowerCase()) ||
            pieceModels.get(piece.type); // fallback

          if (!model) return null;

          return (
            <ChessPiece
              key={square}
              model={model}
              position={pos}
              square={square}
              isSelected={selectedSquare === square}
              isValidMove={validMoves.includes(square)}
              onClick={() => selectSquare(square)}
            />
          );
        }),
      )}
    </group>
  );
};
