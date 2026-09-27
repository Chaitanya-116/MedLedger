export * from './inventory';

export type UserRole = 'ADMIN' | 'USER';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface HealthCheckStatus {
  status: string;
  app_name: string;
  environment: string;
  version: string;
}
