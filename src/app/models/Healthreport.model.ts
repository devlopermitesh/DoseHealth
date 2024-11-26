import mongoose,{model,Schema} from "mongoose"

export interface IHealthreport extends mongoose.Document{
    patient_id:mongoose.Schema.Types.ObjectId,
    doctor_id:mongoose.Schema.Types.ObjectId,
    report_name:string,
    report_url:string,
    report_type:string,
    report_date:Date
    report_details:string
    prescription_id:mongoose.Schema.Types.ObjectId
}

const HealthreportSchema:Schema<IHealthreport>=new Schema({
    patient_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        required:true
    },
    doctor_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },
    report_name:{
        type:String,
        required:true
    },
    report_url:{
        type:String,
        required:true
    },
    report_type:{
        type:String,
        required:true
    },
    report_date:{
        type:Date,
        default:Date.now
    },
    report_details:{
        type:String,
        required:true
    },
    prescription_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Prescription",
        required:true
}

});

const HealthreportModel=(mongoose.models.Healthreport as mongoose.Model<IHealthreport>)||model<IHealthreport>("Healthreport",HealthreportSchema);
export default HealthreportModel