import { getServerSession, NextAuthOptions } from "next-auth";
import { db } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { loginFormSchema } from "@/lib/validators/validators";

// Rate limiting dla logowania
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minut

function checkLoginRateLimit(identifier: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  if (!attempts) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  // Reset jeśli minęło więcej niż LOCKOUT_TIME
  if (now - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  // Sprawdź czy nie przekroczono limitu
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    return false;
  }

  attempts.count++;
  attempts.lastAttempt = now;
  return true;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dni
    updateAge: 24 * 60 * 60, // 24 godziny
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Przekieruj błędy na stronę logowania
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Walidacja danych wejściowych
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Brak wymaganych danych");
          }

          // Walidacja schematu
          const validationResult = loginFormSchema.safeParse({
            email: credentials.email,
            password: credentials.password,
          });

          if (!validationResult.success) {
            throw new Error("Nieprawidłowy format danych");
          }

          const { email, password } = validationResult.data;

          // Rate limiting
          if (!checkLoginRateLimit(email)) {
            throw new Error(
              "Zbyt wiele nieudanych prób logowania. Spróbuj ponownie za 15 minut."
            );
          }

          // Znajdź użytkownika
          const user = await db.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              image: true,
            },
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.password) {
            throw new Error("User has no password");
          }

          // Sprawdź hasło
          const validPassword = await bcrypt.compare(password, user.password);

          if (!validPassword) {
            throw new Error("Incorrect password");
          }

          // Reset rate limiting po udanym logowaniu
          loginAttempts.delete(email);

          // Logowanie udanego logowania
          console.log(`Successful login: ${email}`);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
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
      }

      return session;
    },
    async jwt({ token, user, account }) {
      // Przy pierwszym logowaniu
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      // Aktualizuj dane z bazy danych przy każdym żądaniu
      if (token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            taxIdNumber: true,
            address: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          token.taxIdNumber = dbUser.taxIdNumber;
          token.address = dbUser.address;
        }
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      // Sprawdź czy URL jest bezpieczny
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;

      return process.env.NODE_ENV === "development"
        ? "http://localhost:3000/"
        : "https://www.fakturly.pl/";
    },
    async signIn({ user, account, profile }) {
      // Dodatkowa walidacja dla Google OAuth
      if (account?.provider === "google") {
        // Sprawdź czy email jest zweryfikowany
        if (profile?.email_verified !== true) {
          return false;
        }
      }

      return true;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`);
    },
    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email || token?.email}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => getServerSession(authOptions);
