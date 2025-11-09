import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getMovies } from "../services/movie-api";

export const useMovies = (
  per_page?: number,
  page?: number,
  sort_order?: string
) => {
  return useQuery({
    queryKey: ["getMovies", per_page, page, sort_order],
    queryFn: () => getMovies(per_page, page, sort_order),
    enabled: hasToken(),
    ...queryOptions,
  });
};