import { useQuery } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getNews, getPromotion } from "../services/post-api";
import { PostResInterface } from "../interfaces/post-interface";
export function useContentPosts(
  per_page?: number,
  page?: number,
  search?: string
) {
  const newsQuery = useQuery<PostResInterface>({
    queryKey: ["newsPosts", per_page, page, search],
    queryFn: () => getNews(per_page, page, search),
    enabled: hasToken(),
  });

  const promoQuery = useQuery<PostResInterface>({
    queryKey: ["promoPosts", per_page, page, search],
    queryFn: () => getPromotion(per_page, page, search),
    enabled: hasToken(),
  });

  return {
    news: newsQuery.data,
    promotions: promoQuery.data,
    isLoading: newsQuery.isLoading || promoQuery.isLoading,
    isError: newsQuery.isError || promoQuery.isError,
  };
}

