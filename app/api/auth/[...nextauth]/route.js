// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByUsername } from "@/lib/actions";

const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) return null;

          const user = await getUserByUsername(credentials.username);
          if (!user) return null;

          // Compare password dengan hash menggunakan bcrypt
          const ok = await bcrypt.compare(credentials.password, user.password);

          if (!ok) return null;

          return {
            id: String(user.id),
            name: user.full_name,
            username: user.username,
            role: user.role,
            class_grade: user.class_grade,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.class_grade = user.class_grade;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.username = token.username;
      session.user.name = token.name || session.user.name;
      session.user.class_grade = token.class_grade;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(options);
export { handler as GET, handler as POST };
