import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { BookingDeleteResInterface } from "../interfaces/booking-interface";
import { deleteBooking } from "../services/booking-api";
import { toast } from "sonner";

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation<BookingDeleteResInterface, AxiosError, number>({
    mutationFn: (bookingId) => deleteBooking(bookingId),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["getBookings"] });
    },

    onError: () => {
      toast.error("Xóa đơn thất bại");
    },
  });
};
