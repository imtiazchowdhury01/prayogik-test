import React from "react";
import ContactFormClient from "../contact/_components/ContactFormClient";

const ApplyForTeaching = () => {
  return (
    <div className="min-h-[70vh] app-container max-h-[auto] flex justify-center items-center py-20">
      {/* apply for teaching form*/}
      <ContactFormClient formType="teaching" />
    </div>
  );
};

export default ApplyForTeaching;
