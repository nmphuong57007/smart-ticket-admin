import { useMutation, mutationOptions } from "@tanstack/react-query";

import { deleteUser } from "../services/user-api";

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (userID: number) => {
      return deleteUser(userID);
    },
    ...mutationOptions,
  });
};
