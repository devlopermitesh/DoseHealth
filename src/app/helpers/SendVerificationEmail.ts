
import {VerficationEmailTemplate} from "../email/VerificationTempl"
import { resend } from "../lib/resent";
import { ApiResponse } from "../types/apiResponse";
export async function SendVerificationEmail({email,fullname,verifycode}:{email:string,fullname:string,verifycode:string}):Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_SENDER_Domain ||'onboarding@resend.dev',
      to: [email],
      subject: 'EverDoseHealth ! Verify Your Identity',
      react: VerficationEmailTemplate({username:fullname,otp:verifycode}),
    });
    if(error){
        return { success: false, message: "Error sending verification email" };
        }
        return { success: true, message: "Verification email sent successfully" };
  
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Error sending verification email" };
  }
}
