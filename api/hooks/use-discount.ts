import { useQuery, queryOptions } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getDiscount } from "../services/discount-api";

export const useDiscounts = (
  per_page?: number,
  page?: number,
) => {
  return useQuery({
    queryKey: ["getDiscount", per_page, page],
    queryFn: () => getDiscount(per_page, page),
    enabled: hasToken(),
    ...queryOptions,
  });
};