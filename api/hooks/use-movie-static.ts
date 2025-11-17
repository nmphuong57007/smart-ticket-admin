import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getMovieStatic } from "@/api/services/movie-api";

export const useMovieStatic = () => {
  return useQuery({
    queryKey: ["getMovieStatic"],
    queryFn: () => getMovieStatic(),
    enabled: hasToken(),
    ...queryOptions,
  });
};
