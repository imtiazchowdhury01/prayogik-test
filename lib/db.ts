import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

// Use a fallback if NODE_ENV is not defined
const env = process.env.NODE_ENV || "development";

if (env !== "production") {
  globalThis.prisma = db;
}
