import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChapterModel from "@/models/Chapter";
import SubjectModel from "@/models/Subject"; // Ensure registered
import BoardModel from "@/models/Board"; // Ensure registered

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    const query = subjectId ? { subjectId } : {};

    const chapters = await ChapterModel.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.subjectId) {
      return NextResponse.json({ error: "subjectId is required" }, { status: 400 });
    }

    const newChapter = await ChapterModel.create(body);
    return NextResponse.json(newChapter, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 });
  }
}
