export const SOCKET_EVENT = {
    // Connection
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    ERROR: "error",

    // User presence
    USER_CONNECTED: "user:connected",
    USER_DISCONNECTED: "user:disconnected",
    ONLINE_USERS: "online:users",

    // Game requests
    SEND_GAME_REQUEST: "game:request:send",
    GAME_REQUEST_RECEIVED: "game:request:received",
    ACCEPT_GAME_REQUEST: "game:request:accept",
    REJECT_GAME_REQUEST: "game:request:reject",
    CANCEL_GAME_REQUEST: "game:request:cancel",

    // Game room
    ROOM_CREATED: "room:created",
    ROOM_JOINED: "room:joined",
    ROOM_LEFT: "room:left",

    // Game play
    GAME_START: "game:start",
    MOVE: "game:move",
    MOVE_MADE: "game:move:made",
    GAME_OVER: "game:over",
};