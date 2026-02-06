import { useEffect } from "react";
import { socket } from "../socket/socket";

export const useSocket = () => {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, []);
  return socket;
};
