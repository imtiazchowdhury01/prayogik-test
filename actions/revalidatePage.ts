"use server";

import { revalidatePath } from "next/cache";

type Type = "layout" | "page";

type TPaths =
  | {
      route: string;
      type?: Type;
    }[]
  | string;


/**
 * Revalidates one or more Next.js pages or layouts using `revalidatePath`.
 * 
 * This function can handle either a single path as a string or an array of objects
 * containing route information. Optionally, the revalidation type ("page" or "layout") 
 * can be specified globally or per route object.
 * 
 * @param {TPaths} paths - A single route as a string or an array of route objects.
 * If an array is passed, each object can include:
 * - `route` (string): The path to revalidate.
 * - `type` (`"layout"` | `"page"` | undefined): Optional type to specify what to revalidate.
 * 
 * @param {Type} [type] - Optional revalidation type ("layout" or "page") to apply globally 
 * if `paths` is a string. Ignored if `paths` is an array.
 * 
 * @throws Will throw an error if revalidation fails.
 * 
 * @example
 * // Revalidate a single path
 * await revalidatePage('/dashboard');
 * 
 * // Revalidate a path with a specific type
 * await revalidatePage('/dashboard', 'layout');
 * 
 * // Revalidate multiple paths
 * await revalidatePage([
 *   { route: '/home' },
 *   { route: '/about', type: 'page' },
 *   { route: '/layout', type: 'layout' }
 * ]);
 */

export async function revalidatePage(paths: TPaths, type?: Type) {
  try {
    if (typeof paths === "string") {
      revalidatePath(paths, type);
    } else {
      paths.forEach((path) => revalidatePath(path.route, path.type));
    }
  } catch (error) {
    console.error("Failed to revalidate paths:", error);
    throw new Error("Revalidation failed");
  }
}
