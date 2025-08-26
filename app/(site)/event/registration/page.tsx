import React from "react";
import { RegistrationForm } from "./_components/RegistrationForm";
import { EventInfo } from "./_components/EventInfo";
import { EventBreadcrumb } from "./_components/EventBreadcrumb";

export default function page() {
  return (
    <div className="bg-background-gray">
      <div className="">
        <EventBreadcrumb />
      </div>

      <div className="app-container">
        <main className="flex flex-wrap items-start gap-8 py-10 mx-auto my-0 max-md:gap-6 max-md:p-5 max-sm:gap-4 max-sm:p-4">
          <EventInfo />
          <RegistrationForm />
        </main>
      </div>
    </div>
  );
}
