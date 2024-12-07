import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/app/lib/dbConnect";
import UserModel, { IUser } from "@/app/models/user.model";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider (for Mobile number & OTP)
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        mobile: { label: "Mobile Number", type: "text", placeholder: "1234567890" },
        otp: { label: "OTP", type: "text", placeholder: "123456" },
        
      },
      async authorize(credentials): Promise<any> {
        await dbConnect();
        const { mobile,otp } = credentials || {};

        if (!mobile||!otp ) {
          throw new Error("Mobile number and OTP is required.");
        }
        console.log(mobile)

        // Verify OTP logic 
        const IsSamemobileUser = await UserModel.findOne({ Mobile_number: mobile ,verifyCode:otp}) as IUser;
        if (!IsSamemobileUser) {
          throw new Error("No user found with this mobile number");
        }
        if (!IsSamemobileUser.verified) {
          throw new Error("Please verify your account first!");
        }



        return {
          id: (IsSamemobileUser._id as string).toString(),
          username: IsSamemobileUser.firstName + ' ' + IsSamemobileUser.lastName,
          mobile: mobile,
          verified: IsSamemobileUser.verified,
        };
      },
    }),

    // Google Provider (for Google login)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token.id as string;
        session.user.username = token.username as string;
        session.user.verified = token.verified as boolean;
      }
      return session;
    },


    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.verified = user.verified;
      }
      return token;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl + "/sign-up") || url.startsWith(baseUrl + "/sign-in")) {
        return url;
      }
      return baseUrl; // Default fallback
    },
  },
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
