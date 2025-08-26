import React from "react";
import { BootcampInfo } from "./_components/BootcampInfo";
import { RegistrationForm } from "./_components/RegistrationForm";
import { BootcampBreadcrumb } from "./_components/BootcampBreadcrumb";

export default function page() {
  return (
    <div className="bg-background-gray">
      <div className="">
        <BootcampBreadcrumb />
      </div>

      <div className="app-container">
        <main className="flex flex-wrap items-start gap-8 py-10 mx-auto my-0 max-md:gap-6 max-md:p-5 max-sm:gap-4 max-sm:p-4">
          <BootcampInfo />
          <RegistrationForm />
        </main>
      </div>
    </div>
  );
}
