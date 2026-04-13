import mongoose, { Schema, Document } from "mongoose";

export interface IBoard extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const BoardModel = mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);
export default BoardModel;
