import instance from "@/lib/instance";
import { ProfileResInterface } from "../interfaces/profile-interface";

export const getProfile = async (): Promise<ProfileResInterface> => {
  try {
    const response = await instance.get<ProfileResInterface>("/api/auth/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};
