import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";
import type { Square, Piece } from "chess.js";

import { ChessBoard } from "./ChessBoard";
import { ChessPiece } from "./ChessPiece";
import { useGameStore } from "../store/gameStore";
import ChessModel from "../hooks/chess-model";

/**
 * Convert chess square → world position
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
 * chess.js → model key
 */
const pieceKey = (piece: Piece) =>
  `${piece.color}_${piece.type}` as
    | "w_p"
    | "w_r"
    | "w_n"
    | "w_b"
    | "w_q"
    | "w_k"
    | "b_p"
    | "b_r"
    | "b_n"
    | "b_b"
    | "b_q"
    | "b_k";

export const ChessScene = () => {
  const { scene } = ChessModel();
  const { chess, selectedSquare, validMoves, selectSquare } = useGameStore();

  const boardRef = useRef<Group>(null);

  /**
   * BOARD MODEL (hide original pieces)
   */
  const boardModel = useMemo(() => {
    const clone = scene.clone();

    clone.traverse((child) => {
      // hide all GLTF pieces
      if (child.name.startsWith("W_") || child.name.startsWith("B_")) {
        child.visible = false;
      }

      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene]);

  /**
   * EXTRACT PIECE MODELS
   */
  const pieceModels = useMemo(() => {
    const map = new Map<string, Group>();

    scene.traverse((child) => {
      if (child.type !== "Object3D") return;
      if (!child.name) return;

      const name = child.name;

      const register = (key: string) => {
        if (map.has(key)) return; // only once per type
        const clone = child.clone(true);

        clone.traverse((c: any) => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });

        map.set(key, clone);
        console.log("Registered model:", key);
      };

      if (name.startsWith("W_Pawn")) register("w_p");
      if (name.startsWith("B_Pawn")) register("b_p");

      if (name.startsWith("W_Rook")) register("w_r");
      if (name.startsWith("B_Rook")) register("b_r");

      if (name.startsWith("W_Knight")) register("w_n");
      if (name.startsWith("B_Knight")) register("b_n");

      if (name.startsWith("W_Bishop")) register("w_b");
      if (name.startsWith("B_Bishop")) register("b_b");

      if (name.startsWith("W_Queen")) register("w_q");
      if (name.startsWith("B_Queen")) register("b_q");

      if (name.startsWith("W_King")) register("w_k");
      if (name.startsWith("B_King")) register("b_k");
    });

    console.log("FINAL PIECE MAP:", [...map.keys()]);
    return map;
  }, [scene]);

  /**
   * Board idle animation
   */
  useFrame((state) => {
    if (!boardRef.current) return;
    boardRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.02;
  });

  const board = chess.board();

  return (
    <group>
      {/* LOGIC BOARD */}
      <ChessBoard onSquareClick={selectSquare} />

      {/* STATIC BOARD */}
      <group ref={boardRef}>
        <primitive object={boardModel} />
      </group>

      {/* PIECES */}
      {board.map((rank, r) =>
        rank.map((piece, f) => {
          if (!piece) return null;

          const square = `${"abcdefgh"[f]}${8 - r}` as Square;
          const pos = squareToPosition(f, r);
          const key = pieceKey(piece);
          const model = pieceModels.get(key);

          if (!model) {
            console.warn("Missing model for:", key);
            return null;
          }

          return (
            <ChessPiece
              key={square}
              model={model}
              position={pos}
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
