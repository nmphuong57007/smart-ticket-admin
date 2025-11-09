import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getCinemaStatic } from "../services/cinema-api";

export const useCinemaStatic = () => {
  return useQuery({
    queryKey: ["getCinemaStatic"],
    queryFn: () => getCinemaStatic(),
    enabled: hasToken(),
    ...queryOptions,
  });
};
