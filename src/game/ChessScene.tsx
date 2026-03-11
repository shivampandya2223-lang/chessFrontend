/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { ChessBoard } from "./ChessBoard";
import { ChessPiece } from "./ChessPiece";
import { useGameStore } from "../store/gameStore";
import ChessModel from "../hooks/chess-model";
import type { Square, Piece } from "chess.js";

// Convert chess square to world position
const squareToPosition = (
  file: number,
  rank: number,
): [number, number, number] => {
  const x = (file - 3.5) * 0.5;
  const z = (rank - 3.5) * 0.5;
  return [x, 0, z];
};

// Convert chess.js piece to key
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
  const { chess, selectedSquare, selectSquare, setAssetsLoaded } =
    useGameStore();
  const boardRef = useRef<Group>(null);

  useEffect(() => {
    setAssetsLoaded(true);
  }, [setAssetsLoaded]);

  const boardModel = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: any) => {
      if (child.name.startsWith("W_") || child.name.startsWith("B_"))
        child.visible = false;
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const pieceModels = useMemo(() => {
    const map = new Map<string, Group>();
    scene.traverse((child: any) => {
      if (!child.name) return;
      const name = child.name;

      const register = (key: string) => {
        if (map.has(key)) return;
        const clone = child.clone(true);
        clone.traverse((c: any) => {
          if (c.isMesh) c.castShadow = true;
        });
        map.set(key, clone);
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
    return map;
  }, [scene]);

  useFrame((state) => {
    if (!boardRef.current) return;
    boardRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
  });

  const board = chess.board();

  return (
    <group ref={boardRef}>
      <primitive object={boardModel} scale={2.35} position={[0, -0.4, -0.1]} />

      <ChessBoard onSquareClick={selectSquare} />

      {board.map((rank, r) =>
        rank.map((piece, f) => {
          if (!piece) return null;

          const square = `${"abcdefgh"[f]}${8 - r}` as Square;
          const pos = squareToPosition(f, r);
          const key = pieceKey(piece);
          const model = pieceModels.get(key);

          if (!model) return null;
          return (
            <ChessPiece
              key={square}
              model={model}
              position={pos}
              isSelected={selectedSquare === square}
              pieceKey={key}
              onClick={() => selectSquare(square)}
            />
          );
        }),
      )}
    </group>
  );
};
