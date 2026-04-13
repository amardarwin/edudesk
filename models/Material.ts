import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMaterial extends Document {
  name: string;
  type: "pdf" | "audio" | "video" | "quiz";
  links: {
    english?: string;
    hindi?: string;
    punjabi?: string;
  };
  chapterId: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Material name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["pdf", "audio", "video", "quiz"],
      required: [true, "Material type is required"],
    },
    links: {
      english: { type: String, trim: true, default: "" },
      hindi: { type: String, trim: true, default: "" },
      punjabi: { type: String, trim: true, default: "" },
    },
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: [true, "Chapter ID is required"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const MaterialModel = mongoose.models.Material || mongoose.model<IMaterial>("Material", MaterialSchema);
export default MaterialModel;
