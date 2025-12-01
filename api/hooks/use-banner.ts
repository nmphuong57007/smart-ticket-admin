import { useQuery, queryOptions } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getBanner } from "../services/banner-api";

export const useBanners = (
  per_page?: number,
  page?: number,
  search?:string
) => {
  return useQuery({
    queryKey: ["getBanner", per_page, page, search],
    queryFn: () => getBanner(per_page, page, search),
    enabled: hasToken(),
    ...queryOptions,
  });
};