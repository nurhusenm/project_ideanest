import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Use the user argument if available
      if (user) {
        const sessionUser = await User.findOne({ email: user.email });
        session.user.id = sessionUser._id.toString();
        return session;
      }

      // Handle cases where user might not be present in the initial session
      console.log(
        "User not found in initial session. Attempting database lookup..."
      );
      try {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email }); // Use email from session
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          return session;
        }
      } catch (error) {
        console.error("Error fetching user from database:", error);
      }

      // If user not found in session or database, return default session (optional)
      // return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const newUser = await User.create({
            email: profile.email,
            username: profile.name.replace(/\s/g, "").toLowerCase(),
            image: profile.picture,
          });
          return {
            redirect: false, // Prevent redirection after user creation
            user: newUser, // Return the newly created user for session
          };
        }

        return true; // User already exists, allow sign-in
      } catch (error) {
        console.error("Error signing in:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
