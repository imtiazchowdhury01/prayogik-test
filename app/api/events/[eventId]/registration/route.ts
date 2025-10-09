import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

interface RouteParams {
  params: {
    eventId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await getServerUserSession(request);
    const { eventId } = params;

    // Validate required parameters
    if (!userId || !eventId) {
      return NextResponse.json(
        { error: "Missing userId or eventId parameter" },
        { status: 400 }
      );
    }

    // Get event details
    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
      select: {
        type: true,
        price: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user is already registered for this event
    const existingRegistration = await db.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId,
        },
      },
      select: {
        isApproved: true,
      },
    });

    // Check if user has already paid for this event
    const existingPurchase = await db.purchase.findFirst({
      where: {
        studentProfile: {
          userId: userId,
        },
        eventId: eventId,
        purchaseType: "EVENT",
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    const hasPaid = !!existingPurchase;
    const isPaidEvent = event.type === "PAID" && (event.price ?? 0) > 0;
    const isRegistered = !!existingRegistration;

    // If user is not registered
    if (!existingRegistration) {
      return NextResponse.json({
        success: true,
        data: {
          isRegistered: false,
          isApproved: null,
          isPaid: false,
          canProceed: true,
          message: "এই ইভেন্টে আপনি এখনও নিবন্ধিত নন",
          registrationDetails: null,
        },
      });
    }

    // If user is registered and has paid (complete case)
    if (existingRegistration && existingPurchase) {
      return NextResponse.json({
        success: true,
        data: {
          isRegistered: true,
          isApproved: existingRegistration.isApproved,
          isPaid: true,
          canProceed: false,
          message:
            "আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং পেমেন্ট সম্পন্ন করেছেন।",
          registrationDetails: existingRegistration,
        },
      });
    }

    // User is registered, check approval status and payment
    if (existingRegistration.isApproved === false) {
      const canProceedValue = isPaidEvent ? hasPaid : false;

      return NextResponse.json({
        success: true,
        data: {
          isRegistered: true,
          isApproved: false,
          isPaid: hasPaid,
          canProceed: canProceedValue,
          message:
            "আপনার নিবন্ধন অনুমোদনের অপেক্ষায় রয়েছে। সহায়তার জন্য সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
          registrationDetails: existingRegistration,
        },
      });
    }

    if (existingRegistration.isApproved === true) {
      const canProceedValue = isPaidEvent ? !hasPaid : false;

      return NextResponse.json({
        success: true,
        data: {
          isRegistered: true,
          isApproved: true,
          isPaid: hasPaid,
          canProceed: canProceedValue,
          message: hasPaid
            ? "আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং পেমেন্ট সম্পন্ন করেছেন।"
            : "আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং অনুমোদিত হয়েছেন।",
          registrationDetails: existingRegistration,
        },
      });
    }

    // If isApproved is null/undefined (pending)
    return NextResponse.json({
      success: true,
      data: {
        isRegistered: true,
        isApproved: null,
        isPaid: hasPaid,
        canProceed: false,
        message:
          "আপনার নিবন্ধন পর্যালোচনার অধীনে রয়েছে। অনুগ্রহ করে অপেক্ষা করুন।",
        registrationDetails: existingRegistration,
      },
    });
  } catch (error) {
    console.error("Error checking event registration:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "নিবন্ধন যাচাই করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}
