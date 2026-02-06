import apiClient from "../lib/axios";
import { Api } from "./api";

export const createRoom = (data: { opponentUsername: string }) =>
    apiClient.post(Api.game.create, data);
