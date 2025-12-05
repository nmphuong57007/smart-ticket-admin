import instance from "@/lib/instance";

import {
  BookingResInterface,
  BookingDetailResInterface,
  BookingDeleteResInterface
} from "../interfaces/booking-interface";
export const getBookings = async (
  per_page?: number,
  page?: number,
  sort_by?: string,
  sort_order?: string,
  search?: string
): Promise<BookingResInterface> => {
  try {
    const res = await instance.get<BookingResInterface>(
      "/api/bookings/admin/list",
      {
        params: { per_page, page, sort_by, sort_order, search },
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

// export const createMovie = async (data: MovieCreateReqInterface) => {
//   try {
//     const res = await instance.post<MovieDetailResInterface>(
//       `/api/movies`,
//       data,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return res.data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const updateMovie = async (
//   movie_id: number,
//   data: FormData
// ): Promise<MovieUpdateResInterface> => {
//   try{
//     const res = await instance.post<MovieUpdateResInterface>(
//       `/api/movies/${movie_id}?_method=PUT`,
//       data,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     return res.data;
//   } catch (err){
//     throw err;
//   }
// }


export const deleteBooking = async (bookingId: number): Promise<BookingDeleteResInterface> => {
  const res = await instance.delete<BookingDeleteResInterface>(`/api/bookings/${bookingId}`);
  return res.data;
};


// export const getMovieStatic  = async (): Promise<MovieStaticReqInterface> => {
//   try {
//     const res = await instance.get<MovieStaticReqInterface>(
//       `/api/movies/statistics`
//     );
//     return res.data;
//   }catch (err) {
//     throw err;
//   }
//   };