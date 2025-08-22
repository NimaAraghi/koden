import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole } from "./drizzle/schema";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    username: string;
  }
}
