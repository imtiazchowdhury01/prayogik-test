// @ts-nocheck

import { createUploadthing, type FileRouter } from "uploadthing/next";

import { getServerUserSession } from "@/lib/getServerUserSession";
import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = async (req: Request) => {
  const { userId } = await getServerUserSession(req);

  const isAuthorized = await isTeacher(userId);

  if (!isAuthorized) throw new Error("Unauthorized");

  return { userId };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async (req) => handleAuth(req))
    .onUploadComplete(() => {}),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async (req) => handleAuth(req))
    .onUploadComplete(() => {}),

  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(async (req) => handleAuth(req))
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
