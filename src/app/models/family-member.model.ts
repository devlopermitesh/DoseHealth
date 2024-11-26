import mongoose, { model, Schema, Document } from "mongoose";

export interface IDependency extends Document {
  patient_id: mongoose.Schema.Types.ObjectId;
  name: string;
  profile_url?: string; // Optional
  relationships: string;
  age: number;
  birth_of_date: Date; // Correct type
  contact_number: string;
  email: string;
  address: string;
}

const DependencySchema: Schema<IDependency> = new Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    profile_url: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    relationships: {
      type: String,
      required: true,
      default: "relative",
    },
    age: {
      type: Number,
      required: true,
      max: [120, "Age cannot be greater than 120"],
      min: [1, "Age must be at least 1"],
    },
    birth_of_date: {
      type: Date,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please enter a valid email address",
      ], // Email validation regex
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const DependencyModel =
  mongoose.models.Dependency as mongoose.Model<IDependency> ||
  model<IDependency>("Dependency", DependencySchema);

export default DependencyModel;
