/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export const useStockfish = () => {
    const { isAI, chess, currentTurn, aiDifficulty, gameStatus } = useGameStore();
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        if (!isAI) return;

        // Initialize Stockfish Worker
        if (!workerRef.current) {
            console.log("🤖 [AI Hook] Initializing Stockfish Engine...");
            try {
                // Use the lite version which is under 100MB (GitHub limit)
                workerRef.current = new Worker('/stockfish/stockfish-18-lite-single.js');

                workerRef.current.onerror = (err) => {
                    console.error("🤖 [AI Hook] Worker Error:", err);
                };

                workerRef.current.onmessage = (e) => {
                    const message = e.data;
                    console.log("🤖 [AI Engine]:", message);

                    if (message.startsWith('bestmove')) {
                        const moveStr = message.split(' ')[1];
                        if (moveStr && moveStr !== '(none)') {
                            const from = moveStr.substring(0, 2);
                            const to = moveStr.substring(2, 4);
                            const promotion = moveStr.length > 4 ? moveStr.substring(4, 5) : 'q';

                            console.log(`🤖 [AI Hook] Found best move: ${from} -> ${to} (promotion: ${promotion})`);

                            // Small delay for realism
                            setTimeout(() => {
                                console.log(`🤖 [AI Hook] Executing move: ${from} -> ${to}`);
                                useGameStore.getState().makeMove(from as any, to as any);
                            }, 500);
                        } else {
                            console.warn("🤖 [AI Hook] Engine returned no best move (none)");
                        }
                    }
                };

                // Setup engine
                console.log("🤖 [AI Hook] Sending UCI init commands...");
                workerRef.current.postMessage('uci');
                workerRef.current.postMessage(`setoption name Skill Level value ${aiDifficulty}`);
                workerRef.current.postMessage('ucinewgame');
                workerRef.current.postMessage('isready');
            } catch (err) {
                console.error("🤖 [AI Hook] Failed to create Worker:", err);
            }
        }

        return () => {
            if (workerRef.current) {
                console.log("🤖 [AI Hook] Terminating Stockfish Worker...");
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, [isAI, aiDifficulty]);

    useEffect(() => {
        if (!isAI || gameStatus !== 'playing') return;

        // AI plays as Black ('b') by default
        if (currentTurn === 'b') {
            const fen = chess.fen();
            console.log("🤖 [AI Hook] It's AI's turn. Board state (FEN):", fen);
            if (workerRef.current) {
                console.log("🤖 [AI Hook] Requesting move from Stockfish...");
                workerRef.current.postMessage(`position fen ${fen}`);
                // Search depth based on difficulty
                const depth = Math.min(aiDifficulty, 15);
                workerRef.current.postMessage(`go depth ${depth}`);
            } else {
                console.error("🤖 [AI Hook] Worker ref is null when turn changed to Black");
            }
        }
    }, [currentTurn, isAI, gameStatus, chess, aiDifficulty]);

    return null;
};
