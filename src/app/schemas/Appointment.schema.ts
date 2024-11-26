import { z } from "zod";
import mongoose from "mongoose";

// Enum validations for AppointmentStatus, PaymentStatus, and AppointmentType
export const StatusEnum = z.enum(["pending", "confirmed", "completed", "cancelled"]);
export const PaymentStatusEnum = z.enum(["paid", "unpaid", "partially_paid"]);
export const AppointmentTypeEnum = z.enum(["InPerson", "Telemedicine", "HomeVisit"]);

// Zod schema for Appointment data validation
export const AppointmentSchema = z.object({
  patientId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid patientId",
  }),
  doctorId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid doctorId",
  }),
  appointmentDate: z.string().min(1, { message: "appointmentDate is required" }),
  appointmentTime: z.string().min(1, { message: "appointmentTime is required" }),
  status: StatusEnum.optional().default("pending"),
  paymentStatus: PaymentStatusEnum.optional().default("unpaid"),
  fees: z.number().min(0, { message: "Fees must be a positive number" }),
  reason: z.string().optional(),
  appointmentType: AppointmentTypeEnum,
  bookedAt: z.date().default(() => new Date()),
  notes: z.string().optional(),
  location: z.string().optional(),
  followUpAppointmentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid followUpAppointmentId",
  }).optional(),
  prescriptionId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid prescriptionId",
  }).optional(),
  reminderSentAt: z.date().optional(),
  invoiceId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid invoiceId",
  }).optional(),
});

