export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role?: string;
  token?: string;
}

export interface LoginResponse {
  payload: {
    token: string;
    user: IUser;
  };
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
