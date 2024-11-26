import { Certificate } from "crypto"
import mongoose,{IsItRecordAndNotAny, Schema,model} from "mongoose"


type Educationtypes ={
    degree: string,
    institution: string,
    year_of_graduation: number,
    required:boolean

}
type Certifications={
    certification_name: string,
    institution: string,
    issue_date: Date,
    required:boolean
}
type Clinic_details={
    clinic_name: string,
    clinic_address: string,
    contact_number: string,
    email: string,
}
type Awards_Recognitions={
    award_name: string,
    year_received: number,
    description: string,
}
type Qualification_types={
    certificate_type: string,
    document_url: string, 
}

export interface IAvailability {
    weekdays: {
      day: string; 
      start_time: string; 
      end_time: string; 
    }[];
  }
  const EducationSchema = new Schema({
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year_of_graduation: { type: Number, required: true },
  });
  
  const CertificationSchema = new Schema({
    certification_name: { type: String, required: true },
    institution: { type: String, required: true },
    issue_date: { type: Date, required: true },
  });

  const ClinicDetailsSchema = new Schema({
    clinic_name: { type: String, required: true },
    clinic_address: { type: String, required: true },
    contact_number: { type: String, required: true },
    email: { type: String, required: true },
  });
    const AwardsRecognitionsSchema = new Schema({
  award_name: { type: String, required: true },
  year_received: { type: Number, required: true },
  description: { type: String, required: true },
});
 
const QualificationTypesSchema = new Schema({
    certificate_type: { type: String, required: true },
    document_url: { type: String, required: true },
  });
  const AvailabilitySchema = new Schema({
    weekdays: [
      {
        day: { type: String, required: true },
        start_time: { type: String, required: true },
        end_time: { type: String, required: true },
      },
    ],
  });
    
export interface IBio extends Document{
    doctorId:mongoose.Schema.Types.ObjectId,
    Educations:Educationtypes[],
    certifications:Certifications[],
    license_number:string,
    license_issued_by:string,
    clinic_details:Clinic_details,
    awards_recognition:Awards_Recognitions[]
    languages_spoken: string[],
    social_links:string[],
    bio:string,
    consultation_fees:number,
    profile_verified:boolean,
    proof_of_qualification:Qualification_types[]
    isavalibility:IAvailability


}
const BioSchema = new Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    educations: [EducationSchema], 
    certifications: [CertificationSchema],
    license_number: { type: String, required: true },
    license_issued_by: { type: String, required: true },
    clinic_details: ClinicDetailsSchema,
    awards_recognition: [AwardsRecognitionsSchema],
    languages_spoken: [{ type: String }], 
    social_links: [{ type: String }], 
    bio: { type: String, required: true },
    consultation_fees: { type: Number, required: true },
    profile_verified: { type: Boolean, required: true, default: false },
    proof_of_qualification: [QualificationTypesSchema],
    isavailability: AvailabilitySchema, 
  }, {
    timestamps: true, 
  });
  
  const BioModel = (mongoose.models.Bio as mongoose.Model<IBio>)||model<IBio>("Bio", BioSchema);
export default BioModel;
