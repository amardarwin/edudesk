import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import MaterialModel from "@/models/Material";

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Expecting payload format: [{ _id: '123', order: 0 }, { _id: '456', order: 1 }]
    const items: { _id: string; order: number }[] = await req.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload, must be an array of objects." }, { status: 400 });
    }

    // Execute bulk updates using Mongoose / MongoDB bulkWrite for performance
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } },
      },
    }));

    if (bulkOps.length > 0) {
      await MaterialModel.bulkWrite(bulkOps);
    }

    return NextResponse.json({ message: "Materials reordered successfully" }, { status: 200 });
  } catch (error) {
    console.error("Bulk reorder error:", error);
    return NextResponse.json({ error: "Failed to reorder materials" }, { status: 500 });
  }
}
