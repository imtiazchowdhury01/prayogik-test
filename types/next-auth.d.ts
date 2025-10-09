import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isAdmin: boolean;
      isSuperAdmin: boolean;
      accountStatus: string;
      currentPlan: string;
      info?: any;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    accountStatus: string;
    currentPlan: string;
    avatarUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    accountStatus: string;
    currentPlan: string;
    info?: any;
  }
}
