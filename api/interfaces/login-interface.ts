export interface LoginReqInterface {
  email: string;
  password: string;
  device_name: string;
}

export interface LoginResInterface {
  data: {
    user: {
      id: number;
      fullname: string;
      avatar: string;
      email: string;
      phone: string;
      address: null;
      gender: null;
      role: string;
      points: number;
      status: string;
      created_at: string;
      updated_at: string;
    };
    token: string;
  };
}
