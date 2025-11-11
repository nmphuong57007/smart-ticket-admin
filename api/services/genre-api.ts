
import instance from "@/lib/instance";
import { GenreResInterface } from "../interfaces/genre-interface";

export const getRenge = async (
): Promise<GenreResInterface> => {
  try {
    const res = await instance.get<GenreResInterface>(`/api/genres`, {
    }); 
    return res.data;
  } catch (err) {
    throw err;
  }
};