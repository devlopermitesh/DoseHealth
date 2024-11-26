import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      username?: string | null;
      email?: string | null;
      image?: string | null;
      verified?: boolean;
    };
  }

  interface User {
    _id: string;
    username?: string;
    verified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    verified?: boolean;
  }
}
