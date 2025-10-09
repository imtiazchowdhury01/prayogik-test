import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { z } from "zod";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {
    async signIn({ profile }) {
      try {
        if (profile) {
          const name = profile?.name ?? null;
          const email = profile?.email ?? null;

          if (!email) {
            throw new Error("Email is required for sign-in.");
          }

          const userFound = await db.user.findUnique({
            where: { email: email },
            select: {
              id: true,
              email: true,
              accountStatus: true,
              emailVerified: true,
              password: true,
            },
          });

          if (userFound) {
            if (userFound.password) {
              const errorMessage = encodeURIComponent(
                "এই অ্যাকাউন্ট ইমেইল এবং পাসওয়ার্ড দিয়ে তৈরি করা হয়েছে। অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করুন।"
              );
              return `/signin?error=${errorMessage}`;
            }

            if (userFound.accountStatus !== "ACTIVE") {
              const errorMessage = encodeURIComponent(
                "অ্যাকাউন্ট বন্ধ বা সাময়িকভাবে স্থগিত করা হয়েছে। সাপর্টে যোগাযোগ করুন।"
              );
              return `/signin?error=${errorMessage}`;
            }

            if (!userFound.emailVerified) {
              const errorMessage = encodeURIComponent(
                "ইমেইল ভেরিফাইড হয়নি। অনুগ্রহ করে আপনার ইমেইল ভেরিফাই করুন।"
              );
              return `/signin?error=${errorMessage}`;
            }

            return true;
          } else {
            const errorMessage = encodeURIComponent(
              "অ্যাকাউন্ট পাওয়া যায়নি।"
            );
            return `/signin?error=${errorMessage}`;
          }
        }
      } catch (error: any) {
        console.error("Sign-in error:", error);
        const errorMessage = encodeURIComponent(
          error.message || "Authentication failed"
        );
        return `/signin?error=${errorMessage}`;
      }

      return true;
    },

    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.isAdmin = token.isAdmin;
        session.user.isSuperAdmin = token.isSuperAdmin;
        session.user.accountStatus = token.accountStatus;
        session.user.currentPlan = token.currentPlan;
        if (token.info) {
          session.user.info = token.info;
        }
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
        token.isSuperAdmin = user.isSuperAdmin;
        token.accountStatus = user.accountStatus;
        token.currentPlan = user.currentPlan;
      } else if (token.email) {
        const userFound = await db.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatarUrl: true,
            role: true,
            isAdmin: true,
            isSuperAdmin: true,
            accountStatus: true,
            currentPlan: true,
            referralCode: true,
            profession: true,
            teacherProfile: {
              select: {
                id: true,
                teacherStatus: true,
                totalSales: true,
                expertiseLevel: true,
                subjectSpecializations: true,
                teacherRank: {
                  select: {
                    name: true,
                    feePercentage: true,
                  },
                },
              },
            },
            studentProfile: {
              select: {
                id: true,
                subscription: {
                  select: {
                    id: true,
                    status: true,
                    expiresAt: true,
                    isTrial: true,
                    subscriptionPlan: {
                      select: {
                        name: true,
                        type: true,
                        subscriptionDiscount: {
                          select: {
                            name: true,
                            discountPercentage: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            affiliateProfile: {
              select: {
                id: true,
                affiliateStatus: true,
                totalEarnings: true,
                commissionRate: true,
              },
            },
            wallet: {
              select: {
                id: true,
                availableCredits: true,
                totalCredits: true,
              },
            },
          },
        });

        if (userFound) {
          token.id = userFound.id;
          token.role = userFound.role;
          token.isAdmin = userFound.isAdmin;
          token.isSuperAdmin = userFound.isSuperAdmin;
          token.accountStatus = userFound.accountStatus;
          token.currentPlan = userFound.currentPlan;
          token.info = userFound;
        }
      }
      return token;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: "STUDENT",
          isAdmin: false,
          isSuperAdmin: false,
          accountStatus: "ACTIVE",
          currentPlan: "NONE",
          avatarUrl: profile.picture || null,
        };
      },
    }),
    CredentialsProvider({
      name: "Sign in with email and password",
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
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Invalid credentials format");
        }

        const { email, password } = parsedCredentials.data;

        const user = await db.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            emailVerified: true,
            role: true,
            isAdmin: true,
            isSuperAdmin: true,
            accountStatus: true,
            currentPlan: true,
            avatarUrl: true,
          },
        });

        if (!user) {
          throw new Error("এই ইউজার খুঁজে পাওয়া যায়নি!");
        }

        if (!user.emailVerified) {
          throw new Error("ইমেল ভেরিফাইড হয়নি");
        }

        if (user.accountStatus !== "ACTIVE") {
          throw new Error(
            "অ্যাকাউন্ট বন্ধ বা সাময়িকভাবে স্থগিত করা হয়েছে। অনুগ্রহ করে সাপর্টে যোগাযোগ করুন।"
          );
        }

        if (!user.password) {
          throw new Error("অনুগ্রহ করে গুগল দিয়ে লগইন করুন");
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          throw new Error("ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।");
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
