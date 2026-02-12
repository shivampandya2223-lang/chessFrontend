import { useState, useRef, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { useSocketStore } from "../store/socketStore";
import { useNavigate } from "react-router-dom";
import { socketActions } from "../socket/socketActions";
import {
  FaHome,
  FaRedo,
  FaPaperPlane,
  FaChessBoard,
  FaCircle,
  FaDoorOpen,
} from "react-icons/fa";

export const GameUI = () => {
  const { currentTurn, gameStatus, resetGame, chatMessages } = useGameStore();
  const { currentRoom } = useSocketStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleMessageClick = () => {
    if (!message.trim() || !currentRoom?.roomId) return;
    socketActions.sendMessage(currentRoom.roomId, message);
    setMessage("");
  };

  const getStatusMessage = () => {
    if (gameStatus === "checkmate") {
      return `CHECKMATE! ${currentTurn === "w" ? "BLACK" : "WHITE"} WINS`;
    }
    if (gameStatus === "draw") return "GAME DRAWN";
    if (gameStatus === "stalemate") return "STALEMATE";
    return `${currentTurn === "w" ? "WHITE" : "BLACK"}'S TURN`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 font-premium">
      {/* TOP CONTROLS */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
        <div className="px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`h-3 w-3 rounded-full mb-1 ${currentTurn === "w" ? "bg-white shadow-[0_0_10px_white]" : "bg-gray-700"}`}
            />
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
              White
            </span>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2" />

          <div className="text-center min-w-50">
            <h2
              className={`text-xl font-bold tracking-tighter ${gameStatus !== "playing" ? "text-blue-400" : "text-white"}`}
            >
              {getStatusMessage()}
            </h2>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-0.5">
              Match in Progress
            </p>
          </div>

          <div className="h-8 w-px bg-white/10 mx-2" />

          <div className="flex flex-col items-center">
            <div
              className={`h-3 w-3 rounded-full mb-1 ${currentTurn === "b" ? "bg-white shadow-[0_0_10px_white]" : "bg-gray-700"}`}
            />
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
              Black
            </span>
          </div>
        </div>
      </div>

      {/* LEFT SIDEBAR (Actions) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto">
        <button
          onClick={() => navigate("/")}
          className="h-14 w-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:scale-105 transition-all shadow-xl group"
          title="Back to Home"
        >
          <FaHome size={20} />
        </button>
        <button
          onClick={resetGame}
          className="h-14 w-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-green-400 hover:bg-white/10 hover:scale-105 transition-all shadow-xl"
          title="New Game"
        >
          <FaRedo size={18} />
        </button>
        <button
          onClick={() => {
            if (currentRoom?.roomId && localStorage.getItem("username")) {
              socketActions.leaveGame(
                currentRoom.roomId,
                localStorage.getItem("username")!
              );
            }
            navigate("/");
          }}
          className="h-14 w-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-red-500/60 hover:text-red-500 hover:bg-red-500/10 hover:scale-105 transition-all shadow-xl"
          title="Leave Game"
        >
          <FaDoorOpen size={20} />
        </button>
      </div>

      {/* CHAT PANEL (Bottom Right) */}
      <div className="absolute bottom-10 right-10 w-87.5 bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <FaChessBoard className="text-blue-500" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">
              Room Chat
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaCircle size={6} className="text-green-500" />
            <span className="text-[10px] text-green-500 font-bold uppercase">
              Live
            </span>
          </div>
        </div>

        <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === (currentRoom?.creatorUsername || "You") ? "items-start" : "items-start"}`}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  {msg.sender}
                </span>
                <span className="text-[8px] text-white/30">
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : ""}
                </span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[90%]">
                <p className="text-sm text-gray-200 leading-relaxed font-normal">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
          {chatMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-20">
              <FaPaperPlane size={24} className="mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">
                No messages yet
              </p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 pt-2">
          <div className="relative group">
            <input
              placeholder="Type your message..."
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMessageClick()}
              className="w-full bg-white/5 hover:bg-white/10 text-white text-sm h-12 rounded-2xl px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-white/5 transition-all"
            />
            <button
              className="absolute right-2 top-2 h-8 w-8 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale"
              onClick={handleMessageClick}
              disabled={!message.trim()}
            >
              <FaPaperPlane size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* GAME OVER OVERLAY */}
      {gameStatus !== "playing" && (
        <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl flex items-center justify-center pointer-events-auto z-50 animate-in fade-in duration-500">
          <div className="max-w-md w-full bg-linear-to-b from-[#0f172a] to-[#020617] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] p-12 text-center overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 blur-[100px] pointer-events-none" />

            <div className="mb-8 scale-in-center">
              <div className="h-20 w-20 bg-linear-to-br from-blue-500 to-indigo-700 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl mb-6">
                <FaChessBoard size={40} />
              </div>
              <h2 className="text-5xl font-bold text-white tracking-tighter mb-2">
                {gameStatus === "checkmate" && "Victory!"}
                {gameStatus === "draw" && "Draw!"}
                {gameStatus === "stalemate" && "Stalemate!"}
              </h2>
              <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full" />
            </div>

            <p className="text-lg text-gray-400 mb-10 leading-relaxed font-light">
              {gameStatus === "checkmate" &&
                `${currentTurn === "w" ? "Black" : "White"} has achieved total dominance on the board.`}
              {gameStatus === "draw" &&
                "The battle ends without a victor tonight."}
              {gameStatus === "stalemate" &&
                "The game has reached an unbreakable deadlock."}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={resetGame}
                className="btn-premium btn-primary py-4 text-base"
              >
                REMATCH NOW
              </button>

              <button
                onClick={() => navigate("/")}
                className="btn-premium btn-secondary py-4 text-base"
              >
                RETURN HOME
              </button>
              <button
                onClick={() => {
                  if (currentRoom?.roomId && localStorage.getItem("username")) {
                    socketActions.leaveGame(
                      currentRoom.roomId,
                      localStorage.getItem("username")!
                    );
                  }
                  navigate("/");
                }}
                className="btn-leave btn-secondary py-4 text-base"
              >
                LEAVE THIS GAME
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
