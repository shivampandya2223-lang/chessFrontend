import { create } from "zustand";
import { Chess } from "chess.js";
import type { Square } from "chess.js";

export type GameStatus = "playing" | "checkmate" | "draw" | "stalemate";

interface GameState {
  chess: Chess;
  selectedSquare: Square | null;
  validMoves: Square[];
  currentTurn: "w" | "b";
  gameStatus: GameStatus;
  moveHistory: string[];
  lastMove: { from: Square; to: Square } | null;
  inCheck: boolean;

  // Actions
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square) => boolean;
  getValidMoves: (square: Square) => Square[];
  resetGame: () => void;
  undoMove: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  selectedSquare: null,
  validMoves: [],
  currentTurn: "w",
  gameStatus: "playing",
  moveHistory: [],
  lastMove: null,
  inCheck: false,

  selectSquare: (square) => {
    const { chess, selectedSquare } = get();

    // Deselect if same square clicked
    if (selectedSquare === square) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    // Try move if a square is already selected
    if (selectedSquare) {
      const moved = get().makeMove(selectedSquare, square);
      if (moved) {
        set({ selectedSquare: null, validMoves: [] });
        return;
      }
    }

    // Select own piece
    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      const moves = get().getValidMoves(square);
      set({ selectedSquare: square, validMoves: moves });
    } else {
      set({ selectedSquare: null, validMoves: [] });
    }
  },

  makeMove: (from, to) => {
    const { chess, moveHistory } = get();

    // Clone chess instance (IMPORTANT)
    const chessCopy = new Chess(chess.fen());
    const move = chessCopy.move({ from, to, promotion: "q" });

    if (!move) return false;

    let status: GameStatus = "playing";

    if (chessCopy.isCheckmate()) status = "checkmate";
    else if (chessCopy.isStalemate()) status = "stalemate";
    else if (chessCopy.isDraw()) status = "draw";

    set({
      chess: chessCopy,
      currentTurn: chessCopy.turn(),
      gameStatus: status,
      moveHistory: [...moveHistory, move.san],
      lastMove: { from, to },
      inCheck: chessCopy.isCheck(),
      selectedSquare: null,
      validMoves: [],
    });

    return true;
  },

  getValidMoves: (square) => {
    const { chess } = get();
    return chess
      .moves({ square, verbose: true })
      .map((move) => move.to);
  },

  undoMove: () => {
    const { chess } = get();
    const chessCopy = new Chess(chess.fen());

    chessCopy.undo();

    set({
      chess: chessCopy,
      currentTurn: chessCopy.turn(),
      gameStatus: "playing",
      lastMove: null,
      inCheck: chessCopy.isCheck(),
      selectedSquare: null,
      validMoves: [],
    });
  },

  resetGame: () => {
    set({
      chess: new Chess(),
      selectedSquare: null,
      validMoves: [],
      currentTurn: "w",
      gameStatus: "playing",
      moveHistory: [],
      lastMove: null,
      inCheck: false,
    });
  },
}));
