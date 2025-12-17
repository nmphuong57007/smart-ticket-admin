import { useMutation, mutationOptions } from "@tanstack/react-query";

import { GenreCreateReqInterface } from "../interfaces/genre-interface.";
import { createGenre } from "../services/genre-api";

export const useCreateGenre = () => {
  return useMutation({
    mutationFn: (data: GenreCreateReqInterface) => {
      return createGenre(data);
    },
    ...mutationOptions,
  });
};