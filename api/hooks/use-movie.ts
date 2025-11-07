import { useQuery, queryOptions } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getMovies } from "../services/movie-api";
export const useMovie = (per_page?: number, page?: number) => {
    return useQuery({
        queryKey: ["getMovies", per_page, page],
        queryFn: () => getMovies(per_page, page),
        enabled: hasToken(),
        ...queryOptions,
    });
};