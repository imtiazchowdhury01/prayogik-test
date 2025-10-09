// api/events/[eventId]/registration/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";

// ========== TYPE DEFINITIONS ==========

interface RouteParams {
  params: {
    eventId: string;
  };
}

interface RegistrationDetails {
  isApproved: boolean | null;
}

interface RegistrationData {
  isRegistered: boolean;
  isApproved: boolean | null;
  isPaid: boolean;
  canProceed: boolean;
  message: string;
  registrationDetails: RegistrationDetails | null;
}

interface SuccessResponse {
  success: boolean;
  data: RegistrationData;
}

interface ErrorResponse {
  success?: boolean;
  error: string;
}

// ========== GET HANDLER ==========

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const { eventId } = params;

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing eventId parameter" },
        { status: 400 }
      );
    }

    const { userId } = await getServerUserSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    // Check if user is already registered
    const existingRegistration = await db.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      select: {
        isApproved: true,
      },
    });

    // Check if user has paid
    const existingPurchase = await db.purchase.findFirst({
      where: {
        studentProfile: {
          userId,
        },
        eventId,
        purchaseType: "EVENT",
        paymentStatus: "COMPLETED",
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    const hasPaid = !!existingPurchase;
    const isPaidEvent = event.type === "PAID" && (event.price ?? 0) > 0;

    // User not registered
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

    // User registered and paid
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

    // Registration not approved
    if (existingRegistration.isApproved === false) {
      return NextResponse.json({
        success: true,
        data: {
          isRegistered: true,
          isApproved: false,
          isPaid: hasPaid,
          canProceed: isPaidEvent ? hasPaid : false,
          message:
            "আপনার নিবন্ধন অনুমোদনের অপেক্ষায় রয়েছে। সহায়তার জন্য সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
          registrationDetails: existingRegistration,
        },
      });
    }

    // Registration approved
    if (existingRegistration.isApproved === true) {
      return NextResponse.json({
        success: true,
        data: {
          isRegistered: true,
          isApproved: true,
          isPaid: hasPaid,
          canProceed: isPaidEvent ? !hasPaid : false,
          message: hasPaid
            ? "আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং পেমেন্ট সম্পন্ন করেছেন।"
            : "আপনি ইতিমধ্যে এই ইভেন্টে নিবন্ধিত এবং অনুমোদিত হয়েছেন।",
          registrationDetails: existingRegistration,
        },
      });
    }

    // Registration pending (isApproved is null)
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
    console.error("[EVENT_REGISTRATION_CHECK_ERROR]", error);
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
