// import nodemailer from "nodemailer";
// import { db } from "@/lib/db";
// import { sendSubscriptionCredential } from "@/lib/utils/emailTemplates/sendSubscriptionCredential";
// import { sendAdminNotification } from "@/lib/utils/emailTemplates/sendAdminNotification";
// import { sendEventRegistrationEmail } from "@/lib/utils/emailTemplates/event-registration-template";
// import preparePurchaseDetails from "@/lib/utils/preparePurchaseDetails";
// import { PurchaseType } from "@prisma/client";

// const createEmailTransporter = () => {
//   return nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_APP_PASS,
//     },
//   });
// };

// // Helper function to get email resource details
// async function getEmailResourceDetails(payload: any) {
//   let courseForEmail = null;
//   let subscriptionPlanForEmail = null;

//   if (payload.courseId) {
//     courseForEmail = await db.course.findUnique({
//       where: { id: payload.courseId },
//       select: { title: true },
//     });
//   }

//   if (payload.subscriptionPlanId) {
//     subscriptionPlanForEmail = await db.subscriptionPlan.findUnique({
//       where: { id: payload.subscriptionPlanId },
//       select: { name: true },
//     });
//   }

//   return { courseForEmail, subscriptionPlanForEmail };
// }

// // Helper function to send multiple emails
// async function sendEmailNotifications(
//   transporter: any,
//   studentMailOptions: any,
//   adminMailOptions: any,
//   logContext: string
// ) {
//   try {
//     await Promise.all([
//       transporter.sendMail(studentMailOptions),
//       transporter.sendMail(adminMailOptions),
//     ]);
//     console.log(`Successfully sent ${logContext}`);
//   } catch (error) {
//     console.error(`Failed to send ${logContext}:`, error);
//     throw error;
//   }
// }

// // Main email service class
// class PurchaseEmailService {
//   private transporter: any;

//   constructor() {
//     this.transporter = createEmailTransporter();
//   }

//   // Handle event registration emails
//   async sendEventRegistrationEmails(
//     payload: any,
//     purchase: any,
//     subscription: any,
//     user: any,
//     isNewUser: boolean,
//     temporaryPassword?: string,
//     username?: string
//   ) {
//     try {
//       const event = await db.event.findUnique({
//         where: { id: payload.eventId! },
//       });

//       if (!event) {
//         throw new Error("Event not found for email processing");
//       }

//       const { courseForEmail, subscriptionPlanForEmail } =
//         await getEmailResourceDetails(payload);
//       const emailSubject = `ইভেন্ট রেজিস্ট্রেশন নিশ্চিতকরণ - ${event.title}`;
//       const emailContent = sendEventRegistrationEmail(
//         payload.email,
//         username,
//         temporaryPassword,
//         event,
//         isNewUser
//       );

//       // Send event registration email
//       const eventMailOptions = {
//         from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
//         to: payload.email,
//         subject: emailSubject,
//         html: emailContent,
//       };

//       await this.transporter.sendMail(eventMailOptions);

//       // Send additional emails if new user
//       if (isNewUser && temporaryPassword && username) {
//         await this.sendNewUserWelcomeEmails(
//           payload,
//           purchase,
//           subscription,
//           courseForEmail,
//           subscriptionPlanForEmail,
//           event,
//           username,
//           temporaryPassword
//         );
//       } else {
//         await this.sendExistingUserNotificationEmails(
//           payload,
//           purchase,
//           subscription,
//           courseForEmail,
//           subscriptionPlanForEmail,
//           event,
//           username,
//           isNewUser
//         );
//       }

//       console.log("Successfully sent event registration emails");
//     } catch (error) {
//       console.error("Failed to process event registration emails:", error);
//       throw error;
//     }
//   }

//   // Handle subscription/purchase emails
//   async sendPurchaseConfirmationEmails(
//     payload: any,
//     purchase: any,
//     subscription: any,
//     isNewUser: boolean,
//     temporaryPassword?: string,
//     username?: string
//   ) {
//     try {
//       const { courseForEmail, subscriptionPlanForEmail } =
//         await getEmailResourceDetails(payload);
//       const purchaseDetailsForEmail = await preparePurchaseDetails(
//         payload,
//         purchase,
//         subscription,
//         courseForEmail,
//         subscriptionPlanForEmail
//       );

//       console.log(`Purchase details for email:`, purchaseDetailsForEmail);

//       const isNewUserWithCredentials =
//         isNewUser && temporaryPassword && username;
//       const subject = isNewUserWithCredentials
//         ? "প্রায়োগিকে স্বাগতম! আপনার পেমেন্ট সফল হয়েছে এবং অ্যাকাউন্ট তৈরি হয়েছে।"
//         : "প্রায়োগিক - আপনার পেমেন্ট সফল হয়েছে!";

//       const studentMailOptions = {
//         from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
//         to: payload?.email,
//         subject,
//         html: sendSubscriptionCredential(
//           payload.email,
//           isNewUserWithCredentials ? username : null,
//           isNewUserWithCredentials ? temporaryPassword : null,
//           purchaseDetailsForEmail
//         ),
//       };

//       const adminMailOptions = {
//         from: `"প্রায়োগিক সিস্টেম" <${process.env.SMTP_USERNAME}>`,
//         to: process.env.ADMIN_RECIPIENT_EMAIL,
//         subject: `প্রায়োগিক - ${
//           isNewUser ? "নতুন নিবন্ধন" : "নতুন পেমেন্ট"
//         } নোটিফিকেশন`,
//         html: sendAdminNotification(
//           payload.email,
//           username,
//           isNewUser,
//           purchaseDetailsForEmail
//         ),
//       };

//       await sendEmailNotifications(
//         this.transporter,
//         studentMailOptions,
//         adminMailOptions,
//         "subscription emails"
//       );
//     } catch (error) {
//       console.error("Failed to process subscription emails:", error);
//       throw error;
//     }
//   }

//   // Send welcome emails for new users
//   private async sendNewUserWelcomeEmails(
//     payload: any,
//     purchase: any,
//     subscription: any,
//     courseForEmail: any,
//     subscriptionPlanForEmail: any,
//     event: any,
//     username: string,
//     temporaryPassword: string
//   ) {
//     const purchaseDetailsForEmail = await preparePurchaseDetails(
//       payload,
//       purchase,
//       subscription,
//       courseForEmail,
//       subscriptionPlanForEmail,
//       event
//     );

//     const studentMailOptions = {
//       from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
//       to: payload?.email,
//       subject:
//         "প্রায়োগিকে স্বাগতম! আপনার পেমেন্ট সফল হয়েছে এবং অ্যাকাউন্ট তৈরি হয়েছে।",
//       html: sendSubscriptionCredential(
//         payload.email,
//         username,
//         temporaryPassword,
//         purchaseDetailsForEmail
//       ),
//     };

//     const adminMailOptions = {
//       from: `"প্রায়োগিক সিস্টেম" <${process.env.SMTP_USERNAME}>`,
//       to: process.env.ADMIN_RECIPIENT_EMAIL,
//       subject: "প্রায়োগিক - নতুন নিবন্ধন নোটিফিকেশন",
//       html: sendAdminNotification(
//         payload.email,
//         username,
//         true,
//         purchaseDetailsForEmail
//       ),
//     };

//     await sendEmailNotifications(
//       this.transporter,
//       studentMailOptions,
//       adminMailOptions,
//       "new user event registration emails"
//     );
//   }

//   // Send notification emails for existing users
//   private async sendExistingUserNotificationEmails(
//     payload: any,
//     purchase: any,
//     subscription: any,
//     courseForEmail: any,
//     subscriptionPlanForEmail: any,
//     event: any,
//     username: string | undefined,
//     isNewUser: boolean
//   ) {
//     const purchaseDetailsForEmail = await preparePurchaseDetails(
//       payload,
//       purchase,
//       subscription,
//       courseForEmail,
//       subscriptionPlanForEmail,
//       event
//     );

//     const adminMailOptions = {
//       from: `"প্রায়োগিক সিস্টেম" <${process.env.SMTP_USERNAME}>`,
//       to: process.env.ADMIN_RECIPIENT_EMAIL,
//       subject: `প্রায়োগিক - ${
//         isNewUser ? "নতুন নিবন্ধন" : "নতুন পেমেন্ট"
//       } নোটিফিকেশন`,
//       html: sendAdminNotification(
//         payload.email,
//         username,
//         isNewUser,
//         purchaseDetailsForEmail
//       ),
//     };

//     await this.transporter.sendMail(adminMailOptions);
//   }

//   // Send trial welcome emails for new users who get automatic trial enrollment
//   private async sendTrialWelcomeEmails(
//     payload: any,
//     purchase: any,
//     subscription: any,
//     username?: string,
//     temporaryPassword?: string
//   ) {
//     try {
//       const { courseForEmail, subscriptionPlanForEmail } =
//         await getEmailResourceDetails(payload);
//       const purchaseDetailsForEmail = await preparePurchaseDetails(
//         payload,
//         purchase,
//         subscription,
//         courseForEmail,
//         subscriptionPlanForEmail
//       );

//       const studentMailOptions = {
//         from: `"প্রায়োগিক" <${process.env.SMTP_USERNAME}>`,
//         to: payload.email,
//         subject:
//           "প্রায়োগিকে স্বাগতম! আপনার ট্রায়াল সাবস্ক্রিপশন শুরু হয়েছে।",
//         html: sendSubscriptionCredential(
//           payload.email,
//           username,
//           temporaryPassword,
//           purchaseDetailsForEmail
//         ),
//       };

//       const adminMailOptions = {
//         from: `"প্রায়োগিক সিস্টেম" <${process.env.SMTP_USERNAME}>`,
//         to: process.env.ADMIN_RECIPIENT_EMAIL,
//         subject: "প্রায়োগিক - নতুন ট্রায়াল সাবস্ক্রিপশন নোটিফিকেশন",
//         html: sendAdminNotification(
//           payload.email,
//           username,
//           true,
//           purchaseDetailsForEmail
//         ),
//       };

//       await sendEmailNotifications(
//         this.transporter,
//         studentMailOptions,
//         adminMailOptions,
//         "new user trial subscription emails"
//       );

//       console.log("Successfully sent trial welcome emails for new user");
//     } catch (error) {
//       console.error("Failed to send trial welcome emails:", error);
//       throw error;
//     }
//   }

//   // Main method to handle all email types
//   async handlePurchaseEmails(
//     payload: any,
//     purchase: any,
//     subscription: any,
//     user: any,
//     isNewUser: boolean,
//     temporaryPassword?: string,
//     username?: string
//   ) {
//     // switch (payload.purchaseType) {
//     //   case PurchaseType.EVENT:
//     //     await this.sendEventRegistrationEmails(
//     //       payload,
//     //       purchase,
//     //       subscription,
//     //       user,
//     //       isNewUser,
//     //       temporaryPassword,
//     //       username
//     //     );

//     //     await this.sendTrialWelcomeEmails(
//     //       payload,
//     //       purchase,
//     //       subscription,
//     //       user
//     //     );
//     //     break;

//     //   default:
//     await this.sendPurchaseConfirmationEmails(
//       payload,
//       purchase,
//       subscription,
//       isNewUser,
//       temporaryPassword,
//       username
//     );
//     //     break;
//     // }
//   }
// }

// export default PurchaseEmailService;

// @ts-nocheck
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

      let subject = "";
      if (isNewUserWithCredentials && isEventRegistration) {
        subject = "প্রায়োগিকে স্বাগতম! ইভেন্ট রেজিস্ট্রেশন সম্পন্ন হয়েছে।";
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

      // Prepare admin email
      const adminSubject = isEventRegistration
        ? `প্রায়োগিক - ${
            isNewUser ? "নতুন নিবন্ধন ও " : ""
          }ইভেন্ট রেজিস্ট্রেশন নোটিফিকেশন`
        : `প্রায়োগিক - ${
            isNewUser ? "নতুন নিবন্ধন" : "নতুন পেমেন্ট"
          } নোটিফিকেশন`;

      const adminMailOptions = {
        from: `"প্রায়োগিক সিস্টেম" <${process.env.SMTP_USERNAME}>`,
        to: process.env.ADMIN_RECIPIENT_EMAIL,
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

  // Keep these methods for backward compatibility but mark as deprecated
  /** @deprecated Use handlePurchaseEmails instead */
  async sendEventRegistrationEmails(...args: any[]) {
    console.warn(
      "sendEventRegistrationEmails is deprecated. Use handlePurchaseEmails instead."
    );
    return this.handlePurchaseEmails(...args);
  }

  /** @deprecated Use handlePurchaseEmails instead */
  async sendPurchaseConfirmationEmails(...args: any[]) {
    console.warn(
      "sendPurchaseConfirmationEmails is deprecated. Use handlePurchaseEmails instead."
    );
    return this.handlePurchaseEmails(...args);
  }
}

export default PurchaseEmailService;
