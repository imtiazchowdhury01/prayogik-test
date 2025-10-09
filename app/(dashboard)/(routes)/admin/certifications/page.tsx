import { db } from "@/lib/db";
import { CertificationDataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getCategoriesDBCall } from "@/lib/data-access-layer/categories";
import { getCertificationsDBCall } from "@/lib/data-access-layer/getCertificationCourses";





export default async function CertificationsPage() {
  const [certifications, skills] = await Promise.all([
    getCertificationsDBCall(),
    getCategoriesDBCall(),
  ]);

  return (
    <CertificationDataTable
      columns={columns}
      data={certifications}
      skills={skills}
    />
  );
}
