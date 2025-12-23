import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getUsers } from "../services/user-api";

export const useUser = (
  per_page: number, 
  page: number,
  search?:string
) => {
  return useQuery({
    queryKey: ["getUser", per_page, page, search],
    queryFn: () => getUsers(per_page, page, search),
    enabled: hasToken(),
    ...queryOptions,
  });
};