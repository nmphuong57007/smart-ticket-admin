import instance from "@/lib/instance";

import {
  UsersResInterface,
} from "../interfaces/user-interface";
import { ToggleUserStatusResInterface, UserStatus } from "../interfaces/user-toggle-status.interface";

export async function getUsers(per_page: number, page: number, search?: string) {
  try {
    const response = await instance.get<UsersResInterface>("/api/users", {
      params: {
        per_page,
        page,
        search
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(userID: number) {
  try {
    const response = await instance.delete(`/api/users/${userID}`);

    return response.data;
  } catch (error) {
    throw error;
  }
}

export const toggleUserStatus = async (
  userId: number,
  status: UserStatus
): Promise<ToggleUserStatusResInterface> => {
  try {
    const res = await instance.patch<ToggleUserStatusResInterface>(
      `/api/users/${userId}/toggle-status`,
      { status }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

