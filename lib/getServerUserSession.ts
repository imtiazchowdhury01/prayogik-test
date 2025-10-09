// @ts-nocheck

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

type UserSession = {
  userId: string | null;
  role: string | null;
  isAdmin: boolean | null;
  accountStatus: string | null;
};

export async function getServerUserSession(
  req?: Request
): Promise<UserSession> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return {
      userId: null,
      role: null,
      isAdmin: null,
      accountStatus: null,
      email: null,
      name: null,
      image: null,
    };
  }

  const {
    id: userId,
    role,
    isAdmin,
    accountStatus,
    email,
    name,
    image,
    phoneNumber,
  } = session.user;
  return {
    userId,
    role,
    isAdmin,
    accountStatus,
    email,
    name,
    image,
    phoneNumber,
  };
}
