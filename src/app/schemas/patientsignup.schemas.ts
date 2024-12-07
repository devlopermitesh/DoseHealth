import { z } from "zod";

// Define the schema with default values
export const patientInputSchema = z.object({
  blood_group: z
    .string()
    .optional()
    .default("")
    .refine((val) => ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].includes(val as string), {
      message: "Invalid blood group",
    }),
    civil_status:z.enum(["single", "married", "divorced", "widowed", "separated"]).default("single"),
    height: z
    .number()
    .min(30, { message: "Height must be at least 30 cm" })  // Minimum height
    .max(300, { message: "Height cannot exceed 300 cm" })  // Adjusted for extreme cases
    .optional()
    .default(170), // Default average height
    weight: z
    .number()
    .min(1, { message: "Weight must be at least 1 kg" })  // Minimum weight
    .max(500, { message: "Weight cannot exceed 500 kg" })  // Maximum weight
    .optional()
    .default(70), // Default weight value (e.g., average adult weight)
  
  bmi: z.number().positive().optional().default(0),
  doyouhaveInsurance: z.enum(["Yes", "No"]).optional().default("Yes"),
  note: z.string().optional().default(""),
  doyouhavesurgeries: z.string().optional().default("No"),
  surgeries: z.array(z.string()).optional().default([]),
  dateofsurgery:  z.string().transform((val) => (val === "0000-00-00" ? "" : val))  
  .refine((dateStr) => {
    const date = new Date(dateStr); // Convert the string to a Date object
    return date <= new Date(); // Validate that the date is not in the future
  }, {
    message: "Past surgery date cannot be in the future",
  }).optional(),
  surgeon: z.array(z.string()).optional().default([]),
  outcomes: z.array(z.string()).optional().default([]),
  doyouhaveanycomplications: z.string().optional().default("Yes"),
  complications: z.array(z.string()).optional().default([]),
  locationofpain: z.array(z.string()).optional().default([]),
  levelofpain: z.string().optional().default(""),
  medical_history: z
    .object({
      chronic_diseases: z.array(z.string()).optional().default([]),
      past_conditions: z.array(z.string()).optional().default([]),
      allergies: z.array(z.string()).optional().default([]),
      medications: z.array(z.string()).optional().default([]),
      surgical_history: z.array(z.string()).optional().default([]),
    })
    .optional()
    .default({}),
  insurance: z
    .array(
      z.object({
        provider: z.string().min(1, { message: "Provider name is required" }).optional(),
        policy_number: z.string().min(1, { message: "Policy number is required" }),
        coverage: z.string().min(1, { message: "Coverage description is required" }),
        expiry_date: z.date().refine((date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset to midnight for a proper date comparison
          return date > today;
        }, { message: "Expiry date must be in the future" }),
      })
    )
    .optional()
    .default([]),
  appointments: z
    .array(z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid appointment ID format" }))
    .optional()
    .default([]),
  medical_documents: z
    .array(z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid document ID format" }))
    .optional()
    .default([]),
  current_health_status: z
    .object({
      current_medications: z.array(z.string()).optional().default([]),
      doyouhaverecenttests: z.string().optional().default("Yes"),
      recent_tests: z
        .array(
          z.object({
            test_name: z.string().optional(),
            test_date: z
            .string()
            .transform((val) => (val === "0000-00-00" || val === "" ? "" : val))
            .refine((dateStr) => {
              if (dateStr === "") return true; // Skip validation if empty string (no date)
              const date = new Date(dateStr);
              return date <= new Date(); // Validate that the date is not in the future
            }, {
              message: "Test cannot be in the future",
            })
            .optional()
            .default(""),
          
            result: z.string().min(1),
            file: z
            .instanceof(File)
            .refine((file) => {
              // Check if the file is a valid image format and size is less than 2MB
              const validFormats = ["image/jpeg", "image/png", "image/jpg"];
              const isValidFormat = validFormats.includes(file.type);
              const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB in bytes
              return isValidFormat && isValidSize;
            }, {
              message: "file must be less than 5MB and in jpeg, png, or jpg format",
            }).optional(),
          })
        )
        .optional()
        .default([]),
      symptoms: z.array(z.string()).optional().default([]),
    })
    .optional()
    .default({}),
});

