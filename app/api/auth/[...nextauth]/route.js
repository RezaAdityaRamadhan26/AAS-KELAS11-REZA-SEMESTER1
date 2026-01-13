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
        const startTime = Date.now();
        try {
          if (!credentials?.username || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          console.log("Starting auth for:", credentials.username);

          // Add timeout untuk getUserByUsername
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Database timeout")), 8000)
          );

          const user = await Promise.race([
            getUserByUsername(credentials.username),
            timeoutPromise,
          ]);

          if (!user) {
            console.log("User not found:", credentials.username);
            return null;
          }

          console.log("User found, comparing password...");

          // Compare password dengan timeout
          const comparePromise = bcrypt.compare(
            credentials.password,
            user.password
          );
          const compareTimeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("bcrypt timeout")), 10000)
          );

          const ok = await Promise.race([comparePromise, compareTimeout]);

          if (!ok) {
            console.log("Password mismatch for user:", credentials.username);
            return null;
          }

          const duration = Date.now() - startTime;
          console.log(
            `Auth success for: ${credentials.username} (${duration}ms)`
          );

          return {
            id: String(user.id),
            name: user.full_name,
            username: user.username,
            role: user.role,
            class_grade: user.class_grade,
          };
        } catch (error) {
          const duration = Date.now() - startTime;
          console.error(`Auth error after ${duration}ms:`, error.message);
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
