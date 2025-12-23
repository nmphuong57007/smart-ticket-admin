import { useMutation } from "@tanstack/react-query";
import { toggleUserStatus } from "@/api/services/user-api";
import {
  ToggleUserStatusResInterface,
  UserStatus,
} from "@/api/interfaces/user-toggle-status.interface";

interface ToggleUserStatusVariables {
  userId: number;
  status: UserStatus;
}

export const useUserToggleStatus = () => {
  return useMutation<
    ToggleUserStatusResInterface,
    Error,
    ToggleUserStatusVariables
  >({
    mutationFn: ({ userId, status }) =>
      toggleUserStatus(userId, status),
  });
};

