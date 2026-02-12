/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { socket } from "../socket/socket";
import { SOCKET_EVENT } from "../socket/event";
import { useSocketStore, type OnlineUser } from "../store/socketStore";
import { useGameStore } from "../store/gameStore";
import { isLoggedIn } from "./auth";
import { useLocation, useNavigate } from "react-router-dom";

export const useSocket = () => {
  const token = localStorage.getItem("token");
  const myUserId = localStorage.getItem("userId");
  const myUsername = localStorage.getItem("username");

  const {
    setConnected,
    setOnlineUsers,
    addGameRequest,
    setCurrentRoom,
    clearRequests,
  } = useSocketStore();

  const { updateGameState, setPlayerColor, addChatMessage, setChatMessages } =
    useGameStore();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Clean and Handle Token
    let cleanToken = token?.trim() || "";
    if (cleanToken.startsWith("Bearer ")) {
      cleanToken = cleanToken.slice(7).trim();
    }

    console.log("🔍 [Socket Debug] Effect triggered:", {
      path: location.pathname,
      isLoggedIn: isLoggedIn(),
      hasToken: !!cleanToken,
      socketStatus: socket.connected ? "Connected" : "Disconnected",
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
      console.log(
        "🔄 [Socket Debug] New token detected. Reconnecting with fresh auth...",
      );
      socket.disconnect();
      socket.auth = { token: cleanToken, userId: myUserId, username: myUsername };
      socket.connect();
    } else if (!socket.connected && cleanToken) {
      console.log("📡 [Socket Debug] Initializing connection...");
      socket.auth = { token: cleanToken, userId: myUserId, username: myUsername };
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
      setConnected(false);
    };

    socket.on(SOCKET_EVENT.CONNECT, handleConnect);
    socket.on(SOCKET_EVENT.DISCONNECT, handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // Online users
    socket.on(SOCKET_EVENT.ONLINE_USERS, (users: any[]) => {
      console.log("👥 [Socket Debug] Raw Online Users Event:", users);
      if (!Array.isArray(users)) return;

      const onlineUsers: OnlineUser[] = users
        .filter((user) => user && typeof user === "object" && user.userId)
        .map((user) => ({
          userId: user.userId,
          username: user.username || user.userId,
          isOnline: true,
        }));

      console.log("👥 [Socket Debug] Processed Online Users:", onlineUsers);
      setOnlineUsers(onlineUsers);
    });

    // Game request received
    socket.on(SOCKET_EVENT.GAME_REQUEST_RECEIVED, (request: any) => {
      console.log("📨 [Socket Debug] New request received:", request);

      const myUsername = localStorage.getItem("username") || "Me";

      addGameRequest({
        requestId: request.requestId,
        gameId: request.gameId, // Added gameId
        fromUserId: request.fromUserId,
        fromUsername: request.fromUsername,
        toUserId: myUserId || "",
        toUsername: myUsername,
        createdAt: request.createdAt,
      });

      console.log("✅ [Socket Debug] Request added to store");
    });

    socket.on(SOCKET_EVENT.GAME_REQUEST_DECLINED, (data: any) => {
      console.log("❌ [Socket Debug] Game request declined by:", data.by);
      // Optional: Show toast or notification
    });

    // Game started
    socket.on(SOCKET_EVENT.GAME_START, (data: any) => {
      console.log("🎮 [Socket Debug] Game starting!", data);

      const color = myUserId === data.white ? "w" : "b";
      setPlayerColor(color);

      setCurrentRoom({
        roomId: data.roomId,
        creatorId: data.white,
        creatorUsername: data.white === myUserId ? "Me" : "Opponent",
        opponentId: data.black,
        apponentUsername: data.black === myUserId ? "Me" : "Opponent",
        status: "active",
      });

      // Sync the board state using backend FEN
      updateGameState({
        fen: data.fen,
        turn: data.fen.split(" ")[1] as "w" | "b",
        status: "playing",
      });

      // 3. Sync chat history if available
      if (Array.isArray(data.messages)) {
        console.log("💬 [Socket Debug] Syncing chat history:", data.messages);
        setChatMessages(
          data.messages.map((msg: any) => ({
            sender: msg.username || msg.sender || "Opponent",
            message:
              msg.text ||
              msg.message ||
              (typeof msg === "string" ? msg : JSON.stringify(msg)),
            timestamp: msg.time || Date.now(),
          })),
        );
      } else {
        setChatMessages([]);
      }

      clearRequests();
      navigate("/game");
    });

    // Game rejoined
    socket.on(SOCKET_EVENT.GAME_REJOIN, (data: any) => {
      console.log("🔄 [Socket Debug] Rejoining active game:", data);

      const color = myUserId === data.white ? "w" : "b";
      setPlayerColor(color);

      setCurrentRoom({
        roomId: data.roomId,
        creatorId: data.white,
        creatorUsername: data.white === myUserId ? "Me" : "Opponent",
        opponentId: data.black,
        apponentUsername: data.black === myUserId ? "Me" : "Opponent",
        status: data.status === "playing" ? "active" : "finished",
      });

      // Sync the board state
      updateGameState({
        fen: data.fen,
        turn: data.turn || (data.fen.split(" ")[1] as "w" | "b"),
        status: data.status as any,
      });

      // 3. Sync chat history if available
      if (Array.isArray(data.messages)) {
        console.log("💬 [Socket Debug] Syncing chat history:", data.messages);
        setChatMessages(
          data.messages.map((msg: any) => ({
            sender: msg.username || msg.sender || "Opponent",
            message:
              msg.text ||
              msg.message ||
              (typeof msg === "string" ? msg : JSON.stringify(msg)),
            timestamp: msg.time || Date.now(),
          })),
        );
      }

      navigate("/game");
    });

    // Authoritative Move sync
    socket.on(SOCKET_EVENT.MOVE, (data: any) => {
      console.log("♟️ [Authoritative] Syncing move from backend:", data);

      // Update local state using FEN (Authoritative source of truth)
      if (data.fen) {
        updateGameState({
          fen: data.fen,
          turn: data.turn || (data.fen.split(" ")[1] as "w" | "b"),
          status: data.status,
          move: data.move, // Pass the move info to highlight start/end squares
        });
      }
    });

    socket.on(SOCKET_EVENT.GAME_END, (data: any) => {
      console.log("🏁 [Socket Debug] Game ended:", data);
    });

    socket.on(SOCKET_EVENT.GAME_MESSAGE, (data: any) => {
      console.log("💬 [Socket Debug] Message received:", data);

      // Handle the specific payload structure { userId, username, text, time }
      const sender = data.username || data.sender || "Opponent";
      const message =
        data.text ||
        data.message ||
        (typeof data === "string" ? data : JSON.stringify(data));
      const timestamp = data.time || Date.now();

      addChatMessage({
        sender,
        message,
        timestamp,
      });
    });

    return () => {
      socket.off(SOCKET_EVENT.CONNECT, handleConnect);
      socket.off(SOCKET_EVENT.DISCONNECT, handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off(SOCKET_EVENT.ONLINE_USERS);
      socket.off(SOCKET_EVENT.GAME_REQUEST_RECEIVED);
      socket.off(SOCKET_EVENT.GAME_START);
      socket.off(SOCKET_EVENT.GAME_REJOIN);
      socket.off(SOCKET_EVENT.MOVE);
      socket.off(SOCKET_EVENT.GAME_END);
      socket.off(SOCKET_EVENT.GAME_MESSAGE);
    };
  }, [
    location.pathname,
    token,
    myUserId,
    myUsername,
    setConnected,
    setOnlineUsers,
    addGameRequest,
    setCurrentRoom,
    clearRequests,
    navigate,
    updateGameState,
    setPlayerColor,
    addChatMessage,
    setChatMessages,
  ]);

  return socket;
};
