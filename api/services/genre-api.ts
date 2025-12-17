
import instance from "@/lib/instance";
import { GenreResInterface } from "../interfaces/genre-interface";
import { GenreCreateReqInterface } from "../interfaces/genre-interface.";

export const getRenge = async (): Promise<GenreResInterface> => {
  try {
    const res = await instance.get("/api/genres");
    return res.data;
  } catch (err) {
    throw err;
  }
};



export const createGenre = async (data: GenreCreateReqInterface) => {
  try {
    const res = await instance.post<GenreCreateReqInterface>(
      `/api/genres`,
      data,
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateGenre = async (
  id: number,
  payload: { name?: string; is_active?: boolean }
) => {
  const res = await instance.put(`/api/genres/${id}`, payload);
  return res.data;
};