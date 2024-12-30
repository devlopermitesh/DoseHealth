import mongoose, { Schema, Document } from "mongoose";

// Define the IVitalSignTypes interface
export interface IVitalSignTypes extends Document {
  
  name: string;
  unit: string;
}

// Define the schema for VitalSignTypes
const VitalSignTypesSchema = new Schema<IVitalSignTypes>({
  name: { type: String, required: true }, // e.g., 'Blood Pressure', 'Heart Rate'
  unit: { type: String, required: true }, // e.g., 'mmHg', 'bpm', 'mg/dL'
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

// Create and export the model for VitalSignTypes
const VitalSignTypes =
  mongoose.models.VitalSignTypes ||
  mongoose.model<IVitalSignTypes>("VitalSignTypes", VitalSignTypesSchema);

export default VitalSignTypes;
