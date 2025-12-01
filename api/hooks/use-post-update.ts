import { useMutation, } from "@tanstack/react-query";
import { updatePost } from "../services/post-api";

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      return updatePost(id, data);
    },
  });
};