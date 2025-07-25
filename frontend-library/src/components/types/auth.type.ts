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
  accessTokenExpiresAt: string | Date | undefined | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      expiresAt?: string;
      expire?: string;
    };
    accessToken?: string;
    accessTokenExpiresAt?: string | Date;
  };
}

export interface RefreshTokenResponse {
  user: {
    id: string;
    name: string;
    email: string;
    expiresAt?: string;
    expire?: string;
  };
  accessToken: string;
  accessTokenExpiresAt: string | Date;
}
