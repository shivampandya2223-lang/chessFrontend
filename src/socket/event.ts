export const SOCKET_EVENT = {
    // Connection
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    ERROR: "error",

    // User presence
    ONLINE_USERS: "online:users",

    // Game requests
    SEND_GAME_REQUEST: "game:request:send",
    GAME_REQUEST_RECEIVED: "game:request:received",
    ACCEPT_GAME_REQUEST: "game:request:accept",
    DECLINE_GAME_REQUEST: "game:request:decline",
    GAME_REQUEST_DECLINED: "game:request:declined",

    // Game room / play
    GAME_START: "game:start",
    MOVE: "game:move",
    MOVE_MADE: "game:move:made",
    GAME_OVER: "game:over",
};