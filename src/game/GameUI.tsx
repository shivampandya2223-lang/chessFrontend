import { useGameStore } from "../store/gameStore";
import { useNavigate } from "react-router-dom";

export const GameUI = () => {
  const { currentTurn, gameStatus, moveHistory, resetGame } = useGameStore();

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

      {/* MOVE HISTORY */}
      <div className="absolute right-6 top-24 bottom-6 w-64 bg-gray-900/90 backdrop-blur-md rounded-xl p-4 flex flex-col pointer-events-auto shadow-2xl">
        <h3 className="text-white font-bold text-lg mb-3 border-b border-gray-700 pb-2">
          Move History
        </h3>

        <div className="flex-1 overflow-y-auto space-y-1">
          {moveHistory.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No moves yet</p>
          ) : (
            moveHistory.map((move, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded text-sm ${
                  index % 2 === 0
                    ? "bg-blue-600/30 text-blue-100"
                    : "bg-purple-600/30 text-purple-100"
                }`}
              >
                <span className="font-semibold text-gray-300">
                  {Math.floor(index / 2) + 1}.
                </span>{" "}
                {move}
              </div>
            ))
          )}
        </div>
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
