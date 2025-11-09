import { useMutation, mutationOptions } from "@tanstack/react-query";

import { createMovie } from "../services/movie-api";
import { MovieCreateReqInterface } from "../interfaces/movie-interface";

export const useCreateMovie = () => {
  return useMutation({
    mutationFn: (data: MovieCreateReqInterface) => {
      return createMovie(data);
    },
    ...mutationOptions,
  });
};
