import { useQuery, queryOptions } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getRenge } from "../services/genre-api";

export const useRenge = () => {
  return useQuery({
    queryKey: ["getRenge"],
    queryFn: () => getRenge(),
    enabled: hasToken(),
    ...queryOptions,
  });
};