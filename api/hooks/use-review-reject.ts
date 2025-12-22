import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectReview } from "../services/review-api";
import { toast } from "sonner";


export const useRejectReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rejectReview(id),
    onSuccess: () => {
      toast.success("Đã từ chối đánh giá");
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
    onError: () => {
      toast.error("Từ chối đánh giá thất bại");
    },
  });
};