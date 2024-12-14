import { z } from "zod";
import { phoneNumber } from "./login.schemas";


const issueDateValidation =  z
.string()
.transform((val) => (val === "0000-00-00" || val === "" ? "" : val))
.refine((dateStr) => {
  if (dateStr === "") return true; // Skip validation if empty string (no date)
  const date = new Date(dateStr);
  return date <= new Date(); // Validate that the date is not in the future
}, {
  message: "Test cannot be in the future",
})

// Combined Doctor Schema
const combinedDoctorSchema = z.object({
  // Specialization of Doctor
  specialization: z.string().min(1, { message: "Specialization is required" }),

  // Experience in Years
  experience_years: z.number().min(0, { message: "Experience years should be at least 0" }),
  availableEveryDay: z.string().optional().default("Yes"),

  // Availability (Days and Time Slots)
  availability: z
    .array(
      z.object({
        day: z.string().min(1, { message: "Day is required" }),
        time_slots: z
          .array(z.string())
          .min(1, { message: "At least one time slot is required" }),
      })
    )
    .min(1, { message: "At least one availability is required" }),

  bio: z.string().min(1, { message: "Bio is required" }),

  // Bio Section
  bio_details: z.object({
    // Education Details
    educations: z
      .array(
        z.object({
          degree: z.string().min(1, { message: "Degree is required" }),
          institution: z.string().min(1, { message: "Institution name is required" }),
          year_of_graduation:  z
          .preprocess((val) => (typeof val === "string" ? parseInt(val, 10) : val), z.number())
          ,
               file:  z
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
      .min(1, { message: "At least one education record is required" }),

    // Certifications Details
    certifications: z
      .array(
        z.object({
          certification_name: z
            .string()
            .min(1, { message: "Certification name is required" }),
            institution: z.string().min(1, { message: "Institution name is required" }),
            issue_date: issueDateValidation,
          file:  z
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
      .min(1, { message: "At least one certification is required" }),

    // License details
    license_number: z.string().min(1, { message: "License number is required" }),
    license_issued_by: z
      .string()
      .min(1, { message: "License issuing authority is required" }),
    license_type:z.string().min(1, { message: "License type is required" }),
    license_proof:z
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

    // Clinic Details
    clinic_details: z.object({
      clinic_name: z.string().min(1, { message: "Clinic name is required" }),
      clinic_address: z.string().min(1, { message: "Clinic address is required" }),
      clinic_zipcode: z.coerce.number()
      .refine(
        (value) => /^[0-9]{5,6}$/.test(value.toString()),
        { message: "Zip code must be a valid number with 5-6 digits" }
      ),
      contact_number: phoneNumber,
      email: z.string().email({ message: "Invalid email address" }),
    }),
    haveAwards: z.string().optional().default("No"),

    // Awards and Recognitions
    awards_recognition: z
      .array(
        z.object({
          award_name: z.string().min(1, { message: "Award name is required" }),
          year_received:  z
          .preprocess((val) => (typeof val === "string" ? parseInt(val, 10) : val), z.number()),
          description: z.string().min(1, { message: "Description is required" }),
        })
      )
      .optional(),

    // Languages Spoken (Optional)
    languages_spoken: z.array(z.string()).optional(),

    // Social Links (Optional)
    social_links: z.array(z.string()).optional(),

    // Consultation Fees
    consultation_fees: z
      .number()
      .positive({ message: "Consultation fees should be positive" }),
    consulation_currency:z.string(),

    
  }),
});

export { combinedDoctorSchema };
