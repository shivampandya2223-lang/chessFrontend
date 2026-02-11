import type { Square } from "chess.js";
import { useGameStore } from "../store/gameStore";

interface ChessBoardProps {
  onSquareClick: (square: Square) => void;
}

export const ChessBoard = ({ onSquareClick }: ChessBoardProps) => {
  const { validMoves, selectedSquare } = useGameStore();

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const getSquarePosition = (
    file: number,
    rank: number,
  ): [number, number, number] => {
    const x = (file - 3.5) * 0.5;
    const z = (rank - 3.5) * 0.5;
    return [x, 0, z];
  };

  return (
    <group>
      {files.map((file, fileIndex) =>
        ranks.map((rank, rankIndex) => {
          const square = `${file}${rank}` as Square;
          const position = getSquarePosition(fileIndex, rankIndex);
          const isSelected = selectedSquare === square;
          const isValidMove = validMoves.includes(square);

          return (
            <group key={square}>
              <mesh
                position={[position[0], 0.01, position[2]]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  onSquareClick(square);
                }}
              >
                <planeGeometry args={[0.5, 0.5]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>

              {/* Selection Marker */}
              {isSelected && (
                <mesh
                  position={[position[0], 0.05, position[2]]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <ringGeometry args={[0.18, 0.23, 64]} />
                  <meshBasicMaterial
                    color="#60a5fa"
                    transparent
                    opacity={0.8}
                  />
                  <mesh
                    position={[0, 0, -0.01]}
                  >
                    <ringGeometry args={[0.16, 0.25, 64]} />
                    <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
                  </mesh>
                </mesh>
              )}

              {/* Legal Move Marker */}
              {isValidMove && !isSelected && (
                <mesh
                  position={[position[0], 0.05, position[2]]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <circleGeometry args={[0.08, 32]} />
                  <meshBasicMaterial
                    color="#10b981"
                    transparent
                    opacity={0.6}
                  />
                  {/* Subtle outer glow for move */}
                  <mesh position={[0, 0, -0.005]}>
                    <ringGeometry args={[0.1, 0.12, 32]} />
                    <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
                  </mesh>
                </mesh>
              )}
            </group>
          );
        }),
      )}
    </group>
  );
};
