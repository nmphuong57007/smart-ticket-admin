// types/booking-list.ts

export interface BookingListItem {
   id: number;
    booking_code: string;
    booking_date: string;
    booking_status: string;
    payment_status: string;
    is_checked_in: boolean;
    checked_in_at: string;
    email: string;
    movie_title: string;
    movie_poster: string;
    cinema: string;
    room_name: string;
    seats: string[];
    seat_count: number;
    payment_method: string;
    transaction_code: string;
    final_amount: number;
    qr_code: string;
    
}

export interface BookingListResponse {
  success: boolean;
  data: BookingListItem[];
  meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
}


export interface BookingDetailResInterface {
  success: boolean;
    data: {
        id: number;
        booking_code: string;
        payment_status: string;
        transaction_code: string;
        payment_method: string;
        final_amount: number;
        created_at: string;
        user: {
            fullname: string;
            email: string;
            phone: string;
        };
        movie: {
            id: number;
            title: string;
            duration: number;
            poster: string;
        };
        showtime: {
            id: number;
            time: string;
            type: null;
            date: string;
        };
        cinema: {
            id: number;
            name: string;
        };
        room: {
            id: number;
            name: string;
        };
        seats: {
            seat_code: string;
            qr_code: string;
        }[];
        products: {
            name: string;
            quantity: number;
        }[];
    };
}


export interface BookingDeleteResInterface{
   success: boolean;
    message: string;
}


 

