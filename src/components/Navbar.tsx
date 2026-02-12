import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { logout, isLoggedIn } from "../utils/auth";
import { useState } from "react";
import { RiGroupFill } from "react-icons/ri";
import { useSocketStore, type GameRequest } from "../store/socketStore";
import { OnlineUsersModal } from "./OnlineUsersModal";
import { socketActions } from "../socket/socketActions";
import { FaCheck, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [showBtn, setShowBtn] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const { gameRequests, isConnected } = useSocketStore();

  const handleClick = () => {
    if (isLoggedIn()) {
      setShowBtn(!showBtn);
    } else {
      navigate("/loginPage");
    }
  };

  const handleLogout = () => {
    logout();
    setShowBtn(false);
    navigate("/loginPage");
  };

  const handleGroupClick = () => {
    if (!isLoggedIn()) return;

    if (showOnlineUsers || showRequests) {
      setShowOnlineUsers(false);
      setShowRequests(false);
      return;
    }

    if (gameRequests.length > 0) {
      setShowRequests(true);
    } else {
      setShowOnlineUsers(true);
    }
  };

  return (
    <>
      return (
      <>
        <nav className="fixed top-0 left-0 w-full h-20 flex items-center z-50 px-6 md:px-12 pointer-events-none">
          <div className="w-full flex justify-between items-center pointer-events-auto">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="h-10 w-10 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <span className="text-xl font-bold tracking-tighter">C</span>
              </div>
              <span className="text-2xl font-bold text-white tracking-tight font-premium hidden sm:block">
                CHESS<span className="text-blue-500">PRO</span>
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
              {isLoggedIn() && (
                <div className="relative">
                  <button
                    onClick={handleGroupClick}
                    className="relative h-11 w-11 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all group"
                    title="Online Players"
                  >
                    <RiGroupFill className="text-2xl text-white/80 group-hover:text-white transition-colors" />
                    <div
                      className={`absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-[#020617] ${isConnected ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-gray-500"}`}
                    ></div>
                    {gameRequests.length > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-lg h-5 min-w-5 px-1 flex items-center justify-center animate-pulse border-2 border-[#020617]">
                        {gameRequests.length}
                      </div>
                    )}
                  </button>

                  {showRequests && gameRequests.length > 0 && (
                    <div className="absolute top-14 right-0 w-80 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-4 flex justify-between items-center">
                        <h3 className="text-white font-bold text-sm">
                          Game Requests ({gameRequests.length})
                        </h3>
                        <button
                          onClick={() => setShowRequests(false)}
                          className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1 transition"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {gameRequests.map((request) => (
                          <GameRequestItem
                            key={request.requestId}
                            request={request}
                            onClose={() => setShowRequests(false)}
                          />
                        ))}
                      </div>

                      <div className="p-4 border-t border-white/5 bg-white/5">
                        <button
                          onClick={() => {
                            setShowRequests(false);
                            setShowOnlineUsers(true);
                          }}
                          className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl text-xs font-bold transition-all border border-white/10"
                        >
                          VIEW ALL PLAYERS
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

              {username && (
                <div className="px-3 hidden md:block">
                  <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase -mb-0.5">
                    Player
                  </p>
                  <p className="text-sm font-semibold text-white tracking-tight">
                    {username}
                  </p>
                </div>
              )}

              <div className="relative">
                <button
                  onClick={handleClick}
                  className="h-11 w-11 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all"
                >
                  <CgProfile size={24} />
                </button>

                {showBtn && (
                  <div className="absolute top-14 right-0 w-48 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-white/5 mb-1 md:hidden">
                      <p className="text-[10px] text-white/40 font-bold uppercase">
                        Player
                      </p>
                      <p className="text-sm font-semibold text-white truncate">
                        {username}
                      </p>
                    </div>
                    <button
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-semibold text-sm"
                      onClick={handleLogout}
                    >
                      <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                        <FaTimes />
                      </div>
                      Logout Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <OnlineUsersModal
          isOpen={showOnlineUsers}
          onClose={() => setShowOnlineUsers(false)}
        />
      </>
      );
      <OnlineUsersModal
        isOpen={showOnlineUsers}
        onClose={() => setShowOnlineUsers(false)}
      />
    </>
  );
};

const GameRequestItem = ({
  request,
  onClose,
}: {
  request: GameRequest;
  onClose: () => void;
}) => {
  const handleAccept = () => {
    socketActions.acceptGameRequest(request.fromUserId, request.gameId);
    onClose();
  };

  const handleReject = () => {
    socketActions.declineGameRequest(request.fromUserId);
  };

  return (
    <div className="p-4 border-b border-white/10 hover:bg-white/5 transition">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white font-semibold">{request.fromUsername}</p>
          <p className="text-gray-400 text-xs">wants to play chess with you</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
        >
          <FaCheck /> Accept
        </button>
        <button
          onClick={handleReject}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
        >
          <FaTimes /> Reject
        </button>
      </div>
    </div>
  );
};

export default Navbar;
