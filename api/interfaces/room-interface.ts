export interface RoomResInterface {
 success: boolean;
data: {
    items: {
        id: number;
        name: string;
        seat_map: string[][];
        total_seats: number;
        status: {
            code: string;
            label: string;
        };
        created_at: string;
        updated_at: string;
    }[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
};
}

export interface RoomDetailResInterface {
    success: boolean;
    data: {
        id: number;
        name: string;
        seat_map: {
            code: string;
            type: string;
            status: string;
        }[][];
        total_seats: number;
        seat_types: {
            vip: number;
            normal: number;
        };
        status: {
            code: string;
            label: string;
        };
        created_at: string;
        updated_at: string;
    };
}


export interface RoomCreateReqInterface {
  name: string;
  status: string;
}

export interface RoomUpdateResInterface {
     success: boolean;
    message: string;
    data: {
        id: number;
        name: string;
        seat_map: {
            code: string;
            type: string;
            status: string;
        }[][];
        total_seats: number;
        seat_types: {
            vip: number;
            normal: number;
        };
        status: {
            code: string;
            label: string;
        };
        created_at: string;
        updated_at: string;
    };
}

export interface SeatItem {
  code: string;
  type: "normal" | "vip";
  status: "active" | "broken";
}

export interface RoomUpdatePayload {
  name: string;
  status: string;
  total_seats: number;
  seat_map: SeatItem[][];
}


export interface RoomStaticReqInterface {
    success: boolean;
    data: {
        total_rooms: number;
        active_rooms: number;
        maintenance_rooms: number;
        closed_rooms: number;
        total_seats: number;
    };
}

export interface RoomDeleteResInterface{
   success: boolean;
    message: string;
}

