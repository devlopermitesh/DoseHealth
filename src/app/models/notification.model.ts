import mongoose, { Schema, model, Document } from "mongoose";


export interface INotification extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  type: string;
  message: string;
  read: boolean;
  appointment_id?: mongoose.Types.ObjectId; 
  doctor_id?: mongoose.Types.ObjectId; 
  created_at: Date;
}


const NotificationSchema: Schema<INotification> = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Appointment", "Message", "System", "Reminder", "Update"], 
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false, 
    },
    created_at: {
      type: Date,
      default: Date.now, 
    },
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment", 
    },
    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", 
    },
  },
  {
    timestamps: true, 
  }
);


const NotificationModel = model<INotification>("Notification", NotificationSchema);
export default NotificationModel;
