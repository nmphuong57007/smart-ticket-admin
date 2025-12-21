import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { MovieDeleteResInterface } from "../interfaces/movie-interface";
import { toast } from "sonner";
import { deleteGenre } from "../services/genre-api";

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();

  return useMutation<MovieDeleteResInterface, AxiosError, number>({
    mutationFn: (genreId) => deleteGenre(genreId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getRenge"] });
    },

    onError: () => {
      toast.error("Xóa thể loại thất bại");
    },
  });
};