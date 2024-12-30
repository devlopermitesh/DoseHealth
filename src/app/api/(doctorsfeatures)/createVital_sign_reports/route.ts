import { dbConnect } from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.model";
import PatientModel from "@/app/models/patient.model";
import { NextResponse } from "next/server";
import VitalSignTypes from "@/app/models/Vital_sign_types";
import VitalSignReports from "@/app/models/Vital_sign_reports";
import { Vital_sign_types } from "@/app/schemas/AddVital_signTypes.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

function getrateReportvalue(unit:string) {
    let numbers = unit.toString().match(/\d+/g);
    if (numbers && numbers.length > 0) {
        let numerator = parseInt(numbers[0]);
        let denominator = parseInt(numbers[1]); 
        return numerator / denominator;
    }
    return 0;
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        // get session for user 
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ sucess: false, message: "unauthorized" }, { status: 401 });
        }
        const userId = session.user._id;
        //find the role of user with user Id
        const User=await UserModel.findById(userId);
        if(!User){
            return NextResponse.json({ sucess: false, message: "Something went wrong" }, { status: 500 });
        }
        else if(User.role!=="Doctor"){
            return NextResponse.json({ sucess: false, message: "unauthorized ! You are not a doctor" }, { status: 401 });
        }
        const data = await request.json();
        console.log(data)
        const safeData=Vital_sign_types.safeParse(data);
        
        //create vital sign report
        if(!safeData.success){
            return NextResponse.json({ sucess: false, message: "name ,unit is not valid" }, { status: 500 });
        }
        const vitalsigntype=await VitalSignTypes.create(safeData.data);
        if(!vitalsigntype){
             console.log("report not created")
            return NextResponse.json({ sucess: false, message: "Something went wrong while creating report" }, { status: 500 });
        }
       //get report id for vitalreport
        const vitalsigntypetId=vitalsigntype._id;
        const value=getrateReportvalue(data.unit);
        //get patient id by user id
        const patientId=await PatientModel.findOne({user:data.patientId});
        if(!patientId){
            return NextResponse.json({ sucess: false, message: "Something went wrong while creating report" }, { status: 500 });
        }
        //create vital sign report
        const report=await VitalSignReports.create({patient:patientId,vitalsigntype:vitalsigntypetId,value:value});
        if(!report){
            return NextResponse.json({ sucess: false, message: "Something went wrong while creating report" }, { status: 500 });
        }
        return NextResponse.json({ sucess: true, message: "report created successfully" }, { status: 200 });
    } catch (error) {
        console.log("error in submiting report !",error)
        return Response.json({sucess:false,message:error||"error in submiting report"},{status:500})
    }
}