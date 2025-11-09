import instance from "@/lib/instance";

import {
  MovieResInterface,
  MovieDetailResInterface,
  MovieCreateReqInterface,
} from "../interfaces/movie-interface";

export const getMovies = async (
  per_page?: number,
  page?: number,
  sort_order?: string
): Promise<MovieResInterface> => {
  try {
    const res = await instance.get<MovieResInterface>(`/api/movies/list`, {
      params: {
        per_page,
        page,
        sort_order: sort_order ?? "asc",
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getMovieDetail = async (
  movie_id: number
): Promise<MovieDetailResInterface> => {
  try {
    const res = await instance.get<MovieDetailResInterface>(
      `/api/movies/${movie_id}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const createMovie = async (data: MovieCreateReqInterface) => {
  try {
    const res = await instance.post<MovieDetailResInterface>(
      `/api/movies`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};
