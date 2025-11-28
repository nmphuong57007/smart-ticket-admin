import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { MovieDeleteResInterface } from "../interfaces/movie-interface";
import { deleteMovie } from "../services/movie-api";
import { toast } from "sonner";

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation<MovieDeleteResInterface, AxiosError, number>({
    mutationFn: (discountId) => deleteMovie(discountId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getDiscount"] });
    },

    onError: () => {
      toast.error("Xóa mã giảm giá thất bại");
    },
  });
};
