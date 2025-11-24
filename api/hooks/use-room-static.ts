import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getRoomStatic } from "../services/room-api";

export const useRoomStatic = () => {
  return useQuery({
    queryKey: ["getRoomStatic"],
    queryFn: () => getRoomStatic(),
    enabled: hasToken(),
    ...queryOptions,
  });
};
