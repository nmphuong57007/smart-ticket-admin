import { useMutation } from "@tanstack/react-query";
import { updateRoom } from "../services/room-api";
import {
  RoomUpdatePayload,
  RoomUpdateResInterface,
} from "../interfaces/room-interface";

export const useUpdateRoom = () => {
  return useMutation<
    RoomUpdateResInterface,
    Error,
    { id: number; data: RoomUpdatePayload }
  >({
    mutationFn: ({ id, data }) => updateRoom(id, data),
  });
};
