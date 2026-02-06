import { socket } from "./socket";
import { SOCKET_EVENT } from "./event";

export const socketActions = {
    // Send game request to another user
    sendGameRequest: (toUserId: string, toUsername: string) => {
        const fromUserId = localStorage.getItem("userId");
        const fromUsername = localStorage.getItem("username");

        if (!fromUserId || !fromUsername) {
            console.error("User not logged in");
            return;
        }

        socket.emit(SOCKET_EVENT.SEND_GAME_REQUEST, {
            toUserId,
            toUsername,
            fromUserId,
            fromUsername,
        });
    },

    // Accept a game request
    acceptGameRequest: (requestId: string) => {
        socket.emit(SOCKET_EVENT.ACCEPT_GAME_REQUEST, requestId);
    },

    // Reject a game request
    rejectGameRequest: (requestId: string) => {
        socket.emit(SOCKET_EVENT.REJECT_GAME_REQUEST, requestId);
    },

    // Cancel a sent game request
    cancelGameRequest: (requestId: string) => {
        socket.emit(SOCKET_EVENT.CANCEL_GAME_REQUEST, requestId);
    },

    // Send a move in the game
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMove: (roomId: string, move: any) => {
        socket.emit(SOCKET_EVENT.MOVE, { roomId, move });
    },

    // Leave current room
    leaveRoom: (roomId: string) => {
        socket.emit(SOCKET_EVENT.ROOM_LEFT, roomId);
    },
};
