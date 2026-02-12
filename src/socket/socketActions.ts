/* eslint-disable @typescript-eslint/no-explicit-any */
import { socket } from "./socket";
import { SOCKET_EVENT } from "./event";

export const socketActions = {
  disconnect: () => {
    socket.disconnect();
  },

  sendGameRequest: (toUserId: string, gameId: string) => {
    const fromUserId = localStorage.getItem("userId");
    const fromUsername = localStorage.getItem("username");
    const gameeId= localStorage.getItem("gameId");
    console.log("thisssssssss is game id",gameeId);

    if (!socket.connected) {
      console.error("❌ [Socket] Cannot send request - socket not connected!");
      alert("Connection error. Please refresh the page and try again.");
      return;
    }

    console.log("♟️ [Socket] Sending game request to:", toUserId, "with gameId:", gameId);

    socket.emit(SOCKET_EVENT.SEND_GAME_REQUEST, {
      toUserId,
      fromUserId,
      fromUsername,
      gameId : gameeId,
    });
  },

  acceptGameRequest: (fromUserId: string, gameId: string) => {
    const myUserId = localStorage.getItem("userId");
    const myUsername = localStorage.getItem("username");

    console.log("✅ [Socket] Accepting game request from:", fromUserId, "for gameId:", gameId);

    socket.emit(SOCKET_EVENT.ACCEPT_GAME_REQUEST, {
      fromUserId,
      myUserId,
      myUsername,
      gameId
    });
  },

  declineGameRequest: (fromUserId: string) => {
    console.log("❌ [Socket] Declining game request from:", fromUserId);
    socket.emit(SOCKET_EVENT.DECLINE_GAME_REQUEST, { fromUserId });
  },

  makeMove: (roomId: string, move: any) => {
    console.log("🏹 [Socket] Making move in room:", roomId, move);
    socket.emit(SOCKET_EVENT.MOVE, { roomId, move });
  },
  sendMessage: (roomId: string, message: string) => {
    console.log("💬 user send message", roomId, "this is meesage:", message);
    socket.emit(SOCKET_EVENT.GAME_MESSAGE, { roomId, message });
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
