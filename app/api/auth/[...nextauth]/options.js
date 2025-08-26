import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { db } from "../../../../lib/db";
import { z } from "zod";
import { generateUsername } from "@/lib/utils/stringUtils";

export const authOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (profile) {
          const name = profile?.name ?? null;
          const email = profile?.email ?? null;

          if (!email) {
            throw new Error("Email is required for sign-in.");
          }

          const userFound = await db.user.findUnique({
            where: { email: email },
          });

          if (userFound) {
            // Account is active
            if (
              !userFound.accountStatus ||
              userFound.accountStatus !== "ACTIVE"
            ) {
              return "/signin?error=Account%20is%20closed%20or%20suspended.%20Please%20contact%20with%20support%20center.";
            }

            if (!userFound.emailVerified) {
              throw new Error("Email is not verified.");
            }
            return true;
          }

          let username = generateUsername(name);

          let usernameExists = await db.user.findUnique({
            where: { username },
          });

          while (usernameExists) {
            username = generateUsername(name); // Regenerate username if already taken
            usernameExists = await db.user.findUnique({
              where: { username },
            });
          }

          const newUser = await db.user.create({
            data: {
              name,
              email,
              username,
              emailVerified: true,
            },
          });

          await db.studentProfile.create({
            data: {
              userId: newUser.id,
            },
          });

          return newUser;
        }
      } catch (error) {
        console.error("An error occurred:", error);
        throw new Error(error.message || "Authentication failed.");
      }

      return true;
    },

    async session({ session, token, user }) {
      const { password, ...rest } = token?.info;

      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isAdmin = token.isAdmin;
        session.user.accountStatus = token.accountStatus;
        session.user.info = { ...rest };
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
        token.accountStatus = user.accountStatus;
      } else {
        const userFound = await db.user.findUnique({
          where: { email: token.email },
          include: {
            teacherProfile: true,
            studentProfile: {
              include: {
                subscription: {
                  select: {
                    status: true,
                    expiresAt: true,
                    subscriptionPlan: {
                      select: {
                        name: true,
                        subscriptionDiscount: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        const {
          password,
          resetToken,
          tokenUsed,
          bio,
          dateOfBirth,
          gender,
          education,
          nationality,
          phoneNumber,
          city,
          state,
          country,
          zipCode,
          facebook,
          linkedin,
          twitter,
          youtube,
          website,
          others,
          createdAt,
          updatedAt,
          emailVerified,
          emailVerificationToken,
          accountStatus,
          ...rest
        } = userFound;
        if (userFound) {
          token.id = userFound.id;
          token.role = userFound.role;
          token.isAdmin = userFound.isAdmin;
          token.accountStatus = userFound.accountStatus;
          token.info = { ...rest };
        }
      }
      return token;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstname: profile.given_name,
          lastname: profile.family_name,
          email: profile.email,
          image: profile.picture,
          emailVerified: true,
        };
      },
    }),
    CredentialsProvider({
      name: "Sign in with email and password.",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@mail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter password",
        },
      },
      authorize: async (credentials, req) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await db.user.findUnique({
            where: { email: email },
          });

          if (!user) {
            throw new Error("এই ইউজার খুঁজে পাওয়া যায়নি!");
          }

          if (!user.emailVerified) {
            throw new Error("ইমেল ভেরিফাইড হয়নি");
          }

          // Account suspanded
          if (!user.accountStatus || user.accountStatus !== "ACTIVE") {
            throw new Error(
              "অ্যাকাউন্ট বন্ধ বা সাময়িকভাবে স্থগিত করা হয়েছে। অনুগ্রহ করে সাপর্টে যোগাযোগ করুন।"
            );
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            user.password = null;
            return user;
          } else {
            throw new Error("ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।");
          }
        } else {
          throw new Error("Invalid credentials.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  debug: true,
};
