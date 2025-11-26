import { useMutation} from "@tanstack/react-query";

import { ShowTimeCreateReqInterface } from "../interfaces/showtimes-interface";
import { createShowTime } from "../services/showtime-api";

import { ShowTimeCreatePayload } from "@/api/interfaces/showtimes-interface";

export function useCreateShowTime() {
  return useMutation<ShowTimeCreateReqInterface, Error, ShowTimeCreatePayload>({
    mutationFn: (payload: ShowTimeCreatePayload) => createShowTime(payload),
  });
}
