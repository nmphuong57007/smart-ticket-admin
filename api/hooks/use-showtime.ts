import { useQuery } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getShowtimes } from "../services/showtime-api";

export const useShowTimes = (
  per_page?: number,
  page?: number,
  sort_by?: string,
  sort_order?: string,
  room_id?: number
) => {
  return useQuery({
    queryKey: ["getShowtimes", per_page, page, sort_by, sort_order, room_id],
    queryFn: () =>
      getShowtimes(
        per_page,
        page,
        sort_by,
        sort_order,
        room_id
      ),
    enabled: hasToken(),
  });
};


