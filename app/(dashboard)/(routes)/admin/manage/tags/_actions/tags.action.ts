// @ts-nocheck
"use server";

import { db } from "@/lib/db";
import { CreateTagInput } from "../_components/TagsForm";

export async function createTag(data: CreateTagInput) {
  try {
    // Check if tag already exists
    const existingTag = await db.newsletterTag.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingTag) {
      return { error: "Tag with this name already exists" };
    }

    // Create new tag
    const tag = await db.newsletterTag.create({
      data: {
        name: data.name,
      },
    });

    return { success: "Tag created successfully", tag };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { error: "Failed to create tag" };
  }
}
export async function getTags() {
  try {
    const tags = await db.newsletterTag.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            newsletterSubscribers: true,
          },
        },
      },
    });
    
    // Map the results to include the leads count
    return tags.map(tag => ({
      ...tag,
      leads: tag._count.newsletterSubscribers
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function updateTag(id: string, data: { name: string }) {
  try {
    // Check if another tag already has this name
    const existingTag = await db.newsletterTag.findFirst({
      where: {
        name: data.name,
        NOT: {
          id: id,
        },
      },
    });

    if (existingTag) {
      return { error: "Another tag with this name already exists" };
    }

    // Update the tag
    const updatedTag = await db.newsletterTag.update({
      where: { id },
      data: {
        name: data.name,
      },
    });

    return { success: "Tag updated successfully", tag: updatedTag };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { error: "Failed to update tag" };
  }
}

// needs to view leads data
export async function getLeadsWithData(tagId: string): Promise<Pick<NewsletterSubscriber, 'id' | 'email' | 'createdAt'>[]> {
  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      where: { tagId },
      select: { id: true, email: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    // console.log("Fetched subscribers:", subscribers);
    return subscribers;
  } catch (error) {
    // console.error("Error fetching subscribers:", error);
    throw new Error("Failed to fetch subscribers");
  }
}

// Enhanced deleteTag action with force delete and reassignment options
// export async function deleteTag(id: string, options?: { 
//   force?: boolean; 
//   reassignToTagId?: string 
// }) {
//   try {
//     // First check if the tag has any subscribers
//     const subscribersCount = await db.newsletterSubscriber.count({
//       where: {
//         tagId: id,
//       },
//     });

//     if (subscribersCount > 0) {
//       // If force delete is requested, set tagId to null for subscribers
//       if (options?.force) {
//         await db.newsletterSubscriber.updateMany({
//           where: {
//             tagId: id,
//           },
//           data: {
//             tagId: null,
//           },
//         });
//       }
//       // If reassignment is requested, update subscribers to new tag
//       else if (options?.reassignToTagId) {
//         await db.newsletterSubscriber.updateMany({
//           where: {
//             tagId: id,
//           },
//           data: {
//             tagId: options.reassignToTagId,
//           },
//         });

//         // Update the leads count for the target tag
//         const newSubscribersCount = await db.newsletterSubscriber.count({
//           where: {
//             tagId: options.reassignToTagId,
//           },
//         });

//         await db.newsletterTag.update({
//           where: { id: options.reassignToTagId },
//           data: { leads: newSubscribersCount },
//         });
//       }
//       // If no options provided, return error with subscriber count
//       else {
//         return { 
//           error: "Cannot delete tag with subscribers", 
//           subscribersCount 
//         };
//       }
//     }

//     // Delete the tag
//     await db.newsletterTag.delete({
//       where: { id },
//     });

//     return { success: "Tag deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting tag:", error);
//     return { error: "Failed to delete tag" };
//   }
// }
export async function deleteTag(id: string, options?: { 
  force?: boolean; 
  reassignToTagId?: string 
}) {
  try {
    // First check if the tag has any subscribers
    const subscribersCount = await db.newsletterSubscriber.count({
      where: {
        tagId: id,
      },
    });

    if (subscribersCount > 0 && !options?.force && !options?.reassignToTagId) {
      return { 
        error: "Cannot delete tag with subscribers", 
        subscribersCount 
      };
    }

    // Use transaction to ensure data consistency
    const result = await db.$transaction(async (tx) => {
      if (subscribersCount > 0) {
        // If force delete is requested, set tagId to null for subscribers
        if (options?.force) {
          await tx.newsletterSubscriber.updateMany({
            where: {
              tagId: id,
            },
            data: {
              tagId: null,
            },
          });
        }
        // If reassignment is requested, update subscribers to new tag
        else if (options?.reassignToTagId) {
          // First verify the target tag exists
          const targetTag = await tx.newsletterTag.findUnique({
            where: { id: options.reassignToTagId },
          });

          if (!targetTag) {
            throw new Error("Target tag not found");
          }

          // Update subscribers to new tag
          await tx.newsletterSubscriber.updateMany({
            where: {
              tagId: id,
            },
            data: {
              tagId: options.reassignToTagId,
            },
          });

          // Update the leads count for the target tag
          const newSubscribersCount = await tx.newsletterSubscriber.count({
            where: {
              tagId: options.reassignToTagId,
            },
          });

          await tx.newsletterTag.update({
            where: { id: options.reassignToTagId },
            data: { leads: newSubscribersCount },
          });
        }
      }

      // Delete the tag (this will be rolled back if any previous operation fails)
      await tx.newsletterTag.delete({
        where: { id },
      });

      return { success: true };
    });

    return { success: "Tag deleted successfully" };
  } catch (error) {
    console.error("Error deleting tag:", error);
    
    // Provide more specific error messages
    if (error.message === "Target tag not found") {
      return { error: "Selected target tag no longer exists" };
    }
    
    if (error.code === 'P2025') {
      return { error: "Tag not found or already deleted" };
    }

    return { error: "Failed to delete tag" };
  }
}

// New action to get all tags except the current one
export async function getAllTagsExceptCurrent(currentTagId: string) {
  try {
    const tags = await db.newsletterTag.findMany({
      where: {
        id: {
          not: currentTagId,
        },
      },
      select: {
        id: true,
        name: true,
        leads: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}