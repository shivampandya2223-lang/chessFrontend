import { socket } from "./socket";
import { SOCKET_EVENT } from "./event";

export const socketActions = {
    // Send game request to another user
    sendGameRequest: (toUserId: string) => {
        socket.emit(SOCKET_EVENT.SEND_GAME_REQUEST, {
            toUserId,
        });
    },

    // Accept a game request
    acceptGameRequest: (fromUserId: string) => {
        socket.emit(SOCKET_EVENT.ACCEPT_GAME_REQUEST, { fromUserId });
    },

    // Decline a game request
    declineGameRequest: (fromUserId: string) => {
        socket.emit(SOCKET_EVENT.DECLINE_GAME_REQUEST, { fromUserId });
    },

    // Send a move in the game
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendMove: (roomId: string, move: any) => {
        socket.emit(SOCKET_EVENT.MOVE, { roomId, move });
    },
};
