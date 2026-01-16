export interface User {
  id: string;
  username: string;
  goalWeight: number | null;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
