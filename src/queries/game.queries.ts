import { useMutation } from "@tanstack/react-query";
import { createRoom } from "../api/game.api";

export const useCreateRoomMutation = () => {
    return useMutation({
        mutationFn: createRoom,
    });
};
