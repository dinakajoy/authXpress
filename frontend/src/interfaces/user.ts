export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role?:
    | string
    | {
        label: string;
        permission: string[]; // array of permission IDs
      };
  token?: string;
  password?: string;
  twoFAEnabled?: boolean;
}

export interface IUserWithRole {
  _id?: string;
  name: string;
  email: string;
  role?: {
    label: string;
    permission: string[]; // array of permission IDs
  };
  token?: string;
  password?: string;
  twoFAEnabled?: boolean;
}

export interface LoginResponse {
  payload: IUserWithRole;
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
