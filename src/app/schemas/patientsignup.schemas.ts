import { z } from 'zod';

export const patientInputSchema = z.object({
   blood_group: z
    .string()
    .optional()
    .refine(val => ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].includes(val as string), {
      message: "Invalid blood group",
    }),
  height: z.number().min(30).max(250).optional(),
  weight: z.number().min(1).max(500).optional(),
  bmi: z.number().positive().optional(),
  medical_history: z.object({
    chronic_diseases: z.array(z.string()).optional(),
    past_conditions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
    surgical_history: z.array(z.string()).optional(),
  }).optional(),
  insurance: z.array(
    z.object({
      provider: z.string().min(1, { message: "Provider name is required" }),
      policy_number: z.string().min(1, { message: "Policy number is required" }),
      coverage: z.string().min(1, { message: "Coverage description is required" }),
      expiry_date: z.date().refine(date => date > new Date(), { message: "Expiry date must be in the future" }),
    })
  ).optional(),
  appointments: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid appointment ID format" })).optional(),
  medical_documents: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid document ID format" })).optional(),
  current_health_status: z.object({
    current_medications: z.array(z.string()).optional(),
    recent_tests: z.array(z.object({
      test_name: z.string().min(1),
      test_date: z.date().refine(date => date <= new Date(), { message: "Test date cannot be in the future" }),
      result: z.string().min(1),
    })).optional(),
    symptoms: z.array(z.string()).optional(),
  }).optional(),
  dependencys: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/, { message: "Invalid dependency ID format" })).optional(),
});
