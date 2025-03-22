import { Types } from "mongoose";

export interface IUserRole {
  label: string;
  description: string;
  permissions: Types.ObjectId[];
}
