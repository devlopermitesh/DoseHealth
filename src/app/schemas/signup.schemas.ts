import { string, z } from "zod";
import { phoneNumber } from "./login.schemas";

export const signupSchema = z.object({
  profile: z.string().refine(
    (file) => {
      // Check if file is a valid image format and size is less than 2MB
      const validFormats = ["image/jpeg", "image/png", "image/jpg"];
      return file && validFormats.some((format) => file.includes(format));
    },
    {
      message: "Profile image must be less than 2MB and in jpeg, png, or jpg format",
    }
  ),

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
  age: z
    .number()
    .min(1, { message: "Age should not be less than 1" })
    .max(120, { message: "Age should not be greater than 120" }),
  date_of_birth: z.date().refine(
    (date) => date <= new Date(),
    { message: "Date of birth cannot be in the future" }
  ),
  zip_code: z
    .number()
    .refine(
      (value) => /^[0-9]{5,6}$/.test(value.toString()),
      { message: "Zip code must be a valid number with 5-6 digits" }
    ),
});
