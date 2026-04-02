import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "@/lib/validations/auth";
import { authenticateAdmin } from "@/lib/auth/auth.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await authenticateAdmin(
          parsed.data.email,
          parsed.data.password
        );

        if (!user) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.fullName,
          email: user.email,
          roleName: user.roleName ?? "",
          roleCode: user.roleCode ?? "",
          isActive: Boolean(user.isActive),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = typeof user.id === "string" ? user.id : String(user.id);
        token.roleName =
          typeof user.roleName === "string" ? user.roleName : "";
        token.roleCode =
          typeof user.roleCode === "string" ? user.roleCode : "";
        token.isActive =
          typeof user.isActive === "boolean" ? user.isActive : false;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.roleName =
          typeof token.roleName === "string" ? token.roleName : "";
        session.user.roleCode =
          typeof token.roleCode === "string" ? token.roleCode : "";
        session.user.isActive =
          typeof token.isActive === "boolean" ? token.isActive : false;
      }

      //console.log("Session callback:", { session, token });

      return session;
    },
  },
});