import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import MaterialModel from "@/models/Material";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");

    const query = chapterId ? { chapterId } : {};

    // Sort by integer order sequentially
    const materials = await MaterialModel.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(materials);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.chapterId) {
      return NextResponse.json({ error: "chapterId is required" }, { status: 400 });
    }

    const newMaterial = await MaterialModel.create(body);
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
