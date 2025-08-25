import { Metadata } from "next";
import OpenApiDocsClient from "./_component/open-api-docs-client";
import { getServerUserSession } from "@/lib/getServerUserSession";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function Page() {
  const {isAdmin} = await getServerUserSession()

  if(!isAdmin) return
  return <OpenApiDocsClient />;
}
