import { useQuery, queryOptions } from "@tanstack/react-query";

import { hasToken } from "@/helpers/has-token";
import { getRoomDetail } from "../services/room-api";

export const useRoomDetail = (room_id: number) => {
  return useQuery({
    queryKey: ["getRoomDetail", room_id],
    queryFn: () => getRoomDetail(room_id),
    enabled: hasToken(),
    ...queryOptions,
  });
};