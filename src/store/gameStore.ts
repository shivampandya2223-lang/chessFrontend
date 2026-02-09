import { create } from "zustand";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { socketActions } from "../socket/socketActions";
import { useSocketStore } from "./socketStore";

export type GameStatus = "playing" | "checkmate" | "draw" | "stalemate";

interface GameState {
  chess: Chess;
  playerColor: "w" | "b" | null;
  selectedSquare: Square | null;
  validMoves: Square[];
  currentTurn: "w" | "b";
  gameStatus: GameStatus;
  moveHistory: string[];
  lastMove: { from: Square; to: Square } | null;
  inCheck: boolean;

  // Actions
  setPlayerColor: (color: "w" | "b" | null) => void;
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square) => void;
  updateGameState: (data: { fen: string; turn: "w" | "b"; status: GameStatus; move?: any }) => void;
  getValidMoves: (square: Square) => Square[];
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  playerColor: null,
  selectedSquare: null,
  validMoves: [],
  currentTurn: "w",
  gameStatus: "playing",
  moveHistory: [],
  lastMove: null,
  inCheck: false,

  setPlayerColor: (color) => set({ playerColor: color }),

  selectSquare: (square) => {
    const { chess, selectedSquare, playerColor, gameStatus } = get();

    if (gameStatus !== "playing") return;

    // 1. Ensure it's the player's turn
    if (playerColor !== chess.turn()) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    // Deselect if same square clicked
    if (selectedSquare === square) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    // Try move if a square is already selected
    if (selectedSquare) {
      // Check if the clicked square is a valid move for the selected piece
      const moves = get().getValidMoves(selectedSquare);
      if (moves.includes(square)) {
        get().makeMove(selectedSquare, square);
        return;
      }
    }

    // Select own piece
    const piece = chess.get(square);
    if (piece && piece.color === playerColor) {
      const moves = get().getValidMoves(square);
      set({ selectedSquare: square, validMoves: moves });
    } else {
      set({ selectedSquare: null, validMoves: [] });
    }
  },

  makeMove: (from, to) => {
    const { chess, playerColor } = get();

    // Prevent moves if it's not our turn
    if (playerColor !== chess.turn()) return;

    // Validate move locally first (optional but good for UX)
    const chessCopy = new Chess(chess.fen());
    const moveResult = chessCopy.move({ from, to, promotion: "q" });

    if (!moveResult) return;

    // NO OPTIMISTIC UPDATE HERE.
    // Instead, we just emit to the backend.
    const currentRoom = useSocketStore.getState().currentRoom;
    if (currentRoom?.roomId) {
      console.log("📤 [Authoritative] Emitting move to backend:", { from, to });
      socketActions.makeMove(currentRoom.roomId, { from, to, promotion: "q" });
    }

    // Clear local selection immediately for better UX
    set({ selectedSquare: null, validMoves: [] });
  },

  updateGameState: ({ fen, turn, status, move }) => {
    console.log("📥 [Authoritative] Updating state from backend FEN:", fen);


    const chessCopy = new Chess();
    try {
      chessCopy.load(fen);
    } catch (e) {
      console.error("❌ Failed to load FEN from backend:", fen);
      return;
    }

    set({
      chess: chessCopy,
      currentTurn: turn,
      gameStatus: status,
      inCheck: chessCopy.isCheck(),
      lastMove: move ? { from: move.from, to: move.to } : get().lastMove,
      selectedSquare: null,
      validMoves: [],
    });
  },

  getValidMoves: (square) => {
    const { chess } = get();
    return chess
      .moves({ square, verbose: true })
      .map((move) => move.to);
  },

  resetGame: () => {
    set({
      chess: new Chess(),
      playerColor: null,
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
