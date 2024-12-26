import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import DoctorModel from "@/app/models/doctor.model";
import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/app/utils/cloudinary";
import mongoose from "mongoose";
import BioModel, { Educationtypes } from "@/app/models/doctorsbio.model";
import { SendVerificationEmail } from "@/app/helpers/SendVerificationEmail";
interface Availability {
  day: string;
  time_slots: string[];
}
interface UserId {
  Mobile_number: string;
  verifyCode: string;
}
interface EducationEntry {
  degree: string | null;
  institution: string | null;
  year_of_graduation: string | null;
  degree_file: string | null;
}

function convertIntoArray(availableString: string): Availability[] {
  try {
    return JSON.parse(availableString) as Availability[];
  } catch (error) {
    console.error("Error parsing availability string:", error);
    return [];
  }
}

const uploadFileToCloudinary = async (file: File, FolderName: string) => {
  try {
    const data = await uploadToCloudinary(file, FolderName);
    return data ? data.secure_url : null;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

async function processEducation(
  degrees: FormDataEntryValue[],
  institutions: FormDataEntryValue[],
  years: FormDataEntryValue[],
  files: FormDataEntryValue[] | File[]
): Promise<EducationEntry[]> {
  const maxLength = Math.max(degrees.length, institutions.length, years.length, files.length);
  return Promise.all(
    Array.from({ length: maxLength }).map(async (_, index) => {
      const degree = degrees[index] instanceof File ? await degrees[index].text() : (degrees[index] as string | null);
      const institution =
        institutions[index] instanceof File ? await institutions[index].text() : (institutions[index] as string | null);
      const year_of_graduation =
        years[index] instanceof File ? await years[index].text() : (years[index] as string | null);
      const degree_file =
        files[index] instanceof File ? await uploadFileToCloudinary(files[index] as File, "education-proofs") : null;

      if (!degree?.trim() && !institution?.trim() && !year_of_graduation?.trim() && !degree_file) {
        return null;
      }

      const normalizedYear = year_of_graduation?.match(/^\d{4}$/) ? year_of_graduation : null;
      return {
        degree: degree?.trim() || '',
        institution: institution?.trim() || undefined,
        year_of_graduation: normalizedYear || undefined,
        degree_file: degree_file || null,
      };
    })
  ).then(results => results.filter(entry => entry !== null) as EducationEntry[]);
}

export async function POST(req: Request) {
  await dbConnect();

  try {
      const formData = await req.formData();
      console.log(formData)
   const userId = new mongoose.Types.ObjectId(formData.get("userId")?.toString());
  //  console.log("userId:", userId);
   const specialization = formData.get("specialization")?.toString();
   const experience_years = formData.get("experience_years");
   const availabilityValue = formData.get("availability");
   const availability = availabilityValue ? convertIntoArray(availabilityValue.toString()) : [];
   const bio = formData.get("bio")?.toString();
   const degrees =  formData.getAll("degree") ||[];
   const institutions =formData.getAll("degree_institution") || [];
   const year_of_graduation =formData.getAll("year_of_graduation") || []
   const degrees_files =formData.getAll("degrees_files") || []
   const certification_names = formData.getAll("certification_name")  || []
   const institutions_certification =formData.getAll("institution") || [];
   const issue_dates = formData.getAll("issue_date") || [];
   const certifications_files =formData.getAll("certification_files") || [];
   const licence_number = formData.get("licence_number")?.toString();
   const license_issued_by = formData.get("licence_issued_by")?.toString();
   const license_type = formData.get("license_type")?.toString();
   const license_proofValue = formData.get("licence_proof");
   const clinic_name = formData.get("clinic_name")?.toString();
   const clinic_address = formData.get("clinic_address")?.toString();
   const clinic_contact_number = formData.get("contact_number")?.toString();
   const clinic_email = formData.get("email")?.toString();
   const awards_recognitionValue = formData.get("awards_recognition") || [];
   const awards_recognition = awards_recognitionValue ? convertIntoArray(awards_recognitionValue.toString()) : [];
   const languages_spoken = formData.getAll("languages_spoken") || [];
   const social_links = formData.getAll("social_links") || [];
   const consultation_fees = formData.get("consultation_fees");
   const consultation_currency = formData.get("consultation_currency");
   const ExpiryDate=new Date();
   ExpiryDate.setHours(ExpiryDate.getHours()+1)
  

// Log all variables individually (optional)
console.log("userId:", userId);
console.log("specialization:", specialization);
console.log("experience_years:", experience_years);
console.log("availability:", availability);
console.log("bio:", bio);
console.log("degrees:", degrees);
console.log("institutions:", institutions);
console.log("year_of_graduation:", year_of_graduation);
console.log("degrees_files:", degrees_files);
console.log("certification_names:", certification_names);
console.log("institutions_certification:", institutions_certification);
console.log("issue_dates:", issue_dates);
console.log("certifications_files:", certifications_files);
console.log("licence_number:", licence_number);
console.log("license_issued_by:", license_issued_by);
console.log("license_type:", license_type);
console.log("license_proofValue:", license_proofValue);
console.log("clinic_name:", clinic_name);
console.log("clinic_address:", clinic_address);
console.log("clinic_contact_number:", clinic_contact_number);
console.log("clinic_email:", clinic_email);
console.log("awards_recognition:", awards_recognition);
console.log("languages_spoken:", languages_spoken);
console.log("social_links:", social_links);
console.log("consultation_fees:", consultation_fees);
console.log("consultation_currency:", consultation_currency);



const user = await UserModel.findOneAndUpdate(
  { _id: userId, verified: false },
  { $set: { verifyExpires: ExpiryDate } }, 
  { new: true } 
);


if (!user) {
  return NextResponse.json({ error: "User not found or already verified." }, { status: 400 });
}
    const license_proof = license_proofValue ? await uploadFileToCloudinary(license_proofValue as File, "doctors-license") : null;

    // Process Education & Certifications
    const education = await processEducation(degrees, institutions, year_of_graduation, degrees_files);

    const certification_length = Math.max(certification_names.length, institutions_certification.length, issue_dates.length, certifications_files.length);

    const certifications = await Promise.all(
      Array.from({ length: certification_length }, async (_, index) => {
        const certificationFile = certifications_files[index] instanceof File ? await uploadFileToCloudinary(certifications_files[index] as File, "doctors-certifications-proofs") : null;
        return {
          certification_name: certification_names[index],
          institution: institutions_certification[index],
          issue_date: issue_dates[index],
          certificate_file: certificationFile,
        };
      })
    );

    // Create Doctor
    const doctor = await DoctorModel.create({
      user_id: userId,
      specialization,
      experience_years,
      availability,
      bio: null,
    });

    if (!doctor) {
      return NextResponse.json({ error: "Error while creating doctor." }, { status: 400 });
    }

    // Create Bio
    const DoctorBio = await BioModel.create({
      doctorId: doctor._id,
      educations: education,
      certifications: certifications,
      license_number: licence_number,
      license_issued_by: license_issued_by,
      license_type: license_type,
      license_proof: license_proof,
      clinic_details: {
        clinic_name,
        clinic_address,
        contact_number: clinic_contact_number,
        email: clinic_email,
      },
      awards_recognition,
      languages_spoken,
      social_links,
      bio,
      consultation_fees,
      consultation_currency,
      profile_verified: false,
    });

    if (!DoctorBio) {
      return NextResponse.json({ error: "Error while creating doctor bio." }, { status: 400 });
    }

    // Update Doctor with Bio
    const updatedDoctor = await DoctorModel.findByIdAndUpdate(doctor._id, { bio: DoctorBio._id }, { new: true });
    if (!updatedDoctor) {
      return NextResponse.json({ error: "Error while updating doctor." }, { status: 400 });
    }

    // Populate doctor data with user details (Mobile number & VerifyCode)
    await updatedDoctor.populate("user_id", "Mobile_number verifyCode");
console.log('Mobile_number' in updatedDoctor.user_id)
    if ('Mobile_number' in updatedDoctor.user_id && 'verifyCode' in updatedDoctor.user_id) {
        // // Send verification email
    const emailResponse = await SendVerificationEmail({
      email: user.email,
      fullname: `${user.firstName} ${user.lastName}`,
      verifycode:(updatedDoctor.user_id as UserId).verifyCode,
    });

    if (!emailResponse.success) {
      return NextResponse.json({
        success: false,
        message: emailResponse.message || "Error while sending verification email.",
      }, { status: 500 });
    }
      return NextResponse.json({
        success: true,
        message: "Doctor created successfully.",
        data: {
          Mobile_number: (updatedDoctor.user_id as UserId).Mobile_number
        },
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message:"Error while sending verification email.something went wronng",
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error while creating doctor:", error);
    return NextResponse.json({ success: false, error: "Error while creating doctor.", data: error }, { status: 500 });
  }
}
