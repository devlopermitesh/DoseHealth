import mongoose, {ObjectId, Schema,StringSchemaDefinition,model} from "mongoose"
import { string } from "zod";

interface IAvailability {
    day: string; // Day of the week (e.g., 'Monday', 'Wednesday')
    time_slots: string[]; // Array of available time slots (e.g., ['10:00 AM - 12:00 PM', '4:00 PM - 6:00 PM'])
  }
  
export interface IDoctor extends Document {
    user_id:mongoose.Types.ObjectId; 
    specialization: string; 
    experience_years: number; 
    availability: IAvailability[];
    bio:mongoose.Types.ObjectId
  }

const DoctorSchema:Schema<IDoctor>=new Schema({
    user_id: {
     type:Schema.Types.ObjectId,
     ref:"User",
     required:true
    },
    specialization:{
        type:String,
        required:true
    },
    experience_years: { type: Number, default: 0 },
    availability: [{
        day: {
          type: String,
          required: true
        },
        time_slots: [{
          type: String,
          required: true
        }]
      }],
      bio:{
        type:Schema.Types.ObjectId,
        ref:"Bio",
        required:false
      }
    },{
        timestamps:true
    });
    const DoctorModel=(mongoose.models.Doctor as mongoose.Model<IDoctor>)||model<IDoctor>("Doctor",DoctorSchema);
    export default DoctorModel
