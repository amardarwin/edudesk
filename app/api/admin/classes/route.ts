import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ClassModel from "@/models/Class";

export async function GET() {
  try {
    await connectToDatabase();
    const classes = await ClassModel.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newClass = await ClassModel.create(body);
    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Class name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}
