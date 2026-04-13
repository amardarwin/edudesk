import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChapter extends Document {
  name: string;
  subjectId: Types.ObjectId;
  classId?: Types.ObjectId;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Chapter name is required"],
      trim: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Subject ID is required"],
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ChapterModel = mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", ChapterSchema);
export default ChapterModel;
