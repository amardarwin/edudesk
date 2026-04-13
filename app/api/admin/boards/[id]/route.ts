import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import BoardModel from "@/models/Board";
import SubjectModel from "@/models/Subject";

// Explicitly use Promise typing for dynamic params in Next.js 15+ App Router
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const body = await req.json();
    
    const updatedBoard = await BoardModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedBoard) return NextResponse.json({ error: "Board not found" }, { status: 404 });
    
    return NextResponse.json(updatedBoard);
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "A Board with this name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update board" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;

    // Safety Block: Do not allow deletion if there are subjects mapped to this board
    const subjectsCount = await SubjectModel.countDocuments({ boardId: id });
    if (subjectsCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete this board. ${subjectsCount} subject(s) are actively using it.` },
        { status: 400 } // Bad Request
      );
    }

    const deletedBoard = await BoardModel.findByIdAndDelete(id);
    if (!deletedBoard) return NextResponse.json({ error: "Board not found" }, { status: 404 });

    return NextResponse.json({ message: "Board deleted safely" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete board" }, { status: 500 });
  }
}
