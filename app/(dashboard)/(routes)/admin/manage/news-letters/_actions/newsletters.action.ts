// @ts-nocheck
"use server";

import { db } from "@/lib/db";
// Types
interface CreateSubscriberInput {
  email: string;
  tagId: string;
}

interface UpdateSubscriberInput {
  email?: string;
  tagId?: string;
}

// Get all Newsletter subscribers
export async function getAllNewsLetterSubscribers() {
  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tag: true,
      },
    });
    return subscribers;
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
}
// Get single Newsletter subscriber by ID
export async function getNewsLetterSubscriberById(id: string) {
  try {
    const subscriber = await db.newsletterSubscriber.findUnique({
      where: { id },
      include: {
        tag: true,
      },
    });
    return subscriber;
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    return null;
  }
}

// Delete Newsletter subscriber
export async function deleteNewsLetterSubscriber(id: string ) {
  try {
    // console.log('newsletterSubscriber id result:', id);
    await db.newsletterSubscriber.delete({
      where: { id },
    });
    return { success: "Subscriber deleted Successfully" };
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return { error: "Failed to delete subscriber" };
  }
}
// update Newsletter subscriber
export async function updateNewsLetterSubscriber(
  id: string,
  data: {
    email: string;
    tagId?: string | null;
  }
) {
  try {
    // Start a transaction to handle tag count updates
    const result = await db.$transaction(async (tx) => {
      // Get the current subscriber to check if tag is changing
      const currentSubscriber = await tx.newsletterSubscriber.findUnique({
        where: { id },
        select: { tagId: true },
      });

      if (!currentSubscriber) {
        throw new Error("Subscriber not found");
      }

      const oldTagId = currentSubscriber.tagId;
      const newTagId = data.tagId;

      // Update the subscriber
      const updatedSubscriber = await tx.newsletterSubscriber.update({
        where: { id },
        data: {
          email: data.email,
          tagId: newTagId,
        },
        include: {
          tag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Update tag counts if tag changed
      if (oldTagId !== newTagId) {
        // Decrease count for old tag (if it had one)
        if (oldTagId) {
          const oldTagCount = await tx.newsletterSubscriber.count({
            where: { tagId: oldTagId },
          });
          
          await tx.newsletterTag.update({
            where: { id: oldTagId },
            data: { leads: oldTagCount },
          });
        }

        // Increase count for new tag (if assigning one)
        if (newTagId) {
          const newTagCount = await tx.newsletterSubscriber.count({
            where: { tagId: newTagId },
          });
          
          await tx.newsletterTag.update({
            where: { id: newTagId },
            data: { leads: newTagCount },
          });
        }
      }

      return updatedSubscriber;
    });

    return { success: "Newsletter Subscriber updated successfully", data: result };
  } catch (error) {
    console.error("Error updating newsletter subscriber:", error);
    
    if (error.code === 'P2002') {
      return { error: "Email address already exists" };
    }
    
    if (error.message === "Subscriber not found") {
      return { error: "Newsletter Subscriber not found" };
    }

    return { error: "Failed to update Newsletter subscriber" };
  }
}

// Multi-select update Newsletter subscriber tags
export async function bulkUpdateNewsletterTags(subscriberIds: string[], newTagName: string | null) {
  try {
    const result = await db.$transaction(async (tx) => {
      let newTagId: string | null = null;
      
      // Only try to find tag if newTagName is a non-null string
      if (newTagName !== null && newTagName !== "Unassigned") {
        const newTag = await tx.newsletterTag.findUnique({
          where: { name: newTagName },
        });

        if (!newTag) {
          throw new Error("Tag not found");
        }
        newTagId = newTag.id;
      }
      // If newTagName is null or "Unassigned", newTagId remains null

      // Get all subscribers being updated with their current tags
      const subscribers = await tx.newsletterSubscriber.findMany({
        where: {
          id: {
            in: subscriberIds
          }
        },
        select: {
          id: true,
          tagId: true
        }
      });

      // Collect all affected tag IDs (old tags)
      const oldTagIds = subscribers
        .map(sub => sub.tagId)
        .filter(Boolean) as string[]; // Remove nulls and type cast

      // Update all subscribers to the new tag (or null if unassigning)
      await tx.newsletterSubscriber.updateMany({
        where: {
          id: {
            in: subscriberIds
          }
        },
        data: {
          tagId: newTagId // This will be null if unassigning
        }
      });

      // Update counts for all affected tags (both old and new)
      const tagsToUpdate = [...new Set([
        ...oldTagIds,
        ...(newTagId ? [newTagId] : []) // Only include newTagId if it exists
      ])];
      
      for (const tagId of tagsToUpdate) {
        const count = await tx.newsletterSubscriber.count({
          where: { tagId }
        });
        
        await tx.newsletterTag.update({
          where: { id: tagId },
          data: { leads: count }
        });
      }

      return { count: subscribers.length };
    });

    return result;
  } catch (error) {
    console.error("Error updating newsletter tags:", error);
    
    if (error.message === "Tag not found") {
      throw new Error("The specified tag was not found");
    }
    
    throw new Error("Failed to update newsletter tags");
  }
}