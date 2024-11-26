import { z } from "zod";

// Define a phone number schema
export const phoneNumber = z
  .string()
  .regex(
    /^(\+?[1-9]\d{0,2})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{0,9}$/,
    "Invalid phone number format"
  )
  .min(10, "Phone number must be at least 10 characters long")
  .max(15, "Phone number must not exceed 15 characters");

export const loginSchema = z.object({
  phoneNumber: phoneNumber,
})