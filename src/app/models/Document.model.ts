import mongoose, { model, Schema, Document } from "mongoose";


export interface IDocument extends Document {
  user_id: mongoose.Types.ObjectId;
  document_name: string;
  document_type: string;
  document_url: string;
  uploaded_at: Date;
  description: string;
  document_status: string; 
  file_format: string; 
  file_size: number; //in bytes
}

// Schema Definition
const DocumentSchema: Schema<IDocument> = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    document_name: {
      type: String,
      required: true,
    },
    document_type: {
      type: String,
      required: true,
    },
    document_url: {
      type: String,
      required: true,
    },
    uploaded_at: {
      type: Date,
      required: true,
      default: Date.now, // Automatically set the upload date
    },
    description: {
      type: String,
      required: false,
    },
    document_status: {
      type: String,
      required: true,
      enum: ["active", "archived", "deleted"], // Only allow specific values
      default: "active",
    },
    file_format: {
      type: String,
      required: true,
    },
    file_size: {
      type: Number,
      required: true, // File size in bytes
    },
  },
  {
    timestamps: true,
  }
);

// Model Export
const DocumentModel = (mongoose.models.Document as mongoose.Model<IDocument>)||model<IDocument>("Document", DocumentSchema);
export default DocumentModel;
