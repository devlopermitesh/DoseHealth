import { NextResponse } from "next/server";
import UserModel from "@/app/models/user.model";
import PatientModel from "@/app/models/patient.model";
import { dbConnect } from "@/app/lib/dbConnect";
import { uploadToCloudinary } from "@/app/utils/cloudinary";
import mongoose from "mongoose";
import { SendVerificationEmail } from "@/app/helpers/SendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        // Get the form data
        const formData = await req.formData();

        // Extract fields from formData 6752d4d15aebcc7c0ed42540
        let userId: mongoose.Types.ObjectId = new mongoose.Types.ObjectId(formData.get('userId')?.toString());
        const doctorId = formData.getAll('doctorId')?.toString() || [];
        const BloodGroup = formData.get('BloodGroup')?.toString();
        const Height = formData.get('Height')?.toString();
        const Weight = formData.get('Weight')?.toString();
        const civil_status = formData.get('civil_status')?.toString();
        const BMI = parseFloat(formData.get('BMI')?.toString() || "0");
        const allergies = formData.getAll('Allergies') || [];
        const chronicDiseases = formData.getAll('chronic_diseases') || [];
        const medications = formData.getAll('medications') || [];
        const pastConditions = formData.getAll('past_conditions') || [];
        const surgicalHistory = formData.getAll('surgical_history') || [];
        const provider = formData.getAll('provider') || [];
        const policy_number = formData.getAll('policy_number') || [];
        const coverage = formData.getAll('coverage') || [];
        const expiry_date = formData.getAll('expiry_date') || [];
        const symptoms = formData.getAll('symptoms') || [];
        const current_medications = formData.getAll('current_medications') || [];
        const test_name = formData.getAll('test_name') || [];
        const test_date = formData.getAll('test_date') || [];
        const test_result = formData.getAll('result') || [];
        const test_result_files = formData.getAll('test_result_files') || [];
        const note = formData.get('note') || "";
        const Dependencys = JSON.parse(formData.get('Dependencys')?.toString() || "[]");
        
        const ExpiryDate=new Date();
        ExpiryDate.setHours(ExpiryDate.getHours()+1)
        // Find user by userId
        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found. Patient must sign up first." }, { status: 404 });
        }

        // Check if user is already verified (or exists)
        if (user.verified) {
            return NextResponse.json({ error: "Patient already exists." }, { status: 400 });
        }
        // Function to upload files to Cloudinary
        const uploadFileToCloudinary = async (file: File) => {
            try {
                const data = await uploadToCloudinary(file, "patient-recent-tests");
                if (data) {
                    return data.secure_url;
                }
            } catch (error) {
                console.error("Error while uploading file to Cloudinary:", error);
                return null; // Return null if the upload fails
            }
        };

        // Prepare medical history object
        const medical_history = {
            chronic_diseases: chronicDiseases || [],
            past_conditions: pastConditions || [],
            allergies: allergies || [],
            medications: medications || [],
            surgical_history: surgicalHistory || [],
        };

        // Process insurance data
        const length = Math.max(provider.length, policy_number.length, coverage.length, expiry_date.length);
        const insurance = Array.from({ length }, (_, i) => ({
            provider: provider[i] || '',
            policy_number: policy_number[i] || '',
            coverage: coverage[i] || '',
            expiry_date: expiry_date[i] || ''
        }));

        // Process recent tests
        const test_length = Math.max(test_name.length, test_date.length, test_result.length, test_result_files.length);
        const recent_tests = await Promise.all(
            Array.from({ length: test_length }, async (_, i) => {
                console.log(test_result_files[i] instanceof File)
                const fileUpload = test_result_files[i] instanceof File ? await uploadFileToCloudinary(test_result_files[i]) : null;
                return {
                    test_name: test_name[i] || '',
                    test_date: test_date[i] || '',
                    result: test_result[i] || '',
                    file: fileUpload || ''
                };
            })
        );
        const current_health_status = {
            symptoms: symptoms || [],
            current_medications: current_medications || [],
            recent_tests: recent_tests || []
        };

        // Create patient record in the database
        const patient = await PatientModel.create({
            userId: new mongoose.Types.ObjectId(userId),
            doctorId: doctorId,
            blood_group: BloodGroup,
            civil_status,
            height: `${Height} cm`,
            weight: `${Weight} kg`,
            bmi: BMI,
            note,
            medical_history,
            insurance,
            current_health_status,
            dependencys: Dependencys,
        })
        ;
        const populatedPatient = await PatientModel.findById(patient._id)
        .populate('userId', 'Mobile_number verifyCode');  // Include 'verifyCode' along with 'Mobile_Number'
      console.log("Patient:", populatedPatient);
      console.log("Mobile_Number:", populatedPatient.userId.Mobile_number);
      console.log("VerifyCode:", populatedPatient.userId.verifyCode);//875802
      
        // // send user a verify status code
        const EmailResponse = await SendVerificationEmail({ email: user?.email, fullname: `${user.firstName} ${user.lastName}`, verifycode: populatedPatient.userId.verifyCode });
        if(!EmailResponse.success){
            return NextResponse.json({success:false,message:EmailResponse.message||"Error while sending verification email"},{status:500})
        }

        // Return success response
        return NextResponse.json({ success: true, message: "Patient created successfully.you can check your email and verify.",data:populatedPatient.userId.Mobile_number}, { status: 200 });

    } catch (error ) {
        console.error("Error while creating patient:", error);

        return NextResponse.json({ success:false,error: "Error while creating patient.",data:error}, { status: 500 });
    }
}
