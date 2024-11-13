import { getServerSession, NextAuthOptions } from "next-auth";
import { db } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("User has no password");

        const validPassword = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!validPassword) throw new Error("Incorrect password");

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.address = token.address;
        session.user.taxIdNumber = token.taxIdNumber;
        session.user.notifications = token.notifications;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        taxIdNumber: dbUser.taxIdNumber,
        address: dbUser.address,
        notifications: dbUser.notifications,
      };
    },
    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
