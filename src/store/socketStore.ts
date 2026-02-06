import { create } from "zustand";

export interface GameRequest {
    requestId: string;
    fromUserId: string;
    fromUsername: string;
    toUserId: string;
    toUsername: string;
    createdAt: string;
}

export interface GameRoom {
    roomId: string;
    creatorId: string;
    creatorUsername: string;
    opponentId: string;
    apponentUsername: string; // Changed to match user's backend naming
    status: "waiting" | "active" | "finished";
}

export interface OnlineUser {
    userId: string;
    username: string;
    isOnline: boolean;
}

interface SocketState {
    isConnected: boolean;
    onlineUsers: OnlineUser[];
    gameRequests: GameRequest[]; // Incoming requests
    sentRequests: GameRequest[]; // Outgoing requests
    currentRoom: GameRoom | null;

    // Actions
    setConnected: (connected: boolean) => void;
    setOnlineUsers: (users: OnlineUser[]) => void;
    addGameRequest: (request: GameRequest) => void;
    removeGameRequest: (requestId: string) => void;
    addSentRequest: (request: GameRequest) => void;
    removeSentRequest: (requestId: string) => void;
    setCurrentRoom: (room: GameRoom | null) => void;
    clearRequests: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
    isConnected: false,
    onlineUsers: [],
    gameRequests: [],
    sentRequests: [],
    currentRoom: null,

    setConnected: (connected) => set({ isConnected: connected }),

    setOnlineUsers: (users) => set({ onlineUsers: users }),

    addGameRequest: (request) =>
        set((state) => ({
            gameRequests: [...state.gameRequests, request],
        })),

    removeGameRequest: (requestId) =>
        set((state) => ({
            gameRequests: state.gameRequests.filter((r) => r.requestId !== requestId),
        })),

    addSentRequest: (request) =>
        set((state) => ({
            sentRequests: [...state.sentRequests, request],
        })),

    removeSentRequest: (requestId) =>
        set((state) => ({
            sentRequests: state.sentRequests.filter((r) => r.requestId !== requestId),
        })),

    setCurrentRoom: (room) => set({ currentRoom: room }),

    clearRequests: () => set({ gameRequests: [], sentRequests: [] }),
}));
