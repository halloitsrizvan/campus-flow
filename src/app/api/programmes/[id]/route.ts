import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Programme from "@/models/Programme";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();
    const item = await Programme.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!item) {
      return NextResponse.json({ error: "Programme not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const item = await Programme.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json({ error: "Programme not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Programme deleted successfully" });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
