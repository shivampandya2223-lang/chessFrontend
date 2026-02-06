import { useEffect } from "react";
import { socket } from "../socket/socket";
import { SOCKET_EVENT } from "../socket/event";
import { useSocketStore } from "../store/socketStore";
import type { GameRequest, GameRoom, OnlineUser } from "../store/socketStore";
import { isLoggedIn } from "./auth";

export const useSocket = () => {
  const {
    setConnected,
    setOnlineUsers,
    addGameRequest,
    removeGameRequest,
    removeSentRequest,
    setCurrentRoom,
  } = useSocketStore();

  useEffect(() => {
    // Only connect if user is logged in
    if (!isLoggedIn()) return;

    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Connection events
    socket.on(SOCKET_EVENT.CONNECT, () => {
      console.log("✅ Socket connected");
      setConnected(true);
    });

    socket.on(SOCKET_EVENT.DISCONNECT, () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    });

    socket.on(SOCKET_EVENT.ERROR, (error: { message?: string } | string) => {
      console.error("Socket error:", error);
    });

    // Online users
    socket.on(SOCKET_EVENT.ONLINE_USERS, (users: OnlineUser[]) => {
      console.log("👥 Online users:", users);
      setOnlineUsers(users);
    });

    socket.on(SOCKET_EVENT.USER_CONNECTED, (user: OnlineUser) => {
      console.log("✅ User connected:", user);
      const currentUsers = useSocketStore.getState().onlineUsers;
      setOnlineUsers([...currentUsers.filter((u) => u.userId !== user.userId), user]);
    });

    socket.on(SOCKET_EVENT.USER_DISCONNECTED, (userId: string) => {
      console.log("❌ User disconnected:", userId);
      const currentUsers = useSocketStore.getState().onlineUsers;
      setOnlineUsers(currentUsers.filter((u) => u.userId !== userId));
    });

    // Game request received
    socket.on(SOCKET_EVENT.GAME_REQUEST_RECEIVED, (request: GameRequest) => {
      console.log("📨 Game request received:", request);
      addGameRequest(request);
    });

    // Game request accepted
    socket.on(SOCKET_EVENT.ACCEPT_GAME_REQUEST, (data: { requestId: string; room: GameRoom }) => {
      console.log("✅ Game request accepted:", data);
      removeGameRequest(data.requestId);
      removeSentRequest(data.requestId);
      setCurrentRoom(data.room);
    });

    // Game request rejected
    socket.on(SOCKET_EVENT.REJECT_GAME_REQUEST, (requestId: string) => {
      console.log("❌ Game request rejected:", requestId);
      removeSentRequest(requestId);
    });

    // Game request cancelled
    socket.on(SOCKET_EVENT.CANCEL_GAME_REQUEST, (requestId: string) => {
      console.log("🚫 Game request cancelled:", requestId);
      removeGameRequest(requestId);
    });

    // Room events
    socket.on(SOCKET_EVENT.ROOM_CREATED, (room: GameRoom) => {
      console.log("🏠 Room created:", room);
      setCurrentRoom(room);
    });

    socket.on(SOCKET_EVENT.ROOM_JOINED, (room: GameRoom) => {
      console.log("🚪 Joined room:", room);
      setCurrentRoom(room);
    });

    socket.on(SOCKET_EVENT.GAME_START, (room: GameRoom) => {
      console.log("🎮 Game started:", room);
      setCurrentRoom(room);
    });

    // Cleanup
    return () => {
      socket.off(SOCKET_EVENT.CONNECT);
      socket.off(SOCKET_EVENT.DISCONNECT);
      socket.off(SOCKET_EVENT.ERROR);
      socket.off(SOCKET_EVENT.ONLINE_USERS);
      socket.off(SOCKET_EVENT.USER_CONNECTED);
      socket.off(SOCKET_EVENT.USER_DISCONNECTED);
      socket.off(SOCKET_EVENT.GAME_REQUEST_RECEIVED);
      socket.off(SOCKET_EVENT.ACCEPT_GAME_REQUEST);
      socket.off(SOCKET_EVENT.REJECT_GAME_REQUEST);
      socket.off(SOCKET_EVENT.CANCEL_GAME_REQUEST);
      socket.off(SOCKET_EVENT.ROOM_CREATED);
      socket.off(SOCKET_EVENT.ROOM_JOINED);
      socket.off(SOCKET_EVENT.GAME_START);
      // We don't always want to disconnect if other components use it,
      // but since Navbar is global, it's fine.
    };
  }, [setConnected, setOnlineUsers, addGameRequest, removeGameRequest, removeSentRequest, setCurrentRoom]);

  return socket;
};
