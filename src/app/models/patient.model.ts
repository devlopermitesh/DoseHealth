import mongoose, {Schema,model,Document,} from "mongoose"


type Medical_history_type={
chronic_diseases: string[],
past_conditions: string[],
allergies: string[],
medications: string[],
}
type Insurance_type={
    provider: string,
    policy_number: string,
    coverage: string,
    expiry_date: Date,
}
type Recent_Tests={
    test_name: string,
    test_date: Date,
    result: string,
}
type Current_health_status={
    current_medication:string[],
    recent_tests: Recent_Tests[],
    symptoms: string[],

}
export interface IPatient extends Document {
    userId:mongoose.Types.ObjectId,
    doctorId:mongoose.Types.ObjectId[],
    blood_group:string,
    height:number,
    weight:number,
    bmi: number;
    medical_history: Medical_history_type,
    insurance:Insurance_type[],
    appointments:mongoose.Types.ObjectId[],
    medical_documents:mongoose.Types.ObjectId[],
    current_health_status:Current_health_status,
    dependencys:mongoose.Types.ObjectId[],
}

const PatientSchema=new Schema<IPatient>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    doctorId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",

    }],
    blood_group:{
        type:String,
        required:false,
    },
    height: {
        type: Number,
        required: false, 
      },
      weight: {
        type: Number,
        required: false, 
      },
      bmi:{
        type:Number,
        required:false
      },
      medical_history: {
        chronic_diseases: { type: [String], default: [] },
        past_conditions: { type: [String], default: [] },
        allergies: { type: [String], default: [] },
        medications: { type: [String], default: [] },
        surgical_history: { type: [String], default: [] },
      },
      insurance: [
        {
          provider: { type: String, required: true },
          policy_number: { type: String, required: true },
          coverage: { type: String, required: true },
          expiry_date: { type: Date, required: true },
        },
      ],
      appointments:[{
        type:mongoose.Types.ObjectId,
        ref:"Appointment",
        default:[]
      }],
      medical_documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document', // Reference to Document collection (prescriptions, reports, etc.)
      }],
      current_health_status: {
        current_medications: {
          type: [String],  
          default: []
        },
        recent_tests: [{
          test_name: {
            type: String,
            required: true
          },
          test_date: {
            type: Date,
            required: true
          },
          result: {
            type: String,
            required: true
          }
        }],
        symptoms: {
          type: [String],  // This is an array of strings
          default: []
        }
      },
      dependencys:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Dependency",
            default:[]
        }
      ]

},{
    timestamps:true
})


const PatientModel = mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);

export default PatientModel;