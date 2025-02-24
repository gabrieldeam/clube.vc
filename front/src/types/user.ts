import { CompanySize, WorkArea, Department } from "./enums";

export interface UserCreate {
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  company_size?: CompanySize;
  work_area: WorkArea;
  department: Department;
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
