import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Venue from "@/models/Venue";

export async function GET() {
  try {
    await connectDB();
    const venues = await Venue.find({});
    return NextResponse.json(venues);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const _id = data.id || `v${Date.now()}`;
    const venue = await Venue.create({
      _id,
      name: data.name,
      capacity: Number(data.capacity),
      location: data.location,
      active: data.active !== undefined ? data.active : true,
      blocked: data.blocked !== undefined ? data.blocked : false,
    });
    return NextResponse.json(venue);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
