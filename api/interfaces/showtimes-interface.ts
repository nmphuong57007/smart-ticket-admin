export interface ShowTimeResInterface {
     success: boolean;
    message: string;
    data: {
        items: {
            id: number;
            movie_id: number;
            room_id: number;
            movie: {
                id: number;
                title: string;
                poster: string;
                duration: number;
                release_date: string;
            };
            room: {
                id: number;
                name: string;
            };
            show_date: string;
            show_time: string;
            end_time: string;
            format: string;
            language_type: string;
            price: number;
            created_at: string;
            updated_at: string;
        }[];
        pagination: {
            page: number;
            per_page: number;
            total: number;
            last_page: number;
        };
    };
}

export interface ShowTimeDetailResInterface {
     success: boolean;
    message: string;
    data: {
        id: number;
        movie_id: number;
        room_id: number;
        movie: {
            id: number;
            title: string;
            poster: string;
            duration: number;
            release_date: string;
        };
        room: {
            id: number;
            name: string;
        };
        show_date: string;
        show_time: string;
        end_time: string;
        format: string;
        language_type: string;
        price: number;
        created_at: string;
        updated_at: string;
        seats: {
            id: number;
            seat_code: string;
            type: string;
            status: string;
            status_label: string;
            is_available: boolean;
            price: number;
        }[];
    };
}


export interface ShowTimeCreatePayload {
  movie_id: number;
  room_id: number;
  show_date: string;
  show_time: string;
  end_time: string;
  language_type: string;
 
}


export interface ShowTimeCreateReqInterface {
    
        id: number;
        movie_id: number;
        room_id: number;
        movie: {
            id: number;
            title: string;
            poster: string;
            duration: number;
            release_date: string;
        };
        room: {
            id: number;
            name: string;
        };
        show_date: string;
        show_time: string;
        end_time: string;
        format: string;
        language_type: string;
        price: number;
        created_at: string;
        updated_at: string;

}

export interface ShowTimeUpdateResInterface {
    success: boolean;
    message: string;
    data: {
        id: number;
        movie_id: number;
        room_id: number;
        movie: {
            id: number;
            title: string;
            poster: string;
            duration: number;
            release_date: string;
            language: string;
        };
        room: {
            id: number;
            name: string;
        };
        show_date: string;
        show_time: string;
        end_time: string;
        format: string;
        language_type: string;
        price: number;
        created_at: string;
        updated_at: string;
    };
}

export interface MovieItem {
  id: number;
  title: string;
  duration: number;
  release_date: string;
  status: string;
}

export interface RoomItem {
  id: number;
  name: string;
}

export interface ShowTimeDeleteResInterface{
   success: boolean;
    message: string;
}


export interface ConflictResponse {
  success: boolean;
  message: string;
  conflict: {
    existing_showtime_id: number;
    room_id: number;
    existing_movie: string;
    existing_start: string;
    existing_end: string;
    required_next_start: string;
  };
}

// Thống kê tổng
export interface ShowtimeStatisticsAll {
  total_showtimes: number;
  total_movies: number;
  total_rooms: number;
}

// Phim trong suất chiếu
export interface MovieInShowtime {
  id: number;
  title: string;
  poster: string;
  duration: number;
  release_date: string | null;
  language: string | null;
}

// Phòng chiếu trong suất chiếu
export interface RoomInShowtime {
  id: number;
  name: string;
}

// Suất chiếu theo ngày
export interface ShowtimeItem {
  id: number;
  movie_id: number;
  room_id: number;
  movie: MovieInShowtime;
  room: RoomInShowtime;
  show_date: string;
  show_time: string;
  end_time: string;
  format: string;
  language_type: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ShowtimeStatisticsByDate {
  date: string;
  total_showtimes: number;
  total_movies: number;
  total_rooms: number;
  showtimes: ShowtimeItem[];
}


