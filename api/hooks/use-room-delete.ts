import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { MovieDeleteResInterface } from "../interfaces/movie-interface";
import { toast } from "sonner";
import { deleteRoom } from "../services/room-api";

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation<MovieDeleteResInterface, AxiosError, number>({
    mutationFn: (roomId) => deleteRoom(roomId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getRooms"] });
    },

    onError: () => {
      toast.error("Xóa phòng chiếu thất bại");
    },
  });
};