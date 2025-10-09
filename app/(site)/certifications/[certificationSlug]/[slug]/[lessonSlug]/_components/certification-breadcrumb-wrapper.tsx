import CertificationBreadCrumb from "@/app/(site)/certifications/[certificationSlug]/_components/certification-breadcrumb";

async function CertificationBreadcrumbWrapper({ slug }: { slug: string }) {
  return <CertificationBreadCrumb title={slug} />;
}

export default CertificationBreadcrumbWrapper;
