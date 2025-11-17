import instance from "@/lib/instance";

import {
  MovieResInterface,
  MovieDetailResInterface,
  MovieCreateReqInterface,
  MovieStaticReqInterface,
  MovieUpdateResInterface,
  MovieDeleteResInterface
} from "../interfaces/movie-interface";

export const getMovies = async (
  per_page?: number,
  page?: number,
  sort_by?: string,
  sort_order?:string,
  search?: string
 
): Promise<MovieResInterface> => {
  try {
    const res = await instance.get<MovieResInterface>(`/api/movies/list`, {
      params: {
        per_page,
        page,
        sort_by,
        sort_order,
        search,
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

export const updateMovie = async (
  movie_id: number,
  data: FormData
): Promise<MovieUpdateResInterface> => {
  try{
    const res = await instance.post<MovieUpdateResInterface>(
      `/api/movies/${movie_id}?_method=PUT`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err){
    throw err;
  }
}


export const deleteMovie = async (movieId: number): Promise<MovieDeleteResInterface> => {
  const res = await instance.delete<MovieDeleteResInterface>(`/api/movies/${movieId}`);
  return res.data;
};


export const getMovieStatic  = async (): Promise<MovieStaticReqInterface> => {
  try {
    const res = await instance.get<MovieStaticReqInterface>(
      `/api/movies/statistics`
    );
    return res.data;
  }catch (err) {
    throw err;
  }
  };