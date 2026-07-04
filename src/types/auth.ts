export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  refresh: string;
  access: string;
}
