import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getBookings } from "../services/booking-api";

export const useBookings = (
  per_page?: number,
  page?: number,
  sort_by?:string,
  sort_order?: string,
  booking_id?: number,
  booking_code?: string,
  qr_code?: string,
  user_name?: string,
  status?: string,
) => {
  return useQuery({
    queryKey: ["getBookings", per_page, page,sort_by, sort_order, booking_id, booking_code, qr_code,user_name,status ],
    queryFn: () => getBookings(per_page, page,sort_by, sort_order, booking_id, booking_code, qr_code,user_name, status ),
    enabled: hasToken(),
    ...queryOptions,
  });
};