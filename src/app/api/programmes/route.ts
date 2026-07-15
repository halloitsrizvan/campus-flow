import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Programme from "@/models/Programme";

export async function GET() {
  try {
    await connectDB();
    const list = await Programme.find({});
    return NextResponse.json(list);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const _id = data.id || `p${Date.now()}`;
    const item = await Programme.create({
      _id,
      name: data.name,
      category: data.category,
      purpose: data.purpose,
      wing: data.wing,
      wingId: data.wingId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      venueId: data.venueId,
      audience: data.audience,
      guests: data.guests,
      equipment: data.equipment,
      budget: data.budget,
      status: data.status || "submitted",
      poster: data.poster,
      comments: data.comments || [],
      timeline: data.timeline || [],
      rating: data.rating,
      ratingRemarks: data.ratingRemarks,
      committeeApproved: data.committeeApproved,
      teacherApproved: data.teacherApproved,
    });
    return NextResponse.json(item);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
