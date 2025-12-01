import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { MovieDeleteResInterface } from "../interfaces/movie-interface";
import { toast } from "sonner";
import { deletePost } from "../services/post-api";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<MovieDeleteResInterface, AxiosError, number>({
    mutationFn: (postId) => deletePost(postId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["newsPosts"] });
    },

    onError: () => {
      toast.error("Xóa bài viêt thất bại");
    },
  });
};
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation<MovieDeleteResInterface, AxiosError, number>({
    mutationFn: (postId) => deletePost(postId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["promoPosts"] });
    },

    onError: () => {
      toast.error("Xóa bài viêt thất bại");
    },
  });
};