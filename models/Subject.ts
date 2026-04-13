import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;
  classId: Types.ObjectId;
  boardId: Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class ID is required to map this subject"],
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: false, // Optional for legacy support
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const SubjectModel = mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);
export default SubjectModel;
