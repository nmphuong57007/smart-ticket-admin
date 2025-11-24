import { useQuery, queryOptions } from "@tanstack/react-query";
import { getRoom } from "../services/room-api";
import { hasToken } from "@/helpers/has-token";

export const useRooms = (
  per_page?: number,
  page?: number,
  sort_order?: string,
  sort_by?:string,
  search?:string
) => {
  return useQuery({
    queryKey: ["getRooms", per_page, page, sort_order, sort_by, search],
    queryFn: () => getRoom(per_page, page, sort_order,sort_by, search),
    enabled: hasToken(),
    ...queryOptions,
  });
};