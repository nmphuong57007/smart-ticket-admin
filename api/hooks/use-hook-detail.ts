import { useQuery } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getPostDetail } from "../services/post-api";
import { PostDetailResInterface } from "../interfaces/post-interface";

export function usePostDetail(id: number) {
  return useQuery<PostDetailResInterface>({
    queryKey: ["postDetail", id],
    queryFn: () => getPostDetail(id),
    enabled: hasToken() && !!id,
  });
}
