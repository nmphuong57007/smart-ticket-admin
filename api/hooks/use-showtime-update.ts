import { useMutation, } from "@tanstack/react-query";
import { updateShowTime } from "../services/showtime-api";



export const useUpdateShowTime = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      return updateShowTime(id, data);
    },
  });
};