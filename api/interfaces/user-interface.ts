export interface UsersResInterface {
  success: boolean;
  message: string;
  data: {
    users: {
      id: number;
      fullname: string;
      email: string;
      phone: string;
      address: null;
      gender: null;
      avatar: string;
      role: string;
      points: number;
      status: string;
      created_at: string;
      updated_at: string;
    }[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
}
