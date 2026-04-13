import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChapterModel from "@/models/Chapter";

// Explicitly use Promise typing for dynamic params in Next.js 15+ App Router
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const body = await req.json();
    
    const updatedChapter = await ChapterModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedChapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    
    return NextResponse.json(updatedChapter);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update chapter" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;

    // Chapters are the lowest level here before lessons/materials, so we allow deletion directly for now
    const deletedChapter = await ChapterModel.findByIdAndDelete(id);
    if (!deletedChapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });

    return NextResponse.json({ message: "Chapter deleted safely" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete chapter" }, { status: 500 });
  }
}
