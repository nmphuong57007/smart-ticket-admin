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
