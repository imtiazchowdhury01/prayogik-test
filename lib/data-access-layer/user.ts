import { db } from "../db";

async function getUserIdbyUsernameDBCall(username: string) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) throw new Error("Failed to get user");
  return user.id;
}

export { getUserIdbyUsernameDBCall };
