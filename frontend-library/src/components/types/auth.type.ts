export interface User {
  id: string;
  name: string;
  email: string;
  expiresAt?: string;
  expire?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  accessTokenExpiresAt: string | Date | null;
}