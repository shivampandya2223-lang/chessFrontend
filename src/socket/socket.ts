import { Socket, io } from "socket.io-client";

// Port 2026 based on user's latest server status
const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER_URL ;

export const socket: Socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"], // Try websocket first, then polling
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
});