import instance from "@/lib/instance";

import {
  BookingDetailResInterface,
  BookingDeleteResInterface,
  BookingListResponse
} from "../interfaces/booking-interface";
export const getBookings = async (
  per_page?: number,
  page?: number,
  sort_by?: string,
  sort_order?: string,
  booking_id?: number,
  booking_code?: string,
  qr_code?: string,
  user_name?: string,
  status?: string,
): Promise<BookingListResponse> => {
  try {
    const res = await instance.get<BookingListResponse>(
      "/api/bookings/admin/list",
      {
        params: { per_page, page, sort_by, sort_order, booking_id, booking_code, qr_code, user_name, status  },
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};



export const getBookingDetail = async (
  booking_id: number
): Promise<BookingDetailResInterface> => {
  try {
    const res = await instance.get<BookingDetailResInterface>(
      `/api/bookings/${booking_id}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};



export const deleteBooking = async (bookingId: number): Promise<BookingDeleteResInterface> => {
  const res = await instance.delete<BookingDeleteResInterface>(`/api/bookings/${bookingId}`);
  return res.data;
};


