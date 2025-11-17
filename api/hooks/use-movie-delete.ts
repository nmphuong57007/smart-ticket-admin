import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { MovieDeleteResInterface } from "../interfaces/movie-interface";
import { deleteMovie } from "../services/movie-api";
import { toast } from "sonner";

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();

  return useMutation<MovieDeleteResInterface, AxiosError, number>({
    mutationFn: (movieId) => deleteMovie(movieId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getMovies"] });
    },

    onError: () => {
      toast.error("Xóa phim thất bại");
    },
  });
};
