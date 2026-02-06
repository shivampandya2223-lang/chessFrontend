/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSocketStore } from "../store/socketStore";
import { socket } from "../socket/socket";
import { SOCKET_EVENT } from "../socket/event";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useCreateRoomMutation } from "../queries/game.queries";

export const GameRequestsPopup = () => {
  const { mutate: createRoomApi } = useCreateRoomMutation();
  const { gameRequests } = useSocketStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleAccept = (requestId: string, fromUsername: string) => {
    createRoomApi(
      { opponentUsername: fromUsername },
      {
        onSuccess: (res: any) => {
          socket.emit(SOCKET_EVENT.ACCEPT_GAME_REQUEST, {
            requestId,
            room: res.data.room,
          });
          setIsOpen(false);
        },
        onError: (err: any) => {
          console.error("Failed to create room via API:", err);
          alert("Could not create game room.");
        },
      },
    );
  };

  const handleReject = (requestId: string) => {
    socket.emit(SOCKET_EVENT.REJECT_GAME_REQUEST, requestId);
  };

  if (gameRequests.length === 0) return null;

  return (
    <div className="relative">
      {/* Notification Badge */}
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
        {gameRequests.length}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="bg-linear-to-r from-purple-600 to-blue-600 p-3">
            <h3 className="text-white font-bold text-sm">
              Game Requests ({gameRequests.length})
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {gameRequests.map((request) => (
              <div
                key={request.requestId}
                className="p-4 border-b border-white/10 hover:bg-white/5 transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">
                      {request.fromUsername}
                    </p>
                    <p className="text-gray-400 text-xs">
                      wants to play chess with you
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleAccept(request.requestId, request.fromUsername)
                    }
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.requestId)}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="relative"></button>
    </div>
  );
};
