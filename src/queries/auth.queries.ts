import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, register, getProfile } from "../api/auth.api";

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
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: register,
  });
