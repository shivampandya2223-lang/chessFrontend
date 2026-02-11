import { useSocketStore } from "../store/socketStore";
import { socketActions } from "../socket/socketActions";
import { FaGamepad, FaTimes, FaCircle } from "react-icons/fa";

export const OnlineUsersModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { onlineUsers } = useSocketStore();
  const currentUserName = localStorage.getItem("username");

  const handleSendRequest = (toUserId: string, toUsername: string) => {
    console.log("🎯 [Challenge] Sending request to:", { toUserId, toUsername });
    socketActions.sendGameRequest(toUserId);
    // Optionally close after sending
    // onClose();
  };

  if (!isOpen) return null;

  const otherUsers = onlineUsers.filter(
    (user) => user.username !== currentUserName && user.isOnline,
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-100 p-4 scale-in-center">
      <div className="bg-[#0f172a] border border-white/10 rounded-4xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-2xl font-premium tracking-tight">
              Online Players
            </h2>
            <p className="text-blue-100/60 text-xs font-medium uppercase tracking-widest mt-1">
              {otherUsers.length} Players online now
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl p-2.5 transition-all"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Users List */}
        <div className="max-h-120 overflow-y-auto p-6 custom-scrollbar">
          {otherUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <RiGroupFill className="text-white/20 text-3xl" />
              </div>
              <p className="text-gray-400 font-medium">
                No other players online right now
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Check back in a few minutes!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {otherUsers.map((user) => {
                return (
                  <div
                    key={user.userId}
                    className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 transform hover:translate-x-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white/5 group-hover:ring-blue-500/50 transition-all">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-4 border-[#0f172a] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      </div>
                      <div>
                        <p className="text-white font-bold tracking-tight">
                          {user.username}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <FaCircle
                            size={6}
                            className="text-green-500 animate-pulse"
                          />
                          <span className="text-green-400/80 text-[10px] font-bold uppercase tracking-wider">
                            Available
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleSendRequest(user.userId, user.username)
                      }
                      className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95 group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-indigo-600"
                    >
                      <FaGamepad size={16} /> CHALLENGE
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white/5 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            Live Matchmaking System
          </p>
        </div>
      </div>
    </div>
  );
};

import { RiGroupFill } from "react-icons/ri";
