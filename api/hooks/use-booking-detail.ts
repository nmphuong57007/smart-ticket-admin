import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getBookingDetail } from "../services/booking-api";

export const useBookingDetail = (booking_id: number) => {
  return useQuery({
    queryKey: ["getBookingDetail", booking_id],
    queryFn: () => getBookingDetail(booking_id),
    enabled: hasToken(),
    ...queryOptions,
  });
};