import { object, string, z } from "zod";
import { phoneNumber } from "./login.schemas";

export const signupSchema = z.object({
  profile: z
  .instanceof(File)
  .refine((file) => {
    // Check if the file is a valid image format and size is less than 2MB
    const validFormats = ["image/jpeg", "image/png", "image/jpg"];
    const isValidFormat = validFormats.includes(file.type);
    const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB in bytes
    return isValidFormat && isValidSize;
  }, {
    message: "Profile image must be less than 2MB and in jpeg, png, or jpg format",
  }),
  firstName: z
  .string()
  .trim()
  .min(1, { message: "First name should not be empty" })
  .max(30, { message: "First name length should be less than 30 characters" }),
  lastName: z.string()
  .trim()
  .min(1, { message: "last name should not be empty" })
  .max(30, { message: "last name length should be less than 30 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  Mobile_number: phoneNumber,
  gender: z.enum(["male", "female", "other"], {
    message: "Gender must be one of 'male', 'female', or 'other'",
  }),
  age: z.coerce.number()
    .min(1, { message: "Age should not be less than 1" })
    .max(120, { message: "Age should not be greater than 120" }),
    date_of_birth: z
    .string().transform((val) => (val === "0000-00-00" ? "" : val))  
    .refine((dateStr) => {
      const date = new Date(dateStr); // Convert the string to a Date object
      return date <= new Date(); // Validate that the date is not in the future
    }, {
      message: "Date of birth cannot be in the future",
    }),
  role: z.enum(["Patient", "Doctor"], { message: "Role must be one of 'Patient' or 'Doctor'" }),

  zip_code: z.coerce.number()
  .refine(
    (value) => /^[0-9]{5,6}$/.test(value.toString()),
    { message: "Zip code must be a valid number with 5-6 digits" }
  ),
  address: z.string().min(1, { message: "Address should not be empty" }),
});
