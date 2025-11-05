import { useQuery, queryOptions } from "@tanstack/react-query";

import { getProfile } from "../services/profile-api";
import { hasToken } from "@/helpers/has-token";

export const useProfile = () => {
  return useQuery({
    queryKey: ["getProfile"],
    queryFn: () => getProfile(),
    enabled: hasToken(),
    ...queryOptions,
  });
};
