import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { updateShowTime } from "../services/showtime-api";
import type {
  ConflictResponse,
  ShowTimeUpdateResInterface,
} from "@/api/interfaces/showtimes-interface";

export const useUpdateShowTime = () => {
  return useMutation<
    ShowTimeUpdateResInterface,          // TData (response success)
    AxiosError<ConflictResponse>,        // TError (error backend)
    { id: number; data: FormData }       // TVariables
  >({
    mutationFn: ({ id, data }) => {
      return updateShowTime(id, data);
    },
  });
};
