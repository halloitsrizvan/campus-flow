import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { NOTIFICATIONS } from "@/lib/mock";

export async function GET() {
  try {
    await connectDB();
    let list = await Notification.find({});
    if (list.length === 0) {
      const seed = NOTIFICATIONS.map((n) => ({
        _id: n.id,
        title: n.title,
        message: n.message,
        at: n.at,
        read: n.read,
        type: n.type,
      }));
      await Notification.insertMany(seed);
      list = await Notification.find({});
    }
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
