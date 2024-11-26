import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { NextResponse } from "next/server";
import {IUser,Role} from "@/app/models/user.model"
import { SendVerificationEmail } from "@/app/helpers/SendVerificationEmail";
export async function POST(request: Request) {
    await dbConnect();
    try {  
        const { Profile, firstName, lastName, email, Mobile_number, gender, age, date_of_birth, zip_code,role }:IUser= await request.json() ;
        const fullname = `${firstName} ${lastName}`;
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
         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


            const newUser =await UserModel.create({ Profile, firstName, lastName, email, Mobile_number, gender, age, date_of_birth, zip_code,
                role: role as Role,verifyExpires:ExpiryDate,verifyCode,verified:false });
                 
                //send verification code  to user email
                const EmailResponse=await SendVerificationEmail({email,fullname,verifycode:verifyCode})
                if(!EmailResponse.success){
                    return NextResponse.json({success:false,message:EmailResponse.message||"Error while sending verification email"},{status:500})
                }
                //sucess message
                return NextResponse.json({
                    message: "User registered successfully! Please verify your code.",
                    success: true
                }, { status: 200 });
        }
    } catch (error) {
    console.log("Error:while signup user :",error);
    return NextResponse.json({success:false,message:"Something went wrong while signup"},{status:500})     
    }
}
