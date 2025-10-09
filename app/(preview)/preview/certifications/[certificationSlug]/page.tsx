import CertificationAchivedSkills from "@/app/(site)/certifications/[certificationSlug]/_components/certification-achived-skills";
import CertificationBreadCrumb from "@/app/(site)/certifications/[certificationSlug]/_components/certification-breadcrumb";
import CertificationDescription from "@/app/(site)/certifications/[certificationSlug]/_components/certification-description";
import CertificationFAQ from "@/app/(site)/certifications/[certificationSlug]/_components/certification-faq";
import CertificationForWhom from "@/app/(site)/certifications/[certificationSlug]/_components/certification-for-whom";
import CertificationHeroSection from "@/app/(site)/certifications/[certificationSlug]/_components/certification-hero";
import CertificationHowItWorks from "@/app/(site)/certifications/[certificationSlug]/_components/certification-how-it-works";
import CertificationInfos from "@/app/(site)/certifications/[certificationSlug]/_components/certification-infos";
import CertificationInstructors from "@/app/(site)/certifications/[certificationSlug]/_components/certification-instructors";
import CertificationLearnersComments from "@/app/(site)/certifications/[certificationSlug]/_components/certification-learners-comments";
import CertificationOutcome from "@/app/(site)/certifications/[certificationSlug]/_components/certification-outcome";
import CertificationPrice from "@/app/(site)/certifications/[certificationSlug]/_components/certification-price";
import CertificationTabs from "@/app/(site)/certifications/[certificationSlug]/_components/certification-tabs";
import { getCertificationDbCallBySlug } from "@/lib/data-access-layer/getCertificationCourses";
import React from "react";

const CertificationPreviewPage = async ({
  params,
}: {
  params: { certificationSlug: string };
}) => {
  const data = await getCertificationDbCallBySlug(params?.certificationSlug);
  return (
    <section className="min-h-[70vh]">
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-6 xl:px-6 2xl:px-0">
          <CertificationBreadCrumb title={data?.title} />
        </div>
      </div>
      <CertificationHeroSection data={data} preview={true} />
      <div className="app-container space-y-16">
        <CertificationInfos data={data} />
        <CertificationTabs data={data} />
        <CertificationDescription data={data} />
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
};

export default CertificationPreviewPage;
