import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createShowTime } from "../services/showtime-api";
import { ConflictResponse, ShowTimeCreatePayload } from "../interfaces/showtimes-interface";

export const useCreateShowTime = () => {
  return useMutation<
    unknown,                       // response type nếu bạn không cần
    AxiosError<ConflictResponse>,  // ❗ lỗi là AxiosError<ConflictResponse>
    ShowTimeCreatePayload          // payload FE gửi lên
  >({
    mutationFn: (payload) => createShowTime(payload),
  });
};

