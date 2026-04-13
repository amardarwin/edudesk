import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ClassModel from "@/models/Class";
import SubjectModel from "@/models/Subject";

// Explicitly use Promise typing for dynamic params in Next.js 15+ App Router
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const body = await req.json();
    
    const updatedClass = await ClassModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedClass) return NextResponse.json({ error: "Class not found" }, { status: 404 });
    
    return NextResponse.json(updatedClass);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;

    // Safety Block: Do not allow deletion if there are subjects mapped to this class
    const subjectsCount = await SubjectModel.countDocuments({ classId: id });
    if (subjectsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete this class. ${subjectsCount} subject(s) are currently attached to it.` },
        { status: 400 } // Bad Request
      );
    }

    const deletedClass = await ClassModel.findByIdAndDelete(id);
    if (!deletedClass) return NextResponse.json({ error: "Class not found" }, { status: 404 });

    return NextResponse.json({ message: "Class deleted safely" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
}
