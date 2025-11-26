import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getShowTimeDetail } from "../services/showtime-api";

export const useShowTimeDetail = (showtime_id: number) => {
  return useQuery({
    queryKey: ["getRoomDetail", showtime_id],
    queryFn: () => getShowTimeDetail(showtime_id),
    enabled: hasToken(),
    ...queryOptions,
  });
};