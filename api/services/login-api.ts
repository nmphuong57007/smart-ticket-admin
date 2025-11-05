import instance from "@/lib/instance";
import { LoginReqInterface, LoginResInterface } from "../interfaces/login-interface";

export async function postLogin(data: LoginReqInterface) {
  try {
    const response = await instance.post<LoginResInterface>("/api/auth/login", data);

    return response.data;
  } catch (error) {
    throw error;
  }
}
