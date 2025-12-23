export type UserStatus = "active" | "blocked";


export interface User {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  address: string | null;
  gender: string | null;
  avatar: string;
  role: "customer" | "staff" | "admin";
  points: number;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface ToggleUserStatusResInterface {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
