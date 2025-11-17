export interface RoomResInterface {
 success: boolean;
data: {
    items: {
        id: number;
        cinema_id: number;
        cinema: {
            id: number;
            name: string;
            address: string;
        };
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
 
