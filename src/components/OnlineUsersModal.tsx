import { useSocketStore } from "../store/socketStore";
import { socketActions } from "../socket/socketActions";
import { FaGamepad, FaTimes } from "react-icons/fa";

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
    console.log("🎯 [Challenge] From:", {
      userId: localStorage.getItem("userId"),
      username: localStorage.getItem("username"),
    });
    socketActions.sendGameRequest(toUserId);
    console.log("✅ [Challenge] Request sent via socket");
  };

  if (!isOpen) return null;

  const otherUsers = onlineUsers.filter(
    (user) => user.username !== currentUserName && user.isOnline,
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-xl">
            Online Players ({otherUsers.length})
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Users List */}
        <div className="max-h-96 overflow-y-auto p-4">
          {otherUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No other players online</p>
            </div>
          ) : (
            <div className="space-y-3">
              {otherUsers.map((user) => {
                return (
                  <div
                    key={user.userId}
                    className="bg-white/5 hover:bg-white/10 rounded-xl p-4 flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 bg-linear-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {user.username}
                        </p>
                        <p className="text-green-400 text-xs">Online</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendRequest(user.userId, user.username)}
                      className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2"
                    >
                      <FaGamepad /> Challenge
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
