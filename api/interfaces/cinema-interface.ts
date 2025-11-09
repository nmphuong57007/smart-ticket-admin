export interface CinemaResInterface {
  success: boolean;
  message: string;
  data: {
    cinemas: {
      id: number;
      name: string;
      address: string;
      phone: string;
      created_at: string;
      rooms_count: number;
    }[];
    pagination: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
}

export interface CinemaDetailResInterface {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    address: string;
    phone: string;
    created_at: string;
    updated_at: null;
    rooms: {
      id: number;
      cinema_id: number;
      name: string;
    }[];
  };
}

export interface CinemaStaticReqInterface {
  success: boolean;
  message: string;
  data: {
    total_cinemas: number;
    total_rooms: number;
  };
}

export interface CinemaRoomReqInterface {
  success: boolean;
  message: string;
  data: {
    id: number;
    cinema_id: number;
    name: string;
  }[];
}
