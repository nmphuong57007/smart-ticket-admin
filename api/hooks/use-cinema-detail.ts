import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getCinemaDetail } from "../services/cinema-api";

export const useCinemaDetail = (cinema_id: number) => {
  return useQuery({
    queryKey: ["getCinemaDetail", cinema_id],
    queryFn: () => getCinemaDetail(cinema_id),
    enabled: hasToken(),
    ...queryOptions,
  });
};
