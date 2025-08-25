import { checkCourseAccess } from "@/actions/get-course-access";
import { getCourseBySlug } from "@/actions/get-course-by-slug";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { redirect } from "next/navigation";
import CourseBreadCrumb from "../_components/CourseBreadCrumb";
import ConditionalLayout from "./_components/conditional-layout";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string; lessonSlug?: string };
}) => {
  const { slug } = params;
  const { userId } = await getServerUserSession();

  // Unauthenticated user redirect to course details page
  if (!userId) {
    return redirect(`/courses/${slug}`);
  }

  //Ensure it exists before proceeding
  const courseResponse = await getCourseBySlug(slug, userId);

  if (!courseResponse) {
    return redirect(`/courses/${slug}`);
  }

  // Check access
  const accessResponse = await checkCourseAccess(slug, userId);
  if (!accessResponse?.access) {
    return redirect(`/courses/${slug}`);
  }

  return (
    <div className="px-4 lg:p-0">
      {/* breadcrumbs */}
      <div className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-2 md:px-2 lg:px-6 xl:px-6 2xl:px-0">
          <CourseBreadCrumb title={courseResponse?.title} />
        </div>
      </div>

      <ConditionalLayout courseResponse={courseResponse} userId={userId}>
        {children}
      </ConditionalLayout>
    </div>
  );
};

export default Layout;
