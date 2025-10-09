"use server";
import { db } from "../db";

async function getPurchaseHistoryByIdDBCall(refereeUserId: string) {
  try {
    // First get the student profile for this user
    const studentProfile = await db.studentProfile.findUnique({
      where: {
        userId: refereeUserId,
      },
    });

    if (!studentProfile) {
      return [];
    }

    // Fetch all purchases for this student
    const purchases = await db.purchase.findMany({
      where: {
        studentProfileId: studentProfile.id,
      },
      include: {
        subscription: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const result = [];

    // Find trial purchase (if any)
    const trialPurchase = purchases.find(
      (p) => p.purchaseType === "TRIAL" || p.subscription?.isTrial === true
    );

    if (trialPurchase) {
      result.push({
        id: trialPurchase.id,
        purchaseType: trialPurchase.purchaseType,
        paymentStatus: trialPurchase.paymentStatus,
        createdAt:
          trialPurchase.createdAt?.toISOString() || new Date().toISOString(),
        subscriptionName: trialPurchase.subscription?.name,
      });

      // Find first plan upgrade purchase after trial
      const trialDate = trialPurchase.createdAt!;
      const upgradePurchase = purchases.find(
        (p: any) => p.createdAt > trialDate && p.purchaseType === "SUBSCRIPTION"
      );

      if (upgradePurchase) {
        result.push({
          id: upgradePurchase.id,
          purchaseType: upgradePurchase.purchaseType,
          paymentStatus: upgradePurchase.paymentStatus,
          createdAt:
            upgradePurchase.createdAt?.toISOString() ||
            new Date().toISOString(),
          subscriptionName: upgradePurchase.subscription?.name,
        });
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    return [];
  }
}

export { getPurchaseHistoryByIdDBCall };
