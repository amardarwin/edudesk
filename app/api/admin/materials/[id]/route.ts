import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import MaterialModel from "@/models/Material";

// Explicitly use Promise typing for dynamic params in Next.js 15+ App Router
export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;
    const body = await req.json();
    
    const updatedMaterial = await MaterialModel.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedMaterial) return NextResponse.json({ error: "Material not found" }, { status: 404 });
    
    return NextResponse.json(updatedMaterial);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await props.params;

    const deletedMaterial = await MaterialModel.findByIdAndDelete(id);
    if (!deletedMaterial) return NextResponse.json({ error: "Material not found" }, { status: 404 });

    return NextResponse.json({ message: "Material deleted safely" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
