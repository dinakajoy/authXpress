import mongoose, { Schema } from 'mongoose';
import { IUserRoleModel, IUserRoleDocument } from '../schemas/userRole.schema'

const UserRoleSchema = new Schema({
  label: { type: String, required: true },
  description: { type: String, required: false },
  permission: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});

export default mongoose.model<IUserRoleDocument, IUserRoleModel>(
  'UserRole',
  UserRoleSchema
);
