import { Document } from "mongoose";

interface IUserSchema extends Document {
  name: string;
  email: string;
  role?: string;
  password: string;
  token: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  twoFASecret?: string;
  twoFAEnabled?: boolean;
  createdAt: Date;
  validatePassword(password: string): Promise<boolean>;
  hashPasswordd(password: string): Promise<string>;
}

export default IUserSchema;
