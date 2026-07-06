import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Programme from "@/models/Programme";
import { PROGRAMMES } from "@/lib/mock";

export async function GET() {
  try {
    await connectDB();
    let list = await Programme.find({});
    if (list.length === 0) {
      const seed = PROGRAMMES.map((p) => ({
        _id: p.id,
        name: p.name,
        category: p.category,
        purpose: p.purpose,
        wing: p.wing,
        wingId: p.wingId,
        date: p.date,
        startTime: p.startTime,
        endTime: p.endTime,
        venueId: p.venueId,
        expectedStudents: p.expectedStudents,
        guest: p.guest,
        equipment: p.equipment,
        budget: p.budget,
        status: p.status,
        attachments: p.attachments,
        comments: p.comments,
        timeline: p.timeline,
        rating: p.rating,
        ratingRemarks: p.ratingRemarks,
      }));
      await Programme.insertMany(seed);
      list = await Programme.find({});
    }
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
      expectedStudents: Number(data.expectedStudents),
      guest: data.guest,
      equipment: data.equipment,
      budget: Number(data.budget),
      status: data.status || "submitted",
      attachments: data.attachments || [],
      comments: data.comments || [],
      timeline: data.timeline || [],
      rating: data.rating,
      ratingRemarks: data.ratingRemarks,
    });
    return NextResponse.json(item);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
