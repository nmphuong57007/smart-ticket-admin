import { useMutation, mutationOptions } from "@tanstack/react-query";

import { PostCreateReqInterface } from "../interfaces/post-interface";
import { createPost } from "../services/post-api";
export const useCreatePost = () => {
  return useMutation({
    mutationFn: (data: PostCreateReqInterface) => {
      return createPost(data);
    },
    ...mutationOptions,
  });
};
