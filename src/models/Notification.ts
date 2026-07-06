import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  at: string;
  read: boolean;
  type: string;
}

const NotificationSchema: Schema = new Schema(
  {
    _id: { type: String },
    title: { type: String, required: true },
    message: { type: String, required: true },
    at: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, required: true, default: "info" },
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

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
