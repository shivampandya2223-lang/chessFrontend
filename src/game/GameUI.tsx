import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { useSocketStore } from "../store/socketStore";
import { useNavigate } from "react-router-dom";
import { socketActions } from "../socket/socketActions";

export const GameUI = () => {
  const { currentTurn, gameStatus, resetGame, chatMessages } = useGameStore();
  const { currentRoom } = useSocketStore();

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleMessageClick = () => {
    if (!message.trim() || !currentRoom?.roomId) return;
    console.log("THIS IS USER MESSAGE:->", message);
    socketActions.sendMessage(currentRoom.roomId, message);
    setMessage("");
  };

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
      <div className="absolute bottom-6 right-6 w-96 bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-lg pointer-events-auto flex flex-col gap-2">
        <div className="h-48 overflow-y-auto flex flex-col gap-2 mb-2 pr-2 custom-scrollbar">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className="text-sm wrap-break-word bg-white/5 p-2 rounded-lg"
            >
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-bold text-blue-400">{msg.sender}:</span>
                <span className="text-[10px] text-gray-400">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <span className="text-gray-200">{msg.message}</span>
            </div>
          ))}
          {chatMessages.length === 0 && (
            <div className="text-white/30 text-center text-sm py-4">
              No messages yet.
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            placeholder="Type a message..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleMessageClick()}
            className="flex-1 bg-gray-700/50 text-white h-10 rounded-lg px-3 focus:outline-hidden focus:ring-2 focus:ring-blue-500 border border-white/10"
          />
          <button
            className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleMessageClick}
            disabled={!message.trim()}
          >
            Send
          </button>
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
