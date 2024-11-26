import { z } from 'zod';

// Doctor Signup Validation Schema
const doctorSignupSchema = z.object({

  // Specialization of Doctor
  specialization: z.string().min(1, { message: "Specialization is required" }),

  // Experience in Years
  experience_years: z.number().min(0, { message: "Experience years should be at least 0" }),

  // Availability (Days and Time Slots)
  availability: z.array(
    z.object({
      day: z.string().min(1, { message: "Day is required" }),
      time_slots: z.array(z.string()).min(1, { message: "At least one time slot is required" })
    })
  ).min(1, { message: "At least one availability is required" }),

  // Bio Object ID (Handled through backend)
  bio: z.string().uuid({ message: "Invalid bio ID" })
});

// Bio Schema
const bioSchema = z.object({
  doctorId: z.string().uuid({ message: "Invalid doctor ID" }),

  // Education Details
  educations: z.array(
    z.object({
      degree: z.string().min(1, { message: "Degree is required" }),
      institution: z.string().min(1, { message: "Institution name is required" }),
      year_of_graduation: z.number().min(1900, { message: "Year should be valid" }).max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
    })
  ).min(1, { message: "At least one education record is required" }),

  // Certifications Details
  certifications: z.array(
    z.object({
      certification_name: z.string().min(1, { message: "Certification name is required" }),
      institution: z.string().min(1, { message: "Institution name is required" }),
      issue_date: z.date(),
    })
  ).min(1, { message: "At least one certification is required" }),

  // License details
  license_number: z.string().min(1, { message: "License number is required" }),
  license_issued_by: z.string().min(1, { message: "License issuing authority is required" }),

  // Clinic Details
  clinic_details: z.object({
    clinic_name: z.string().min(1, { message: "Clinic name is required" }),
    clinic_address: z.string().min(1, { message: "Clinic address is required" }),
    contact_number: z.string().min(10, { message: "Contact number should be valid" }),
    email: z.string().email({ message: "Invalid email address" }),
  }),

  // Awards and Recognitions
  awards_recognition: z.array(
    z.object({
      award_name: z.string().min(1, { message: "Award name is required" }),
      year_received: z.number().min(1900).max(new Date().getFullYear(), { message: "Invalid year" }),
      description: z.string().min(1, { message: "Description is required" }),
    })
  ).optional(),

  // Languages Spoken (Optional)
  languages_spoken: z.array(z.string()).optional(),

  // Social Links (Optional)
  social_links: z.array(z.string()).optional(),

  // Bio (Short Bio of Doctor)
  bio: z.string().min(10, { message: "Bio must be at least 10 characters long" }),

  // Consultation Fees
  consultation_fees: z.number().positive({ message: "Consultation fees should be positive" }),

  // Profile Verification status
  profile_verified: z.boolean().optional(),

  // Proof of Qualification
  proof_of_qualification: z.array(
    z.object({
      certificate_type: z.string().min(1, { message: "Certificate type is required" }),
      document_url: z.string().url({ message: "Invalid document URL" })
    })
  ).optional(),

  // Availability (Weekdays)
  isavailability: z.object({
    weekdays: z.array(
      z.object({
        day: z.string().min(1, { message: "Day is required" }),
        start_time: z.string().min(1, { message: "Start time is required" }),
        end_time: z.string().min(1, { message: "End time is required" }),
      })
    ).min(1, { message: "At least one weekday availability is required" }),
  }).optional(),
});

// Export the schemas
export { doctorSignupSchema, bioSchema };
