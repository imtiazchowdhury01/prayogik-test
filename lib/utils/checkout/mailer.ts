
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { sendUserNotification } from "@/lib/utils/emailTemplates/sendUserNotification";
import { sendAdminNotification } from "@/lib/utils/emailTemplates/sendAdminNotification";
import preparePurchaseDetails from "@/lib/utils/preparePurchaseDetails";
import { PurchaseType } from "@prisma/client";

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_APP_PASS,
    },
  });
};

// Helper function to get BCC recipients (CEO and Manager)
function getBccRecipients(): string {
  const bccRecipients = [
    process.env.CEO_RECIPIENT_EMAIL,
    process.env.MANAGER_RECIPIENT_EMAIL,
    process.env.MARKETING_RECIPIENT_EMAIL1,
    process.env.MARKETING_RECIPIENT_EMAIL2,
  ].filter(Boolean); // Remove any undefined/null values

  return bccRecipients.join(", ");
}

// Helper function to determine admin email subject
function getAdminEmailSubject(
  purchaseDetailsForEmail: any,
  isEventRegistration: boolean
): string {
  if (isEventRegistration) {
    const isFreeEvent =
      purchaseDetailsForEmail?.eventPrice === null ||
      purchaseDetailsForEmail?.eventPrice === 0;
    const isEOIEvent = purchaseDetailsForEmail?.eventType === "EOI";

    if (isFreeEvent || isEOIEvent) {
      return "প্রায়োগিক - ইভেন্ট রেজিস্ট্রেশন নোটিফিকেশন";
    }
    return "প্রায়োগিক - ইভেন্ট রেজিস্ট্রেশন এবং পেমেন্ট নোটিফিকেশন";
  }

  if (purchaseDetailsForEmail?.courseName) {
    const isFreeCourse =
      purchaseDetailsForEmail?.coursePrice === null ||
      purchaseDetailsForEmail?.coursePrice === 0;

    if (isFreeCourse) {
      return "প্রায়োগিক - কোর্স এনরোলমেন্ট নোটিফিকেশন";
    }
    return "প্রায়োগিক - কোর্স ক্রয় এবং পেমেন্ট নোটিফিকেশন";
  }

  if (purchaseDetailsForEmail?.subscriptionPlanName) {
    const isTrial = purchaseDetailsForEmail?.isTrial;

    if (isTrial) {
      return "প্রায়োগিক - ট্রায়াল সাবস্ক্রিপশন নোটিফিকেশন";
    }
    return "প্রায়োগিক - সাবস্ক্রিপশন ক্রয় এবং পেমেন্ট নোটিফিকেশন";
  }

  // Generic fallback
  const isPaidTransaction =
    purchaseDetailsForEmail?.amount && purchaseDetailsForEmail.amount > 0;

  if (isPaidTransaction) {
    return "প্রায়োগিক - নতুন পেমেন্ট নোটিফিকেশন";
  }
  return "প্রায়োগিক - নতুন এনরোলমেন্ট নোটিফিকেশন";
}
// Helper function to get email resource details
async function getEmailResourceDetails(payload: any) {
  let courseForEmail = null;
  let subscriptionPlanForEmail = null;
  let eventForEmail = null;

  if (payload.courseId) {
    courseForEmail = await db.course.findUnique({
      where: { id: payload.courseId },
      select: { title: true, prices: true },
    });
  }

  if (payload.certificationId) {
    courseForEmail = await db.certification.findUnique({
      where: { id: payload.certificationId },
      select: { title: true, prices: true },
    });
  }

  if (payload.subscriptionPlanId) {
    subscriptionPlanForEmail = await db.subscriptionPlan.findUnique({
      where: { id: payload.subscriptionPlanId },
      select: { name: true },
    });
  }

  if (payload.eventId) {
    eventForEmail = await db.event.findUnique({
      where: { id: payload.eventId },
      select: {
        title: true,
        date: true,
        type: true,
        location: true,
        isOnline: true,
        zoomLink: true,
        price: true,
      },
    });
  }

  return { courseForEmail, subscriptionPlanForEmail, eventForEmail };
}

// Helper function to send multiple emails
async function sendEmailNotifications(
  transporter: any,
  studentMailOptions: any,
  adminMailOptions: any,
  logContext: string
) {
  try {
    await Promise.all([
      transporter.sendMail(studentMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);
    console.log(`Successfully sent ${logContext}`);
  } catch (error) {
    console.error(`Failed to send ${logContext}:`, error);
    throw error;
  }
}

// Main email service class
class PurchaseEmailService {
  private transporter: any;

  constructor() {
    this.transporter = createEmailTransporter();
  }

  // Unified method to handle all email types
  async handlePurchaseEmails(
    payload: any,
    purchase: any,
    subscription: any,
    user: any,
    isNewUser: boolean,
    temporaryPassword?: string,
    username?: string
  ) {
    try {
      // Get all resource details
      const { courseForEmail, subscriptionPlanForEmail, eventForEmail } =
        await getEmailResourceDetails(payload);

      // Prepare purchase details with event info and subscription data
      const purchaseDetailsForEmail = await preparePurchaseDetails(
        payload,
        purchase,
        subscription,
        courseForEmail,
        subscriptionPlanForEmail,
        eventForEmail
      );

      // Determine email subject based on context
      const isNewUserWithCredentials =
        isNewUser && temporaryPassword && username;
      const isEventRegistration = payload.purchaseType === PurchaseType.EVENT;
      const isFreeCourse =
        payload.purchaseType === PurchaseType.SINGLE_COURSE &&
        !purchaseDetailsForEmail.coursePrice;
      let subject = "";
      if (isNewUserWithCredentials && isEventRegistration) {
        subject = "প্রায়োগিকে স্বাগতম! ইভেন্ট রেজিস্ট্রেশন সম্পন্ন হয়েছে।";
      } else if (isNewUserWithCredentials && isFreeCourse) {
        subject = "প্রায়োগিকে স্বাগতম! অ্যাকাউন্ট তৈরি হয়েছে।";
      } else if (isNewUserWithCredentials) {
        subject =
          "প্রায়োগিকে স্বাগতম! আপনার পেমেন্ট সফল হয়েছে এবং অ্যাকাউন্ট তৈরি হয়েছে।";
      } else if (isEventRegistration) {
        subject = `ইভেন্ট রেজিস্ট্রেশন নিশ্চিতকরণ - ${
          eventForEmail?.title || "ইভেন্ট"
        }`;
      } else {
        subject = "প্রায়োগিক - আপনার পেমেন্ট সফল হয়েছে!";
      }

      // Prepare student email
      const studentMailOptions = {
        from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
        to: payload?.email,
        subject,
        html: sendUserNotification(
          payload.email,
          isNewUserWithCredentials ? username : null,
          isNewUserWithCredentials ? temporaryPassword : null,
          purchaseDetailsForEmail,
          eventForEmail as any
        ),
      };

      // Get admin recipients
      const bccRecipients = getBccRecipients();
      // Get admin email subject using helper function
      const adminSubject = getAdminEmailSubject(
        purchaseDetailsForEmail,
        isEventRegistration
      );

      const adminMailOptions = {
        from: `"প্রায়োগিক সিস্টেম" <${process.env.SMTP_USERNAME}>`,
        to: process.env.ADMIN_RECIPIENT_EMAIL,
        ...(bccRecipients && { bcc: bccRecipients }), // Only add BCC if there are recipients
        subject: adminSubject,
        html: sendAdminNotification(
          payload.email,
          username,
          isNewUser,
          purchaseDetailsForEmail
        ),
      };

      // Send emails
      await sendEmailNotifications(
        this.transporter,
        studentMailOptions,
        adminMailOptions,
        `unified ${
          isEventRegistration ? "event registration" : "purchase"
        } emails`
      );

      console.log("Successfully sent unified emails");
    } catch (error) {
      console.error("Failed to process unified emails:", error);
      throw error;
    }
  }
}

export default PurchaseEmailService;
