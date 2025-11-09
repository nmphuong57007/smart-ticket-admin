import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getMovieDetail } from "../services/movie-api";

export const useMovieDetail = (movie_id: number) => {
  return useQuery({
    queryKey: ["getMovieDetail", movie_id],
    queryFn: () => getMovieDetail(movie_id),
    enabled: hasToken(),
    ...queryOptions,
  });
};