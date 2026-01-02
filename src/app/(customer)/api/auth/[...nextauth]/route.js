import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { User } from "@/lib/services/dataService";

export const authOptions = {
  session: {
    strategy: "jwt", // best for credentials provider
  },

  providers: [
    // GOOGLE OAUTH LOGIN
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // CREDENTIALS LOGIN (EMAIL + PASSWORD)
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("User not found");

        // Validate password
        // Note: For dummy users, the passwords in dummyData.js are hashed. 
        // We'll use compare exactly as before. 
        const validPassword = await compare(credentials.password, user.password);
        if (!validPassword) throw new Error("Invalid email or password");

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
