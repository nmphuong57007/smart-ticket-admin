import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getProducts } from "../services/product-api";

export const useProducts = (
  per_page?: number,
  page?: number,
  sort_by?:string,
  sort_order?: string,
  search?:string
) => {
  return useQuery({
    queryKey: ["getProducts", per_page, page,sort_by, sort_order,search],
    queryFn: () => getProducts(per_page, page,sort_by, sort_order,search),
    enabled: hasToken(),
    ...queryOptions,
  });
};