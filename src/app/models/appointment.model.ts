import mongoose, { Schema, model, Document } from "mongoose";

enum Status {
  pending = "pending",
  confirmed = "confirmed",
  completed = "completed",
  cancelled = "cancelled",
}

enum PaymentStatus {
  paid = "paid",
  unpaid = "unpaid",
  partially_paid = "partially_paid",
}

enum AppointmentType {
  InPerson = "InPerson",
  Telemedicine = "Telemedicine",
  HomeVisit = "HomeVisit",
}

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  appointmentDate: string; 
  appointmentTime: string; 
  status: Status;
  paymentStatus: PaymentStatus;
  fees: number;
  reason: string;
  appointmentType: AppointmentType;
  bookedAt: Date;
  notes: string;
  location: string;
  followUpAppointmentId: mongoose.Types.ObjectId;
  prescriptionId: mongoose.Types.ObjectId;
  reminderSentAt: Date;
  invoiceId: mongoose.Types.ObjectId;
}

const AppointmentSchema: Schema<IAppointment> = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.pending,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.unpaid,
    },
    fees: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
    appointmentType: {
      type: String,
      enum: Object.values(AppointmentType),
      required: true,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    location: {
      type: String,
    },
    followUpAppointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
    reminderSentAt: {
      type: Date,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
  },
  {
    timestamps: true, 
  }
);

export const AppointmentModel = mongoose.models.Appointment as mongoose.Model<IAppointment> || model<IAppointment>("Appointment", AppointmentSchema);
export default AppointmentModel;
