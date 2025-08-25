import React, { Suspense } from "react";
import VerifyEmail from "./_component/verifyEmail";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmail />
    </Suspense>
  );
};

export default Page;
