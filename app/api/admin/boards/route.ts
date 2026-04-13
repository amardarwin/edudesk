import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import BoardModel from "@/models/Board";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all boards
    const boards = await BoardModel.find().sort({ createdAt: -1 });
    return NextResponse.json(boards);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch boards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newBoard = await BoardModel.create(body);
    return NextResponse.json(newBoard, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "A Board with this name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create board" }, { status: 500 });
  }
}
