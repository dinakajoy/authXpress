export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  token?: string;
  role?: string;
  twoFAEnabled?: boolean;
  twoFASecret?: string;
}

export interface IUserWithRole {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  token?: string;
  role?: {
    label: string;
  };
  twoFAEnabled?: boolean;
  twoFASecret?: string;
}