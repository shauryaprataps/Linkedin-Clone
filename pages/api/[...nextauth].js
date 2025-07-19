import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: "/home",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // When a token is created (sign-in), attach the user _id or id from your database.
    async jwt({ token, user }) {
      // When the user first signs in, 'user' is available.
      if (user) {
        // Use user._id if available. (Convert to string in case it’s an ObjectId.)
        token.id = user._id ? user._id.toString() : user.id;
      }
      return token;
    },
    // Include the token.id in the session for easier access client-side.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || token.sub;
      }
      return session;
    },
  },
});
