import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import { phoneNumber } from "@/app/schemas/login.schemas";
import z from "zod";
const verifyvalidationSchema=z.object({Mobile_number:phoneNumber,verifycode:z.string().min(6, "Code should be at least 6 characters").max(6, "Code should be at most 6 characters")})
export async function POST(req: Request) {
    await dbConnect();
    try {
        const { Mobile_number,verifycode } = await req.json();
        if(!Mobile_number || !verifycode){
            return Response.json({sucess:false,message:"Mobile number and verify code are required"},{status:400})
        }
        //validate with zod
        const result = verifyvalidationSchema.safeParse({ Mobile_number,verifycode });
        if(!result.success){
            const error = result.error.format().Mobile_number?._errors || [];
            // console.log(Mobile_number,verifycode)
         return Response.json({sucess:false,message:error?.length>0?error[0]:"Invalid mobile number"},{status:400})   
        }
        const user=await UserModel.findOne({Mobile_number});
        if(!user){
            console.log("user not found")
            return Response.json({sucess:false,message:"user not found"},{status:400})
        }
        const IsCodeValid=user.verifyCode===verifycode;
        const IsCodeExpired=new Date( user.verifyExpires)>new Date();
        if(IsCodeValid && IsCodeExpired){
            user.verified=true;
            await user.save();
            return Response.json({sucess:true,message:"user verified successfully"},{status:200})
        }
        else if(IsCodeValid && !IsCodeExpired){
            return Response.json({sucess:false,message:"verify Code is expired,please try again to get new code"},{status:400})
        }
        else{
            return Response.json({sucess:false,message:"Invalid verify code"},{status:400})
        }
    } catch (error) {
        console.log("error while verifying code with mobile number",error)
        return Response.json({sucess:false,message:"error while verifying code with mobile number"},{status:500})
    }
}