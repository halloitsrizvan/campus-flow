import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Programme from "@/models/Programme";

export async function GET() {
  await connectDB();
  const users = await User.find({});
  const progs = await Programme.find({});
  return NextResponse.json({
    users: users.map(u => ({ id: u._id, role: u.role, union: u.union, name: u.name, username: u.username })),
    progs: progs.map(p => ({ id: p._id, wingId: p.wingId, name: p.name, wing: p.wing }))
  });
}
