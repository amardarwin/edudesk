import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SubjectModel from "@/models/Subject";
import BoardModel from "@/models/Board"; // Ensure Board model is registered for populate

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    const query = classId ? { classId } : {};

    const subjects = await SubjectModel.find(query)
      .populate("boardId", "name")
      .sort({ createdAt: -1 });
    return NextResponse.json(subjects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    if (!body.classId || !body.boardId) {
      return NextResponse.json({ error: "classId and boardId are required" }, { status: 400 });
    }

    const newSubject = await SubjectModel.create(body);
    const populated = await newSubject.populate("boardId", "name");
    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}
