
export interface UserCreate {
  name: string;
  email: string;
  phone: string;
  password: string;
  accepted_privacy_policy: boolean;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_verified: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
}
