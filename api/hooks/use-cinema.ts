import { useQuery, queryOptions } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getCinemas } from "../services/cinema-api";

export const useCinema = (per_page?: number, page?: number) => {
  return useQuery({
    queryKey: ["getCinemas", per_page, page],
    queryFn: () => getCinemas(per_page, page),
    enabled: hasToken(),
    ...queryOptions,
  });
};
