import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { NextResponse } from "next/server";
import {IUser,Role} from "@/app/models/user.model"
import { SendVerificationEmail } from "@/app/helpers/SendVerificationEmail";
import { uploadToCloudinary } from "@/app/utils/cloudinary";
export async function POST(request: Request) {
    await dbConnect();
    try {
        const formData = await request.formData();
        const Profile = formData.get("Profile") as File;
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const Mobile_number = formData.get("Mobile_number") as string;
        const gender = formData.get("gender") as string;
        const age = Number(formData.get("age"));
        const date_of_birth = new Date(formData.get("date_of_birth") as string);
        const zip_code = Number(formData.get("zip_code"));
        const role = formData.get("role") as Role;
        const address = formData.get("address") as string;
        const fullname = `${firstName} ${lastName}`;
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const avatar={url:""}
console.log("role",role)

        //upload image on cloudinary
        if (Profile) {
            try {
              const data = await uploadToCloudinary(Profile, "user-profile");
              if (data) {
                // console.log("Upload successful:", data);
                avatar.url = data.secure_url;
              }
            } catch (error) {
              console.error("Error uploading profile image:", error);
              return NextResponse.json({ success: false, message: "Error uploading profile image" }, { status: 500 });
            }
          }
        //check wheater user exists with same email 
        const user = await UserModel.findOne({ email,verified:true });
        if (user) {
            console.log("user already exists");
            return NextResponse.json({ success: false, message: "User Already Exists" }, { status: 400 });
        }
        else{
            //if user email is not available user is new then 
            const ExpiryDate=new Date();
            ExpiryDate.setHours(ExpiryDate.getHours()+1)


            const newUser =await UserModel.create({ Profile:avatar.url, firstName, lastName, email, Mobile_number, gender, age, date_of_birth, zip_code,
                role,verifyExpires:ExpiryDate,verifyCode,verified:false,address });
                 
                //send verification code  to user email
                const EmailResponse=await SendVerificationEmail({email,fullname,verifycode:verifyCode})
                if(!EmailResponse.success){
                    return NextResponse.json({success:false,message:EmailResponse.message||"Error while sending verification email"},{status:500})
                }
                //sucess message
                return NextResponse.json({
                    message: "User registered successfully! Please verify your code.valid for 1 hour",
                    success: true
                }, { status: 200 });
        }
    } catch (error) {
    console.log("Error:while signup user :",error);
    return NextResponse.json({success:false,message:"Something went wrong while signup"},{status:500})     
    }
}
