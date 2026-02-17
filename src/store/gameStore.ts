/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { socketActions } from "../socket/socketActions";
import { useSocketStore } from "./socketStore";


//board theme 

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
  chatMessages: { sender: string; message: string; timestamp?: number }[];
  isOffline: boolean;
  isAI: boolean;
  aiDifficulty: number;
  isAssetsLoaded: boolean;

  // Actions
  setAssetsLoaded: (loaded: boolean) => void;
  setPlayerColor: (color: "w" | "b" | null) => void;
  addChatMessage: (message: { sender: string; message: string; timestamp?: number }) => void;
  setChatMessages: (messages: { sender: string; message: string; timestamp?: number }[]) => void;
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square) => void;
  updateGameState: (data: { fen: string; turn: "w" | "b"; status: GameStatus; move?: any }) => void;
  getValidMoves: (square: Square) => Square[];
  resetGame: () => void;
  startOfflineGame: () => void;
  startAIGame: (difficulty?: number) => void;
  setAILevel: (level: number) => void;
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
  chatMessages: [],
  isOffline: false,
  isAI: false,
  aiDifficulty: 10,
  isAssetsLoaded: false,

  setAssetsLoaded: (loaded) => set({ isAssetsLoaded: loaded }),
  setPlayerColor: (color) => set({ playerColor: color }),

  addChatMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),

  setChatMessages: (messages) => set({ chatMessages: messages }),

  selectSquare: (square) => {
    const { chess, selectedSquare, playerColor, gameStatus, isOffline } = get();

    if (gameStatus !== "playing") return;

    // 1. Ensure it's the player's turn (only for online games)
    if (!isOffline && playerColor !== chess.turn()) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    // 2. For offline, ensure the piece belongs to the current turn
    const pieceAtTarget = chess.get(square);

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

    // Select piece
    if (pieceAtTarget && pieceAtTarget.color === chess.turn()) {
      const moves = get().getValidMoves(square);
      set({ selectedSquare: square, validMoves: moves });
    } else {
      set({ selectedSquare: null, validMoves: [] });
    }
  },

  makeMove: (from, to) => {
    const { chess, playerColor, isOffline, isAI } = get();

    // Online move logic
    if (!isOffline && !isAI) {
      if (playerColor !== chess.turn()) return;
      const currentRoom = useSocketStore.getState().currentRoom;
      if (currentRoom?.roomId) {
        console.log("📤 [Authoritative] Emitting move to backend:", { from, to });
        socketActions.makeMove(currentRoom.roomId, { from, to, promotion: "q" });
      }
    } else {
      // Offline/AI move logic
      console.log(`🎲 [GameStore] Attempting move: ${from} -> ${to}`);
      const chessCopy = new Chess(chess.fen());
      const moveResult = chessCopy.move({ from, to, promotion: "q" });

      if (moveResult) {
        console.log(`✅ [GameStore] Move successful. New FEN: ${chessCopy.fen()}`);
        let status: GameStatus = "playing";
        if (chessCopy.isCheckmate()) status = "checkmate";
        else if (chessCopy.isDraw()) status = "draw";
        else if (chessCopy.isStalemate()) status = "stalemate";

        set({
          chess: chessCopy,
          currentTurn: chessCopy.turn(),
          gameStatus: status,
          inCheck: chessCopy.isCheck(),
          lastMove: { from, to },
          selectedSquare: null,
          validMoves: [],
        });
      } else {
        console.error(`❌ [GameStore] Invalid move attempted: ${from} -> ${to}`);
      }
    }

    // Clear local selection immediately for better UX
    set({ selectedSquare: null, validMoves: [] });
  },

  updateGameState: ({ fen, turn, status, move }) => {
    // const { chess } = get();
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
      chatMessages: [],
      isOffline: false,
      isAI: false,
    });
  },

  startOfflineGame: () => {
    set({
      chess: new Chess(),
      playerColor: "w", // Default to white, but will be ignored for selection
      selectedSquare: null,
      validMoves: [],
      currentTurn: "w",
      gameStatus: "playing",
      moveHistory: [],
      lastMove: null,
      inCheck: false,
      chatMessages: [],
      isOffline: true,
      isAI: false,
    });
  },

  startAIGame: (difficulty = 10) => {
    set({
      chess: new Chess(),
      playerColor: "w",
      selectedSquare: null,
      validMoves: [],
      currentTurn: "w",
      gameStatus: "playing",
      moveHistory: [],
      lastMove: null,
      inCheck: false,
      chatMessages: [],
      isOffline: false,
      isAI: true,
      aiDifficulty: difficulty,
    });
  },

  setAILevel: (level: number) => set({ aiDifficulty: level }),
}));

