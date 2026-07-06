import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Venue from "@/models/Venue";

const VENUES = [
  { _id: "v1", name: "Main Auditorium", capacity: 500, location: "Block A, GF", active: true },
  { _id: "v2", name: "Seminar Hall 1", capacity: 120, location: "Block B, 1F", active: true },
  { _id: "v3", name: "Seminar Hall 2", capacity: 80, location: "Block B, 2F", active: true },
  { _id: "v4", name: "Open Air Theatre", capacity: 800, location: "Campus Ground", active: true },
  {
    _id: "v5",
    name: "Conference Room",
    capacity: 40,
    location: "Block C, 3F",
    active: true,
    blocked: true,
  },
  { _id: "v6", name: "Sports Ground", capacity: 1000, location: "North Campus", active: true },
];

export async function GET() {
  try {
    await connectDB();
    let venues = await Venue.find({});
    if (venues.length === 0) {
      await Venue.insertMany(VENUES);
      venues = await Venue.find({});
    }
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
