import mongoose, { Schema, Document } from "mongoose";

export interface IComment {
  id: string;
  author: string;
  role: string;
  text: string;
  at: string;
}

export interface ITimelineItem {
  label: string;
  at?: string;
  done: boolean;
}

export interface IPoster {
  name: string;
  size: string;
}

export interface IProgramme extends Document {
  name: string;
  category: string;
  purpose: string;
  wing: string;
  wingId: string;
  date: string;
  startTime: string;
  endTime: string;
  venueId: string;
  audience: string;
  guests?: { name: string; position: string }[];
  equipment?: string[];
  budget: { item: string; amount: number }[];
  status: string;
  poster?: IPoster;
  comments: IComment[];
  timeline: ITimelineItem[];
  rating?: number;
  ratingRemarks?: string;
  committeeApproved?: boolean;
  teacherApproved?: boolean;
}

const CommentSchema = new Schema(
  {
    id: { type: String, required: true },
    author: { type: String, required: true },
    role: { type: String, required: true },
    text: { type: String, required: true },
    at: { type: String, required: true },
  },
  { _id: false },
);

const TimelineSchema = new Schema(
  {
    label: { type: String, required: true },
    at: { type: String },
    done: { type: Boolean, default: false },
  },
  { _id: false },
);

const PosterSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
  },
  { _id: false },
);

const GuestSchema = new Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
  },
  { _id: false },
);

const BudgetItemSchema = new Schema(
  {
    item: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false },
);

const ProgrammeSchema: Schema = new Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    category: { type: String, required: true },
    purpose: { type: String, required: true },
    wing: { type: String, required: true },
    wingId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venueId: { type: String, required: true },
    audience: { type: String, required: true, enum: ["Limited", "All", "Selected", "Out"] },
    guests: [GuestSchema],
    equipment: [{ type: String }],
    budget: [BudgetItemSchema],
    status: { type: String, required: true, default: "submitted" },
    poster: PosterSchema,
    comments: [CommentSchema],
    timeline: [TimelineSchema],
    rating: { type: Number },
    ratingRemarks: { type: String },
    committeeApproved: { type: Boolean, default: false },
    teacherApproved: { type: Boolean, default: false },
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

if (mongoose.models.Programme) {
  delete mongoose.models.Programme;
}

export default mongoose.model<IProgramme>("Programme", ProgrammeSchema);
