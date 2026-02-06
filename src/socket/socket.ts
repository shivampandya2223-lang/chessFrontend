import {Socket , io} from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

export const socket:Socket = io(SOCKET_URL,{
    autoConnect:false,
    transports:["websocket"],
    auth:{
        token : localStorage.getItem("token"),
    },
});