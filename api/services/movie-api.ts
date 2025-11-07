import instance from "@/lib/instance";
import { MovieResInterface } from "../interfaces/movie-interface";
export const getMovies = async (
  per_page?: number,
  page?: number
): Promise<MovieResInterface> => {
  try {
    const res = await instance.get<MovieResInterface>(`/api/movies/list`, {  
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