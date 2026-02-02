import { create } from 'zustand';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';

interface GameState {
    chess: Chess;
    selectedSquare: Square | null;
    validMoves: Square[];
    gameStatus: 'playing' | 'checkmate' | 'draw' | 'stalemate';
    currentTurn: 'w' | 'b';
    moveHistory: string[];

    // Actions
    selectSquare: (square: Square) => void;
    makeMove: (from: Square, to: Square) => boolean;
    resetGame: () => void;
    getValidMoves: (square: Square) => Square[];
}

export const useGameStore = create<GameState>((set, get) => ({
    chess: new Chess(),
    selectedSquare: null,
    validMoves: [],
    gameStatus: 'playing',
    currentTurn: 'w',
    moveHistory: [],

    selectSquare: (square: Square) => {
        const { chess, selectedSquare } = get();

        // If clicking the same square, deselect
        if (selectedSquare === square) {
            set({ selectedSquare: null, validMoves: [] });
            return;
        }

        // If a square is already selected, try to move
        if (selectedSquare) {
            const moved = get().makeMove(selectedSquare, square);
            if (moved) {
                set({ selectedSquare: null, validMoves: [] });
                return;
            }
        }

        // Select new square and show valid moves
        const piece = chess.get(square);
        if (piece && piece.color === chess.turn()) {
            const moves = get().getValidMoves(square);
            set({ selectedSquare: square, validMoves: moves });
        } else {
            set({ selectedSquare: null, validMoves: [] });
        }
    },

    makeMove: (from: Square, to: Square) => {
        const { chess } = get();

        try {
            const move = chess.move({ from, to, promotion: 'q' });

            if (move) {
                let status: 'playing' | 'checkmate' | 'draw' | 'stalemate' = 'playing';

                if (chess.isCheckmate()) status = 'checkmate';
                else if (chess.isDraw()) status = 'draw';
                else if (chess.isStalemate()) status = 'stalemate';

                set({
                    chess: new Chess(chess.fen()),
                    currentTurn: chess.turn(),
                    gameStatus: status,
                    moveHistory: [...get().moveHistory, move.san],
                });

                return true;
            }
        } catch (error) {
            console.log('Invalid move:', error);
        }

        return false;
    },

    getValidMoves: (square: Square) => {
        const { chess } = get();
        const moves = chess.moves({ square, verbose: true });
        return moves.map((move) => move.to);
    },

    resetGame: () => {
        set({
            chess: new Chess(),
            selectedSquare: null,
            validMoves: [],
            gameStatus: 'playing',
            currentTurn: 'w',
            moveHistory: [],
        });
    },
}));
