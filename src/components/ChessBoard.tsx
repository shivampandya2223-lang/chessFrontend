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
              {/* Invisible clickable plane */}
              <mesh
                position={[position[0], 2, position[2]]}
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  onSquareClick(square);
                }}
              >
                <planeGeometry args={[0.5, 0.5]} />
                <meshBasicMaterial transparent opacity={0} />
              </mesh>

              {/* Visual indicators for selected and valid moves */}
              {isSelected && (
                <mesh
                  position={[position[0], 0.15, position[2]]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <ringGeometry args={[0.15, 0.22, 32]} />
                  <meshBasicMaterial
                    color="#4ade80"
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              )}

              {isValidMove && !isSelected && (
                <mesh
                  position={[position[0], 0.15, position[2]]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <circleGeometry args={[0.12, 32]} />
                  <meshBasicMaterial
                    color="#60a5fa"
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              )}
            </group>
          );
        }),
      )}
    </group>
  );
};
