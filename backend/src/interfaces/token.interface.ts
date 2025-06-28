export interface ICreateToken {
  email: string;
  isRefreshToken: boolean;
}

export interface IVerifyToken {
  token: string;
  isRefreshToken: boolean;
}

export interface IUserRefreshToken {
  token?: string;
}

export interface IUserPartialUpdate {
  [key: string]: any;
}
