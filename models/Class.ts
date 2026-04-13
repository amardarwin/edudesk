import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
      unique: true, // Assuming class names are unique
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

const ClassModel = mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);
export default ClassModel;
