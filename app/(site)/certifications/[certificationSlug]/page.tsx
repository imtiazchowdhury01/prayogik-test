import React from "react";
import CertificationHeroSection from "./_components/certification-hero";
import CertificationInfos from "./_components/certification-infos";
import CertificationTabs from "./_components/certification-tabs";
import CertificationDescription from "./_components/certification-description";
import CertificationOutcome from "./_components/certification-outcome";
import CertificationAchivedSkills from "./_components/certification-achived-skills";
import CertificationHowItWorks from "./_components/certification-how-it-works";
import CertificationForWhom from "./_components/certification-for-whom";
import CertificationInstructors from "./_components/certification-instructors";
import CertificationLearnersComments from "./_components/certification-learners-comments";
import CertificationPrice from "./_components/certification-price";
import CertificationFAQ from "./_components/certification-faq";
import CertificationBreadCrumb from "./_components/certification-breadcrumb";
import { getCertificationDbCallBySlug } from "@/lib/data-access-layer/getCertificationCourses";
import CertificationStickyHeader from "./_components/CertificationStickyHeader";

export default async function Page({
  params,
}: {
  params: { certificationSlug: string };
}) {
  const data = await getCertificationDbCallBySlug(params?.certificationSlug);
  // console.log('data result:', data);

  // console.log('data result:', data);
  return (
    <section className="min-h-[70vh]">
      {/* Add the sticky header component */}
      <CertificationStickyHeader title={data?.title} data={data} />
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
          <CertificationBreadCrumb title={data?.title} />
        </div>
      </div>
      <CertificationHeroSection data={data} />
      <div className="app-container space-y-14">
        <div className="mt-0">
          <CertificationInfos data={data} />
          <CertificationTabs data={data} />
          <CertificationDescription data={data} />
        </div>
        <CertificationOutcome data={data} />
        <CertificationAchivedSkills data={data} />
        <CertificationHowItWorks />
        <CertificationForWhom data={data} />
        <CertificationInstructors data={data} />
        <CertificationLearnersComments />
        <CertificationPrice data={data} />
        <CertificationFAQ data={data} />
      </div>
    </section>
  );
}
