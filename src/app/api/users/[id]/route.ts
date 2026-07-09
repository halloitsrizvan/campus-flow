import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();

    const updateData = { ...data };
    // If password is provided but empty, don't update it
    if (updateData.password === "") {
      delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const uObj = user.toJSON();
    delete uObj.password;
    return NextResponse.json(uObj);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    // Prevent deleting the super admin
    if (id === "admin") {
      return NextResponse.json(
        { error: "Cannot delete the default super admin account" },
        { status: 403 },
      );
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
