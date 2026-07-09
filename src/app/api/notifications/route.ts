import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET() {
  try {
    await connectDB();
    const list = await Notification.find({});
    return NextResponse.json(list);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT() {
  try {
    await connectDB();
    await Notification.updateMany({}, { $set: { read: true } });
    const list = await Notification.find({});
    return NextResponse.json(list);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
