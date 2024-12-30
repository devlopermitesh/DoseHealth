import mongoose, { Schema, Document } from "mongoose";

export interface IVitalSignReports extends Document {
  reportId: mongoose.Schema.Types.ObjectId;
  patientId: mongoose.Schema.Types.ObjectId; 
  vitalSignId: mongoose.Schema.Types.ObjectId; 
  value: string; 
  timestamp: Date; 
}


const VitalSignReportsSchema = new Schema<IVitalSignReports>({
  reportId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'VitalSignReports' }, 
  patientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Patients' }, 
  vitalSignId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'VitalSignTypes' }, 
  value: { type: String, required: true }, 
  timestamp: { type: Date, required: true }, 
}, { timestamps: true }); 

// Create and export the model for VitalSignReports
const VitalSignReports =
  mongoose.models.VitalSignReports ||
  mongoose.model<IVitalSignReports>("VitalSignReports", VitalSignReportsSchema);

export default VitalSignReports;
