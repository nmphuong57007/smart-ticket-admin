import { useMutation, mutationOptions } from "@tanstack/react-query";

import { postLogin } from "../services/login-api";
import { LoginReqInterface } from "../interfaces/login-interface";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginReqInterface) => {
      return postLogin(data);
    },
    ...mutationOptions,
  });
};
