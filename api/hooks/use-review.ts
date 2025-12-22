import { useQuery } from "@tanstack/react-query";
import { hasToken } from "@/helpers/has-token";
import { getReviews } from "../services/review-api";

export const useReviews = () => {
  return useQuery({
    queryKey: ["adminReviews"],
    queryFn: getReviews,
    enabled: hasToken(),
  });
};
