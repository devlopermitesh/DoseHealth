import NextAuth from "next-auth/next";
import { authOptions as Authoptions } from "./option";
const handler=NextAuth(Authoptions);
export {handler as GET, handler as POST}