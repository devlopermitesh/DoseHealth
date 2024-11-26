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
enum Role {
    User = "user",        // Regular user
    Admin = "admin",      // Admin user
    Doctor = "doctor"     // Doctor user
}

// Interface defining the structure of a User document
export interface IUser extends Document {
    fullname: string;           // Full name of the user
    email: string;              // Email address of the user
    Mobile_number: number;      // Mobile number of the user (10 digits)
    password: string;           // Password of the user (hashed)
    gender: Gender;             // Gender of the user (using Gender enum)
    age: number;                // Age of the user
    date_of_birth: Date;        // Date of birth (to calculate age)
    Zipcode: number;            // Zipcode of the user's address
    role: Role;                 // Role of the user (using Role enum)
    verifyCode: string;         // Verification code sent to the user
    verified: boolean;          // Whether the user is verified (true or false)
    verifyExpires: Date;        // Date and time when the verification code expires
    address: string;            // Address of the user (text field)
}

// Schema definition for User collection
const UserSchema: Schema<IUser> = new Schema({
  fullname: {
    type: String,
    required: true  // Full name is required
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
  password: {
    type: String,
    required: [true, "Password is required"]  // Password is required field
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
  Zipcode: {
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
