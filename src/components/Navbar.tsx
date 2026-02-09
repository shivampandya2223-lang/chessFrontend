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
    if (isLoggedIn()) {
      if (gameRequests.length > 0 && !showOnlineUsers) {
        setShowRequests(!showRequests);
      } else {
        setShowOnlineUsers(!showOnlineUsers);
        setShowRequests(false);
      }
    }
  };

  return (
    <>
      <div className="w-full h-14 absolute top-0 left-0 flex z-50 bg-linear-to-l from-purple-400/20 to-purple-200/60">
        <div className="flex h-full w-full justify-between pr-4 pl-4 text-center items-center">
          <div className="text-xl font-bold">Chess</div>
          <div className="flex items-center gap-4">
            {isLoggedIn() && (
              <div className="relative">
                <button
                  onClick={handleGroupClick}
                  className="relative hover:scale-110 transition-transform"
                >
                  <RiGroupFill className="text-2xl flex" />
                  <div
                    className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${isConnected ? "bg-green-500" : "bg-gray-500"}`}
                  ></div>
                  {gameRequests.length > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {gameRequests.length}
                    </div>
                  )}
                </button>

                {showRequests && gameRequests.length > 0 && (
                  <div className="absolute top-12 right-0 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
                    <div className="bg-linear-to-r from-purple-600 to-blue-600 p-3 flex justify-between items-center">
                      <h3 className="text-white font-bold text-sm">
                        Game Requests ({gameRequests.length})
                      </h3>
                      <button
                        onClick={() => setShowRequests(false)}
                        className="text-white hover:bg-white/20 rounded px-2 py-1 text-xs"
                      >
                        Close
                      </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {gameRequests.map((request) => (
                        <GameRequestItem
                          key={request.requestId}
                          request={request}
                          onClose={() => setShowRequests(false)}
                        />
                      ))}
                    </div>

                    <div className="p-3 border-t border-white/10">
                      <button
                        onClick={() => {
                          setShowRequests(false);
                          setShowOnlineUsers(true);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold transition"
                      >
                        View All Players
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {username && <div className="text-sm font-medium">{username}</div>}

            <div className="h-10 w-10 rounded-full flex items-center justify-center relative">
              <button
                onClick={handleClick}
                className="w-full h-full hover:cursor-pointer rounded-full hover:scale-110 transition-transform"
              >
                <CgProfile className="h-full w-full text-black" />
              </button>
              {showBtn && (
                <div className="absolute top-12 right-0">
                  <button
                    className="bg-red-500 p-2 rounded-xl text-white hover:cursor-pointer hover:bg-red-600 transition whitespace-nowrap"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
    socketActions.acceptGameRequest(request.fromUserId);
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
