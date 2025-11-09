import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getCinemaRooms } from "../services/cinema-api";

export const useCinemaRooms = (cinema_id: number) => {
  return useQuery({
    queryKey: ["getCinemaRooms", cinema_id],
    queryFn: () => getCinemaRooms(cinema_id),
    enabled: hasToken(),
    ...queryOptions,
  });
};
