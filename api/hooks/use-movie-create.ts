import { useMutation, mutationOptions } from "@tanstack/react-query";

import { createMovie } from "../services/movie-api";
import { MovieReqInterface } from "../interfaces/movie-interface";

export const useCreateMovie = () => {
  return useMutation({
    mutationFn: (data: MovieReqInterface) => {
      return createMovie(data);
    },
    ...mutationOptions,
  });
};
