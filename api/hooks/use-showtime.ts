import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getShowtimes } from "../services/showtime-api";

export const useShowTimes = (
  per_page?: number,
  page?: number,
  sort_by?:string,
  sort_order?: string,
) => {
  return useQuery({
    queryKey: ["getShowtimes", per_page, page,sort_by, sort_order],
    queryFn: () => getShowtimes(per_page, page,sort_by, sort_order),
    enabled: hasToken(),
    ...queryOptions,
  });
};