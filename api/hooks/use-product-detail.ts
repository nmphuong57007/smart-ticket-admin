import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getProductDetail } from "../services/product-api";

export const useProductDetail = (product_id: number) => {
  return useQuery({
    queryKey: ["getProductDetail", product_id],
    queryFn: () => getProductDetail(product_id),
    enabled: hasToken(),
    ...queryOptions,
  });
};