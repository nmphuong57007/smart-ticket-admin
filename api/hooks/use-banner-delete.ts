import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { MovieDeleteResInterface } from "../interfaces/movie-interface";
import { toast } from "sonner";
import { deleteBanner } from "../services/banner-api";

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<MovieDeleteResInterface, AxiosError, number>({
    mutationFn: (bannerId) => deleteBanner(bannerId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getBanner"] });
    },

    onError: () => {
      toast.error("Xóa banner thất bại");
    },
  });
};