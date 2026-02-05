import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, getProfile } from "../api/auth.api";
import type { AxiosResponse } from "axios";

export const useProfileQuery = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await getProfile();
      return res.data.user;
    },
  });

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username",res.data.username);
      localStorage.setItem("userId",res.data.userId);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: register,
    onSuccess: (res:AxiosResponse) => {
       if (res.data?.user) {
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("username", res.data.user.username);
      }
    },
  });