// lib/sales.ts
import { db } from "@/lib/db";
import type { PurchaseType } from "@prisma/client";

export interface SalesData {
  date: string;
  time: string; // Add separate time field
  userName: string;
  email: string;
  itemName: string;
  type: PurchaseType;
  amount: number;
  status: string;
}

interface GetSalesDataParams {
  startDate?: Date;
  endDate?: Date;
  types?: PurchaseType[];
  limit?: number;
}

export async function getSalesData(
  params?: GetSalesDataParams
): Promise<SalesData[]> {
  const { startDate, endDate, types, limit } = params || {};

  const purchases = await db.purchase.findMany({
    where: {
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
      ...(types &&
        types.length > 0 && {
          purchaseType: {
            in: types,
          },
        }),
    },
    include: {
      studentProfile: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      course: {
        select: {
          title: true,
          prices: {
            select: {
              regularAmount: true,
              discountedAmount: true,
              isFree: true,
            },
          },
        },
      },
      certification: {
        select: {
          title: true,
          prices: {
            select: {
              regularAmount: true,
              discountedAmount: true,
              isFree: true,
            },
          },
        },
      },
      event: {
        select: {
          title: true,
          price: true,
        },
      },
      subscription: {
        select: {
          name: true,
          regularPrice: true,
          offerPrice: true,
        },
      },
      membershipPlan: {
        select: {
          title: true,
          prices: {
            select: {
              regularAmount: true,
              discountedAmount: true,
              isFree: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    ...(limit && { take: limit }),
  });

  const salesData: SalesData[] = purchases
    .map((purchase) => {
      // Determine item name and amount based on purchase type
      let itemName = "";
      let amount = 0;

      switch (purchase.purchaseType) {
        case "SINGLE_COURSE":
          itemName = purchase.course?.title || "Course";
          if (purchase.course?.prices && purchase.course.prices.length > 0) {
            const price = purchase.course.prices[0];
            amount = price.discountedAmount || price.regularAmount;
          }
          break;

        case "CERTIFICATION":
          itemName = purchase.certification?.title || "Certification";
          if (
            purchase.certification?.prices &&
            purchase.certification.prices.length > 0
          ) {
            const price = purchase.certification.prices[0];
            amount = price.discountedAmount || price.regularAmount;
          }
          break;

        case "EVENT":
          itemName = purchase.event?.title || "Event";
          amount = purchase.event?.price || 0;
          break;

        case "SUBSCRIPTION":
        case "TRIAL":
          itemName = purchase.subscription?.name || "Subscription";
          amount =
            purchase.subscription?.offerPrice ||
            purchase.subscription?.regularPrice ||
            0;
          break;

        case "MEMBERSHIP":
          itemName = purchase.membershipPlan?.title || "Membership";
          if (
            purchase.membershipPlan?.prices &&
            purchase.membershipPlan.prices.length > 0
          ) {
            const price = purchase.membershipPlan.prices[0];
            amount = price.discountedAmount || price.regularAmount;
          }
          break;

        case "OFFER":
          itemName = "Special Offer";
          break;

        default:
          itemName = purchase.purchaseType;
      }

      // Skip if amount is 0
      if (amount <= 0) {
        return null;
      }

      // Determine status based on purchase data
      let status = "COMPLETED";
      if (purchase.expiresAt && new Date(purchase.expiresAt) < new Date()) {
        status = "EXPIRED";
      }

      // Extract date and time separately
      const createdAt = purchase.createdAt || new Date();
      const date = createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
      const time = createdAt.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }); // HH:MM AM/PM

      return {
        date,
        time, // Separate time field
        userName: purchase.studentProfile.user.name,
        email: purchase.studentProfile.user.email,
        itemName,
        type: purchase.purchaseType,
        amount,
        status,
      };
    })
    .filter((sale): sale is SalesData => sale !== null);

  return salesData;
}
