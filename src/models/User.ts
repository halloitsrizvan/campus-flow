import mongoose, { Schema, Document } from "mongoose";
import type { Role } from "@/lib/mock";

export interface IUser extends Document {
  name: string;
  username: string;
  password?: string;
  role: Role;
  wing?: string;
  union?: string;
}

const UserSchema: Schema = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for mock users if we want them passwordless, but required for super admin
    role: { type: String, required: true },
    wing: { type: String },
    union: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        const r = ret as { id?: string; _id?: unknown; __v?: unknown };
        if (r._id) {
          r.id = String(r._id);
          delete r._id;
        }
        delete r.__v;
        return r;
      },
    },
  },
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
