import axios from "axios";
import { toast } from "react-hot-toast";
import { revalidatePage } from "@/actions/revalidatePage";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UpdateCourseOptions {
  courseId: string;
  values: any;
  toggleEdit?: () => void;
  setLoading: (loading: boolean) => void;
  router: AppRouterInstance;
  successMessage?: string;
  api?: string;
}


/**
 * Updates a course by sending a PATCH request to the specified API route.
 * 
 * This function handles loading state, error and success toasts, optional UI toggling,
 * route revalidation, and router refreshing after a successful update.
 * 
 * @param {UpdateCourseOptions} options - The options for updating the course.
 * @param {string} options.courseId - The ID of the course to update.
 * @param {any} options.values - The values to update in the course.
 * @param {() => void} [options.toggleEdit] - Optional function to toggle edit mode after update.
 * @param {(loading: boolean) => void} options.setLoading - Function to toggle loading state.
 * @param {AppRouterInstance} options.router - Next.js router instance used to refresh the route.
 * @param {string} [options.successMessage] - Optional success message to show in toast.
 * @param {string} [options.api] - Optional custom API endpoint for the update.
 * 
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 * 
 * @example
 * await updateCourse({
 *   courseId: "123",
 *   values: { title: "Updated Title" },
 *   setLoading: setLoadingFn,
 *   router: useRouter(),
 *   toggleEdit: () => setEditing(false),
 *   successMessage: "Course saved successfully!"
 * });
 */

export const updateCourse = async ({
  courseId,
  values,
  toggleEdit,
  setLoading,
  router,
  successMessage,
  api,
}: UpdateCourseOptions) => {
  const apiRoute = api || `/api/courses/${courseId}`;
  setLoading(true);
  try {
    await axios.patch(apiRoute, values);
    toast.success(successMessage || "Course updated");
    await revalidatePage([
      { route: '/(site)', type: "layout" },
      { route: "/courses", type: "layout" },
    ]);
    if (toggleEdit) {
      toggleEdit();
    }
    router.refresh();
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
