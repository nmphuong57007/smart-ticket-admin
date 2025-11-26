import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { deleteShowTime } from "../services/showtime-api";
import { MovieDeleteResInterface } from "../interfaces/movie-interface";

export const useDeleteShowTime = () => {
  const queryClient = useQueryClient();

  return useMutation<MovieDeleteResInterface, AxiosError, number>({
    mutationFn: (showtimeId) => deleteShowTime(showtimeId),

    onSuccess: (res, showtimeId) => {
      toast.success(res.message);

      // ❌ Ngăn refetch cũ chồng vào refetch mới
      queryClient.cancelQueries({ queryKey: ["getShowtimes"] });

      // 🧹 Xoá cache của chi tiết suất chiếu đã xóa
      queryClient.removeQueries({ queryKey: ["showtimeDetail", showtimeId] });

      // 🔄 Load lại bảng danh sách
      queryClient.invalidateQueries({ queryKey: ["getShowtimes"] });
    },

    onError: () => {
      toast.error("Xóa suất chiếu thất bại");
    },
  });
};
