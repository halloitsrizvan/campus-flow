import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const DEFAULT_USERS = [
  {
    _id: "admin",
    name: "Super Admin",
    username: "admin@campusflow.com",
    role: "super_admin",
    password: "admincf",
  },
];

export async function GET() {
  try {
    await connectDB();
    let users = await User.find({});
    if (users.length === 0) {
      await User.insertMany(DEFAULT_USERS);
      users = await User.find({});
    }
    // Omit passwords from the response
    const safeUsers = users.map((u) => {
      const uObj = u.toJSON();
      delete uObj.password;
      return uObj;
    });
    return NextResponse.json(safeUsers);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Check if username already exists
    const existing = await User.findOne({ username: data.username });
    if (existing) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const _id = data.id || `u${Date.now()}`;
    const user = await User.create({
      _id,
      name: data.name,
      username: data.username,
      password: data.password || "demo1234",
      role: data.role,
      wing: data.wing,
    });

    const uObj = user.toJSON();
    delete uObj.password;
    return NextResponse.json(uObj);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
