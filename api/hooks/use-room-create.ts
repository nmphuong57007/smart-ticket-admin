import { useMutation, mutationOptions } from "@tanstack/react-query";

import { RoomCreateReqInterface } from "../interfaces/room-interface";
import { createRoom } from "../services/room-api";

export const useCreateRoom = () => {
  return useMutation({
    mutationFn: (data: RoomCreateReqInterface) => {
      return createRoom(data);
    },
    ...mutationOptions,
  });
};
