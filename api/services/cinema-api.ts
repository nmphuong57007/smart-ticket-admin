import instance from "@/lib/instance";
import { CinemaResInterface } from "../interfaces/cinema-interface";

export const getCinemas = async (
  per_page?: number,
  page?: number
): Promise<CinemaResInterface> => {
  try {
    const res = await instance.get<CinemaResInterface>(`/api/cinemas`, {
      params: {
        per_page,
        page,
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
