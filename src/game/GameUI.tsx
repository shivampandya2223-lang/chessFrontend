import { useGameStore } from "../store/gameStore";
import { useNavigate } from "react-router-dom";

export const GameUI = () => {
  const { currentTurn, gameStatus, resetGame } = useGameStore();

  const navigate = useNavigate();

  const getStatusMessage = () => {
    if (gameStatus === "checkmate") {
      return `Checkmate! ${currentTurn === "w" ? "Black" : "White"} wins!`;
    }
    if (gameStatus === "draw") return "Game drawn!";
    if (gameStatus === "stalemate") return "Stalemate!";
    return `${currentTurn === "w" ? "White" : "Black"}'s turn`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-auto">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gray-800/90 hover:bg-gray-700/90 text-white rounded-lg font-semibold backdrop-blur-md transition hover:scale-105"
        >
          ← Back to Home
        </button>

        <div className="px-8 py-4 bg-linear-to-r from-blue-600/90 to-purple-600/90 text-white rounded-xl font-bold text-xl backdrop-blur-md shadow-lg">
          {getStatusMessage()}
        </div>

        <button
          onClick={resetGame}
          className="px-6 py-3 bg-green-600/90 hover:bg-green-500/90 text-white rounded-lg font-semibold backdrop-blur-md transition hover:scale-105"
        >
          New Game
        </button>
      </div>

      {/* GAME OVER OVERLAY */}
      {gameStatus !== "playing" && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
          <div className="bg-linear-to-br from-gray-800 to-gray-900 p-12 rounded-2xl shadow-2xl text-center max-w-md">
            <h2 className="text-4xl font-bold text-white mb-4">
              {gameStatus === "checkmate" && "🏆 Checkmate!"}
              {gameStatus === "draw" && "🤝 Draw!"}
              {gameStatus === "stalemate" && "⚖️ Stalemate!"}
            </h2>

            <p className="text-xl text-gray-300 mb-8">
              {gameStatus === "checkmate" &&
                `${currentTurn === "w" ? "Black" : "White"} wins the game!`}
              {gameStatus === "draw" && "The game ended in a draw."}
              {gameStatus === "stalemate" && "No legal moves available."}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg transition hover:scale-105 shadow-lg"
              >
                Play Again
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-bold text-lg transition hover:scale-105 shadow-lg"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
