import { useMutation, } from "@tanstack/react-query";

import { updateMovie } from "../services/movie-api";


export const useUpdateMovie = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      return updateMovie(id, data);
    },
  });
};
