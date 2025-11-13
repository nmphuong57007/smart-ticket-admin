import instance from "@/lib/instance";

import {
  UsersResInterface,
} from "../interfaces/user-interface";

export async function getUsers(per_page: number, page: number) {
  try {
    const response = await instance.get<UsersResInterface>("/api/users", {
      params: {
        per_page,
        page,
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
