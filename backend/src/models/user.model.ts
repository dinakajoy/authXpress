import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";
import IUserSchema from "../schemas/user.schema";

const UserSchema: Schema<IUserSchema> = new Schema<IUserSchema>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String },
  password: { type: String },
  token: { type: String },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  twoFASecret: { type: String },
  twoFAEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre<IUserSchema>("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(
      config.get("dbConfig.saltWorkFactor") as number
    );
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (err: any) {
    return next(err);
  }
});

// Method to hash passwords
UserSchema.methods.hashPassword = async function (
  password: string
): Promise<string> {
  const salt = await bcrypt.genSalt(
    config.get("dbConfig.saltWorkFactor") as number
  );
  return await bcrypt.hash(password, salt);
};

// Method to compare passwords
UserSchema.methods.validatePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const UserModel: Model<IUserSchema> = mongoose.model<IUserSchema>(
  "User",
  UserSchema
);

export default UserModel;
