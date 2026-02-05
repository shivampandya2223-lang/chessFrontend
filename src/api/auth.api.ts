import apiClient from "../lib/axios";
import { Api } from "./api";

export const login = (data: { email: string; password: string }) =>
  apiClient.post(Api.auth.login, data);

export const register = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword:string;
}) => apiClient.post(Api.auth.register, data);

export const getProfile = () =>
  apiClient.get(Api.auth.profile);
