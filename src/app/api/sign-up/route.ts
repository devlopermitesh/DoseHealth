import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/app/utils/cloudinary";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const formData = await request.formData();

        // Retrieve form data
        const profile = formData.get("profile") as File;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const Mobile_number = formData.get("Mobile_number") as string;
        const gender = formData.get("gender") as string;
        const age = Number(formData.get("age"));
        const date_of_birth = new Date(formData.get("date_of_birth") as string);
        const zip_code = Number(formData.get("zip_code"));
        const role = formData.get("role") as string;
        const address = formData.get("address") as string;
        const fullname = `${firstName} ${lastName}`;
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("Form Data:", { profile, firstName, lastName, email, Mobile_number, gender, age, date_of_birth, zip_code, role, address });

        // Cloudinary upload helper
        const uploadProfileToCloudinary = async (file: File, folder: string) => {
            if (!file) {
                console.warn("No profile file provided.");
                return ""; // Optional: Set a default avatar URL here
            }
            try {
                const data = await uploadToCloudinary(file, folder);
                return data.secure_url || "";
            } catch (error) {
                console.error("Cloudinary Upload Error:", error);
                throw new Error("Error uploading profile image");
            }
        };

        // Check for duplicate email or mobile number
        const existingUser = await UserModel.findOne({
            $or: [
                { email },
                { Mobile_number }
            ]
        });

        if (existingUser) {
            console.log("Duplicate user detected:", existingUser);
            return NextResponse.json(
                { success: false, message: "User already exists with the same email or mobile number" },
                { status: 400 }
            );
        }

        // Upload profile image to Cloudinary
        const avatarUrl = await uploadProfileToCloudinary(profile, "user-profile");
        console.log("Avatar URL:", avatarUrl);

        // Set verification expiry date
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        // Create new user
        const newUser = await UserModel.create({
            Profile: avatarUrl,
            firstName,
            lastName,
            email,
            Mobile_number,
            gender,
            age,
            date_of_birth,
            zip_code,
            role,
            verifyExpires: expiryDate,
            verifyCode,
            verified: false,
            address
        });

        console.log("New User Created:", newUser);

        // Return success response
        return NextResponse.json(
            {
                message: "User registered successfully! Fill the next step to complete registration.",
                data: newUser._id,
                success: true
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Error during user registration:", error);

        if (error instanceof Error) {
            if (error.message.includes("email_1 dup key")) {
                return NextResponse.json(
                    { success: false, message: "User already exists with the same email or mobile number" },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, message: error.message || "Something went wrong during registration." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Unknown error occurred during registration." },
            { status: 500 }
        );
    }
}
