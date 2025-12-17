// types/checkin-response.ts

export interface CheckinTicket {
  ticket_id?: number;
  qr_code: string;
  is_checked_in?: boolean;
  checked_in_at?: string;
  checked_in_by?: string | null;
}

export interface CheckinBooking {
  booking_id: number;
  booking_code: string;
  payment_status?: string;
  booking_status?: string;
  final_amount?: number;
  created_at?: string;
}


export interface CheckinMovie {
  id?: number;
  title: string;
}

export interface CheckinCinema {
  id?: number;
  name: string;
}

export interface CheckinRoom {
  id?: number;
  name: string;
}

export interface CheckinShowtime {
  showtime_id?: number;
  date: string;
  time: string;
  movie: CheckinMovie;
  cinema: CheckinCinema;
  room: CheckinRoom;
}

export interface CheckinSeat {
  seat_id?: number | string;
  seat_code: string;
  type?: string;
}

export interface CheckinProduct {
  product_id?: number | string;
  name: string;
  quantity: number;
  price?: string;
}

export interface CheckinResponseData {
  ticket: CheckinTicket;
  booking: CheckinBooking;
  showtime: CheckinShowtime;
  seats: CheckinSeat[];
  products: CheckinProduct[];
}
