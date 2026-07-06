import mongoose, { Schema, Document } from "mongoose";

export interface IVenue extends Document {
  name: string;
  capacity: number;
  location: string;
  active: boolean;
  blocked?: boolean;
}

const VenueSchema: Schema = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    location: { type: String, required: true },
    active: { type: Boolean, default: true },
    blocked: { type: Boolean, default: false },
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

export default mongoose.models.Venue || mongoose.model<IVenue>("Venue", VenueSchema);
