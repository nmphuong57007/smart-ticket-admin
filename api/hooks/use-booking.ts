import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getBookings } from "../services/booking-api";

export const useBookings = (
  per_page?: number,
  page?: number,
  sort_by?:string,
  sort_order?: string,
  search?:string
) => {
  return useQuery({
    queryKey: ["getBookings", per_page, page,sort_by, sort_order,search],
    queryFn: () => getBookings(per_page, page,sort_by, sort_order,search),
    enabled: hasToken(),
    ...queryOptions,
  });
};