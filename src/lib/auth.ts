import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",   // ← add this
  },
  callbacks: {
    session({ session, token }) {
      if (session.user) session.user.id = token.sub!;
      return session;
    },
    authorized({ auth }) {
      return !!auth;    // ← add this — required for middleware to work
    },
  },
});