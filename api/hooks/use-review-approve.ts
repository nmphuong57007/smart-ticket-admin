import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveReview } from "../services/review-api";
import { toast } from "sonner";


export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => approveReview(id),
    onSuccess: () => {
      toast.success("Đã duyệt đánh giá");
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
    },
    onError: () => {
      toast.error("Duyệt đánh giá thất bại");
    },
  });
};