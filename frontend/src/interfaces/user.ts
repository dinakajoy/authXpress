export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  token?: string;
  password?: string;
  twoFAEnabled?: boolean;
}

export interface LoginResponse {
  payload: IUser;
}

export interface ForgotPasswordResponse {
  token: string;
}

export interface ErrorResponse {
  status?: string;
  error: string;
}

export interface SuccessResponse {
  status?: string;
  message: string;
}
