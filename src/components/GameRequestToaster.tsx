import { useSocketStore } from "../store/socketStore";
import { socketActions } from "../socket/socketActions";
import { FaCheck, FaTimes, FaChess } from "react-icons/fa";

export const GameRequestToaster = () => {
  const { gameRequests, removeGameRequest } = useSocketStore();

  if (gameRequests.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-9999 flex flex-col gap-4">
      {gameRequests.map((request) => (
        <div
          key={request.requestId}
          className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 w-80 animate-in fade-in slide-in-from-right-8 duration-300"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-linear-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
              <FaChess />
            </div>
            <div>
              <p className="text-white font-bold">{request.fromUsername}</p>
              <p className="text-gray-400 text-xs">Challenged you to a game!</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                socketActions.acceptGameRequest(request.fromUserId, request.gameId);
                removeGameRequest(request.requestId);
              }}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <FaCheck /> Accept
            </button>
            <button
              onClick={() => {
                socketActions.declineGameRequest(request.fromUserId);
                removeGameRequest(request.requestId);
              }}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <FaTimes /> Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
