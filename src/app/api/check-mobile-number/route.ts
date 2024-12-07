import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import  * as z from "zod";
import { phoneNumber } from "@/app/schemas/login.schemas";
import { SendVerificationEmail } from "@/app/helpers/SendVerificationEmail";

const checkMobileNumberSchema = z.object({
    Mobile_number: phoneNumber
    
})
export async function POST(req: Request) {
    await dbConnect();
    const verifyCode=Math.floor(100000 + Math.random() * 900000).toString();
    const ExpiryDate=new Date();
    ExpiryDate.setHours(ExpiryDate.getHours()+1)
    try {
        const {phoneNumber:Mobile_number} = await req.json();
        //validate with zod
const result=checkMobileNumberSchema.safeParse({Mobile_number});        
        if(!result.success){
            const error=result.error.format().Mobile_number?._errors||[];
            return Response.json({success:false,message:error?.length>0?error[0]:"Invalid mobile number"},{status:400})
        }
        const data=result.data;
        const user=await UserModel.findOne({Mobile_number , verified:true});
        if(!user){
            return Response.json({sucess:false,message:"Mobile number is not registered or not verified"},{status:400})
        }
        user.verifyCode=verifyCode;
        user.verifyExpires=ExpiryDate
        await user.save();
        //send otp to email
        const response=await SendVerificationEmail({email:user.email,fullname:user.firstName+" "+user.lastName,verifycode:verifyCode})
        if(!response.success){
            return Response.json({success:false,message:response.message||"Error while sending login otpcode to email"},{status:500})
        }
        return Response.json({sucess:true,message:"Mobile number is registered  Please verify with  your code.valid In 1 hour"},{status:200})

    } catch (error) {
        console.log("error while checking mobile number",error)
return Response.json({sucess:false,message:"error while checking mobile number"},{status:500})
    }

}