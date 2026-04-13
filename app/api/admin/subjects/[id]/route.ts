import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SubjectModel from "@/models/Subject";
import ChapterModel from "@/models/Chapter";

// Explicitly use Promise typing for dynamic params in Next.js 15+ App Router
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const body = await req.json();
    
    const updatedSubject = await SubjectModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedSubject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    
    return NextResponse.json(updatedSubject);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;

    // Safety Block: Do not allow deletion if chapters are mapped to this subject
    const chaptersCount = await ChapterModel.countDocuments({ subjectId: id });
    if (chaptersCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete this subject. ${chaptersCount} chapter(s) are actively attached to it.` },
        { status: 400 } // Bad Request
      );
    }

    const deletedSubject = await SubjectModel.findByIdAndDelete(id);
    if (!deletedSubject) return NextResponse.json({ error: "Subject not found" }, { status: 404 });

    return NextResponse.json({ message: "Subject deleted safely" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 });
  }
}
