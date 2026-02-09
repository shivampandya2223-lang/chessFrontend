/* eslint-disable @typescript-eslint/no-explicit-any */
import { socket } from "./socket";
import { SOCKET_EVENT } from "./event";

export const socketActions = {
  disconnect: () => {
    socket.disconnect();
  },

  sendGameRequest: (toUserId: string) => {
    console.log("♟️ [Socket] Sending game request to:", toUserId);
    socket.emit(SOCKET_EVENT.SEND_GAME_REQUEST, { toUserId });
  },

  acceptGameRequest: (fromUserId: string) => {
    console.log("✅ [Socket] Accepting game request from:", fromUserId);
    socket.emit(SOCKET_EVENT.ACCEPT_GAME_REQUEST, { fromUserId });
  },

  declineGameRequest: (fromUserId: string) => {
    console.log("❌ [Socket] Declining game request from:", fromUserId);
    socket.emit(SOCKET_EVENT.DECLINE_GAME_REQUEST, { fromUserId });
  },

  makeMove: (roomId: string, move: any) => {
    console.log("🏹 [Socket] Making move in room:", roomId, move);
    socket.emit(SOCKET_EVENT.MOVE, { roomId, move });
  }
};

export const registerSocketListeners = ({
  onOnlineUsers,
  onGameStart,
  onGameMove,
  onGameEnd,
  onGameRejoin,
}: {
  onOnlineUsers?: (users: string[]) => void;
  onGameStart?: (data: any) => void;
  onGameMove?: (data: any) => void;
  onGameEnd?: (data: any) => void;
  onGameRejoin?: (data: any) => void;
}) => {
  if (onOnlineUsers) socket.on(SOCKET_EVENT.ONLINE_USERS, onOnlineUsers);
  if (onGameStart) socket.on(SOCKET_EVENT.GAME_START, onGameStart);
  if (onGameMove) socket.on(SOCKET_EVENT.MOVE, onGameMove);
  if (onGameEnd) socket.on(SOCKET_EVENT.GAME_END, onGameEnd);
  if (onGameRejoin) socket.on(SOCKET_EVENT.GAME_REJOIN, onGameRejoin);
};
