import { z } from "zod";
import mongoose from "mongoose";

// Enum for Payment Status
const PaymentStatusEnum = z.enum(["paid", "unpaid", "partially_paid"]);

// Enum for Payment Method
const PaymentMethodEnum = z.enum(["Cash", "Credit Card", "Online Transfer", "Insurance"]);

// Items Type Schema Validation
const ItemSchema = z.object({
  description: z.string(),
  qualitity: z.number().min(1, { message: "Quantity must be at least 1" }),
  price: z.number().min(0, { message: "Price must be greater than or equal to 0" }),
  total: z.number().min(0, { message: "Total must be greater than or equal to 0" }),
});

// Invoice Schema Validation
const InvoiceSchema = z.object({
  invoice_number: z.string(),
  userId: z.string().refine(value => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid userId",
  }),
  appointmentId: z.string().refine(value => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid appointmentId",
  }),
  doctor: z.string().refine(value => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid doctor id",
  }),
  items: z.array(ItemSchema),
  subtotal: z.number().min(0, { message: "Subtotal must be greater than or equal to 0" }),
  tax: z.number().min(0, { message: "Tax must be greater than or equal to 0" }),
  discount: z.number().min(0, { message: "Discount must be greater than or equal to 0" }),
  payment_status: PaymentStatusEnum,
  invoice_date: z.date(),
  information: z.string().optional(),
  Total: z.number().min(0, { message: "Total must be greater than or equal to 0" }),
  payment_method: PaymentMethodEnum,
});

export default InvoiceSchema;
