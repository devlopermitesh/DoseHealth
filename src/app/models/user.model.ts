// Importing necessary modules
import mongoose, { Schema, model, Document } from "mongoose"; // Mongoose-related imports

// Enum to define allowed genders
enum Gender {
    Male = 'male',        // Male gender
    Female = 'female',    // Female gender
    Other = 'other',      // Other gender (for users who do not fall under Male/Female categories)
    NotSpecified = 'not_specified', // When gender is not specified
}

// Enum to define user roles
export enum Role {
    Patient = "patient",  // Patient user
    Admin = "admin",      // Admin user
    Doctor = "doctor"     // Doctor user
}

// Interface defining the structure of a User document
export interface IUser extends Document {
    Profile: string;            // Profile image of the user
    firstName: string;           // First name of the user
    lastName: string;           // last name of the user
    email: string;              // Email address of the user
    Mobile_number: number;      // Mobile number of the user (10 digits)
    gender: Gender;             // Gender of the user (using Gender enum)
    age: number;                // Age of the user
    date_of_birth: Date;        // Date of birth (to calculate age)
    zip_code: number;            // Zipcode of the user's address
    role: Role;                 // Role of the user (using Role enum)
    verifyCode: string;         // Verification code sent to the user
    verified: boolean;          // Whether the user is verified (true or false)
    verifyExpires: Date;        // Date and time when the verification code expires
    address: string;            // Address of the user (text field)
}
// Schema definition for User collection
const UserSchema: Schema<IUser> = new Schema({
  Profile: {
    type:String,
    required:false,
    default:""
  },
  firstName: {
    type: String,
    required: true  
  },
  lastName: {
    type: String,
    required: true  
  },
  email: {
    type: String,
    match: [
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
        "Please enter a valid email address"  // Regular expression for validating email format
    ],
    required: [true, "Email is required"]  // Email is required field
  },
  Mobile_number: {
    type: Number,
    required: [true, "Mobile number is required"],
    match: [/^[0-9]{10}$/, "Please enter a valid mobile number"] // Validates a 10-digit mobile number
  },
  gender: {
    type: String,
    enum: Object.values(Gender),
    required: [true, "Gender is required"]  // Gender is required field
  },
  age: {
    type: Number,
    required: true  // Age is required field
  },
  date_of_birth: {
    type: Date,
    required: [true, "Date of birth is required"]  // Date of birth is required field
  },
  zip_code: {
    type: Number,
    required: [true, "Zipcode is required"]  // Zipcode is required field
  },
  role: {
    type: String,
    enum: Object.values(Role),
    required: [true, "Role is required"]  // Role is required field (user, doctor, admin)
  },
  verifyCode: {
    type: String,
    required: [true, "Verification code is required"]  // Verification code is required for user registration
  },
  verified: {
    type: Boolean,
    default: false  // By default, the user is not verified
  },
  verifyExpires: {
    type: Date,
    required: [true, "Verification expiration date is required"]  // Date when the verification code expires
  },
  address: {
    type: String, 
    required: true  // Address is required
  }
},{
    timestamps:true
});

// Create the User model (or reuse it if already exists)
const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

// Export the model so it can be used elsewhere in the application
export default UserModel;
