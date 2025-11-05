export interface ProfileResInterface {
  message: string;
  data: {
    user: {
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
    };
  };
}
