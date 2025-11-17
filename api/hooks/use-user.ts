import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getUsers } from "../services/user-api";

export const useUser = (per_page: number, page: number) => {
  return useQuery({
    queryKey: ["getUser", per_page, page],
    queryFn: () => getUsers(per_page, page),
    enabled: hasToken(),
    ...queryOptions,
  });
};