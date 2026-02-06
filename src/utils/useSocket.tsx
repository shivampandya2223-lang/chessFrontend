import { useEffect } from "react";
import { socket } from "../socket/socket";
import { SOCKET_EVENT } from "../socket/event";
import { useSocketStore, type OnlineUser } from "../store/socketStore";
import { isLoggedIn } from "./auth";
import { useLocation, useNavigate } from "react-router-dom";

export const useSocket = () => {
  const {
    setConnected,
    setOnlineUsers,
    addGameRequest,
    removeGameRequest,
    setCurrentRoom,
    clearRequests,
  } = useSocketStore();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. Clean and Handle Token
    let cleanToken = token?.trim() || "";
    if (cleanToken.startsWith("Bearer ")) {
      cleanToken = cleanToken.slice(7).trim();
    }

    console.log("🔍 [Socket Debug] Effect triggered:", {
      path: location.pathname,
      isLoggedIn: isLoggedIn(),
      hasToken: !!cleanToken,
      socketStatus: socket.connected ? "Connected" : "Disconnected"
    });

    // 2. Handle Logout/Unauthorized state
    if (!isLoggedIn()) {
      if (socket.connected) {
        console.log("🔌 [Socket Debug] Disconnecting due to logout");
        socket.disconnect();
        setConnected(false);
      }
      return;
    }

    // 3. Handle Connection and Auth Injection
    const currentSocketToken = socket.auth && (socket.auth as any).token;

    if (cleanToken && cleanToken !== currentSocketToken) {
      console.log("🔄 [Socket Debug] New token detected. Reconnecting with fresh auth...");
      socket.disconnect();
      socket.auth = { token: cleanToken };
      socket.connect();
    } else if (!socket.connected && cleanToken) {
      console.log("📡 [Socket Debug] Initializing connection...");
      socket.auth = { token: cleanToken };
      socket.connect();
    }

    // --- Listeners ---

    const handleConnect = () => {
      console.log("✅ [Socket Debug] SOCKET CONNECTED! ID:", socket.id);
      setConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.warn("⚠️ [Socket Debug] SOCKET DISCONNECTED. Reason:", reason);
      setConnected(false);
    };

    const handleConnectError = (error: any) => {
      console.error("❌ [Socket Debug] CONNECTION ERROR:", error.message);
      if (error.message === "Invalid token" || error.message === "Unauthorized") {
        console.error("🚫 [Socket Debug] Auth Failure. Check JWT_SECRET keys.");
      }
      setConnected(false);
    };

    socket.on(SOCKET_EVENT.CONNECT, handleConnect);
    socket.on(SOCKET_EVENT.DISCONNECT, handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // Online users - WITH EXTRA SAFETY
    socket.on(SOCKET_EVENT.ONLINE_USERS, (userIds: any[]) => {
      console.log("👥 [Socket Debug] Online users updated:", userIds);

      if (!Array.isArray(userIds)) {
        console.error("❌ [Socket Debug] userIds is not an array:", userIds);
        return;
      }
      // Filter out null/undefined values and map to OnlineUser objects
      const users: OnlineUser[] = userIds
        .filter(id => id && typeof id === "string")
        .map(id => {
          const userObj = {
            userId: id,
            username: id === localStorage.getItem("userId")
              ? (localStorage.getItem("username") || "Me")
              : `User ${id.substring(0, 4)}`,
            isOnline: true
          };
          return userObj;
        });

      console.log("📍 [Socket Debug] Mapped Online Users:", users);
      setOnlineUsers(users);
    });

    // Game request received
    socket.on(SOCKET_EVENT.GAME_REQUEST_RECEIVED, (request: any) => {
      console.log("📨 [Socket Debug] New request:", request);
      addGameRequest({
        requestId: request.requestId,
        fromUserId: request.fromUserId,
        fromUsername: request.fromUsername,
        toUserId: localStorage.getItem("userId") || "",
        toUsername: localStorage.getItem("username") || "",
        createdAt: request.createdAt,
      });
    });

    // Game started
    socket.on(SOCKET_EVENT.GAME_START, (data: { roomId: string, white: string, black: string }) => {
      console.log("🎮 [Socket Debug] Game starting! Redirecting to /game...", data);

      setCurrentRoom({
        roomId: data.roomId,
        creatorId: data.white,
        creatorUsername: "Opponent",
        opponentId: data.black,
        apponentUsername: "Opponent",
        status: "active"
      });

      // Clear pending requests and navigate to game screen
      clearRequests();
      navigate("/game");
    });

    // Cleanup
    return () => {
      socket.off(SOCKET_EVENT.CONNECT, handleConnect);
      socket.off(SOCKET_EVENT.DISCONNECT, handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off(SOCKET_EVENT.ONLINE_USERS);
      socket.off(SOCKET_EVENT.GAME_REQUEST_RECEIVED);
      socket.off(SOCKET_EVENT.GAME_START);
    };
  }, [location.pathname, setConnected, setOnlineUsers, addGameRequest, removeGameRequest, setCurrentRoom, clearRequests, navigate]);

  return socket;
};
