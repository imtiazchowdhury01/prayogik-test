
import CourseBreadCrumb from "../../_components/CourseBreadCrumb";
import { fetchCourseTitle } from "../_actions/fetchCourseTitle";

async function BreadcrumbWrapper({ slug }: { slug: string }) {
  // Fast query - just get course title for breadcrumb
  const courseTitle = await fetchCourseTitle(slug);
  return <CourseBreadCrumb title={courseTitle} />;
}

export default BreadcrumbWrapper;