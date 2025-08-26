// @ts-nocheck
import React from "react";
import { RegistrationForm } from "./_components/RegistrationForm";
import { WorkshopInfo } from "./_components/WorkshopInfo";
import { WorkshopBreadcrumb } from "./_components/Breadcrumb";

export default function page() {
  return (
    <div className="bg-background-gray">
      <div className="">
        <WorkshopBreadcrumb />
      </div>

      <div className="app-container">
        <main className="flex flex-wrap items-start gap-8 py-10 mx-auto my-0 max-md:gap-6 max-md:p-5 max-sm:gap-4 max-sm:p-4">
          <WorkshopInfo />
          <RegistrationForm />
        </main>
      </div>
    </div>
  );
}
