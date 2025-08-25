import { getServerUserSession } from "@/lib/getServerUserSession";
import { redirect } from "next/navigation";
import React from "react";

const AdminLAyout = async ({ children }: any) => {
  const session = await getServerUserSession();
  if (session?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <div className="w-full">{children}</div>;
};

export default AdminLAyout;
