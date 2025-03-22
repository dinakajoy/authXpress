/* eslint-disable no-unused-vars */
export function WrongCredentialsException(this: any): void {
  this.status = 406;
  this.error = 'Invalid credentials';
}

export function NotFoundUserException(this: any): void {
  this.status = 403;
  this.error = "Please login or create an account";
}

export function UnauthorizedUserException(this: any): void {
  this.status = 401;
  this.error = "You are not authorized";
}

export function ServerErrorException(this: any): void {
  this.status = 500;
  this.error = "Operation unsuccessful";
}

export function AlreadyExistingUserException(this: any): void {
  this.status = 400;
  this.error = "User already exists";
}

export function CustomException(
  this: any,
  code: number,
  message: string
): void {
  this.status = code;
  this.error = message;
}
