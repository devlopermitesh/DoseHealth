import mongoose, { model, Schema, Document } from "mongoose";

enum Status {
  Active = "Active",
  Expired = "Expired",
  Refilled = "Refilled",
}
type MedicationTYPE={
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: number;
  instructions: string;
  information: string;
  
}
export interface IPrescription extends Document {
  patient_id: mongoose.Types.ObjectId;
  doctor_id: mongoose.Types.ObjectId;
  medications: MedicationTYPE[];
  diagnosis: string[];
  issue_date: Date;
  valid_until: Date;
  instruction: string;
  notes: string;
  status: Status;
}
const MedicationSchema:Schema<MedicationTYPE>=new Schema({
  medication_name:{type:String,required:true},
  dosage:{type:String,required:true},
  frequency:{type:String,required:true},
  duration:{type:Number,required:true},
  instructions:{type:String,required:true},
  information:{type:String,required:true},

},{
  timestamps:true
})
const PrescriptionSchema: Schema<IPrescription> = new Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    medications: [MedicationSchema],
    diagnosis: [
      {
        type: String,
        required: false, 
      },
    ],
    issue_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    valid_until: {
      type: Date,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false, 
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const PrescriptionModel =
  mongoose.models.Prescription as mongoose.Model<IPrescription> ||
  model<IPrescription>("Prescription", PrescriptionSchema);

export default PrescriptionModel;