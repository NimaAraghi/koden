import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./drizzle/db";
import authConfig from "@/auth.config";
import { getUserById } from "./features/users/db/users";
import { AccountTable, UserTable } from "./drizzle/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (!token.sub) return token;

      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.role) token.role = session.role;
        if (session.image) token.image = session.image;
      }

      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.role = existingUser.role;
        token.username = existingUser.username;
        token.image = existingUser.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: UserTable,
    accountsTable: AccountTable,
  }),
  session: { strategy: "jwt" },
  ...authConfig,
});
