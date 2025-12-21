import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { ReviewDeleteResInterface } from "../interfaces/review-interface";
import { deleteReview } from "../services/review-api";


export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<ReviewDeleteResInterface, AxiosError, number>({
    mutationFn: (reviewId) => deleteReview(reviewId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getReviews"] });
    },

    onError: () => {
      toast.error("Xóa đánh giá thất bại");
    },
  });
};