// // @ts-nocheck
// export const sendAdminNotification = (
//   userEmail,
//   username,
//   isNewUser,
//   purchaseDetailsForEmail
// ) => {
//   return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
//             <html dir="ltr" lang="en">
//               <head>
//                 <link
//                   rel="preload"
//                   as="image"
//                   href="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png" />
//                 <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
//                 <meta name="x-apple-disable-message-reformatting" />
//               </head>
//               <body style="background-color:#f6f9fc;padding:10px 0">
//                 <table
//                   align="center"
//                   width="100%"
//                   border="0"
//                   cellpadding="0"
//                   cellspacing="0"
//                   role="presentation"
//                   style="max-width:45.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
//                   <tbody>
//                     <tr style="width:100%">
//                       <td>
//                         <img
//                           alt="Prayogik"
//                           height="33"
//                           src="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png"
//                           style="display:block;outline:none;border:none;text-decoration:none" />

import { getConsistentBangladeshTime } from "../stringUtils";

                        
//                         <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
//                           প্রিয় অ্যাডমিন,
//                         </p>
                        
//                         <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
//                           ${
//                             purchaseDetailsForEmail?.purchaseType === "EVENT"
//                               ? isNewUser
//                                 ? `একজন নতুন ব্যবহারকারী সফলভাবে একটি ইভেন্টে নিবন্ধন করেছে এবং পেমেন্ট সম্পন্ন করেছে।`
//                                 : `একজন ব্যবহারকারী সফলভাবে একটি ইভেন্টে নিবন্ধন করেছে।`
//                               : isNewUser
//                               ? `একজন নতুন ব্যবহারকারী সফলভাবে নিবন্ধন করেছে এবং পেমেন্ট সম্পন্ন করেছে।`
//                               : `সিস্টেমে একটি নতুন এনরোলমেন্ট এবং ট্রান্সেকশন সফলভাবে সম্পন্ন হয়েছে।`
//                           }
//                         </p>
                        
//                         <!-- User Details Section -->
//                         <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
//                           <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
//                             ব্যবহারকারীর তথ্য
//                           </h3>
//                           <table width="100%" border="0" cellpadding="0" cellspacing="0">
//                             <tr>
//                               <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;">
//                                 ব্যবহারকারীর ধরন:
//                               </td>
//                               <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                 ${
//                                   isNewUser
//                                     ? '<span style="background-color:#48bb78;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">নতুন ব্যবহারকারী</span>'
//                                     : '<span style="background-color:#3182ce;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">বর্তমান ব্যবহারকারী</span>'
//                                 }
//                               </td>
//                             </tr>
//                             <tr>
//                               <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                 ইমেইল:
//                               </td>
//                               <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                 ${userEmail}
//                               </td>
//                             </tr>
//                             ${
//                               username
//                                 ? `
//                             <tr>
//                               <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                 ব্যবহারকারীর নাম:
//                               </td>
//                               <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                 ${username}
//                               </td>
//                             </tr>
//                             `
//                                 : ""
//                             }
//                           </table>
//                         </div>
                        
//                         <!-- Purchase Details Section -->
//                         <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
//                           <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
//                             ${
//                               purchaseDetailsForEmail?.purchaseType === "EVENT"
//                                 ? "ইভেন্ট নিবন্ধন বিবরণ"
//                                 : "পেমেন্ট বিবরণ"
//                             }
//                           </h3>
//                           <table width="100%" border="0" cellpadding="0" cellspacing="0">
//                             ${
//                               purchaseDetailsForEmail?.eventName
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   ইভেন্ট:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
//                                   ${purchaseDetailsForEmail.eventName}
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.eventDate
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   ইভেন্টের তারিখ:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ${new Date(
//                                     purchaseDetailsForEmail.eventDate
//                                   ).toLocaleDateString("bn-BD", {
//                                     year: "numeric",
//                                     month: "long",
//                                     day: "numeric",
//                                   })}
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.eventType
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   ইভেন্টের ধরন:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ${purchaseDetailsForEmail.eventType}
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.isOnlineEvent !== undefined
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   ইভেন্ট মাধ্যম:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ${
//                                     purchaseDetailsForEmail.isOnlineEvent
//                                       ? '<span style="background-color:#10b981;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">অনলাইন</span>'
//                                       : '<span style="background-color:#f59e0b;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">অফলাইন</span>'
//                                   }
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.eventLocation &&
//                               !purchaseDetailsForEmail?.isOnlineEvent
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   স্থান:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ${purchaseDetailsForEmail.eventLocation}
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.courseName
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   কোর্স:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ${purchaseDetailsForEmail.courseName}
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.subscriptionPlanName
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   সাবস্ক্রিপশন প্ল্যান:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ${
//                                     purchaseDetailsForEmail.subscriptionPlanName
//                                   }
//                                   ${
//                                     purchaseDetailsForEmail?.isTrial
//                                       ? ' <span style="background-color:#fd9a31;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;margin-left:8px;">ট্রায়াল</span>'
//                                       : ""
//                                   }
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.expiresAt
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   ${
//                                     purchaseDetailsForEmail?.isTrial
//                                       ? "ট্রায়াল শেষ:"
//                                       : "মেয়াদ শেষ:"
//                                   }
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ${new Date(
//                                     purchaseDetailsForEmail.expiresAt
//                                   ).toLocaleDateString("bn-BD", {
//                                     year: "numeric",
//                                     month: "long",
//                                     day: "numeric",
//                                   })}
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.amount &&
//                               purchaseDetailsForEmail.amount > 0
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   পেমেন্ট:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
//                                   ৳${purchaseDetailsForEmail.amount}
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.purchaseType !== "TRIAL"
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   পেমেন্ট মাধ্যম:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   বিকাশ
//                                 </td>
//                               </tr>
//                             `
//                                 : `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   পেমেন্ট মাধ্যম:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ফ্রি ট্রায়াল
//                                 </td>
//                               </tr>
//                             `
//                             }
//                             ${
//                               purchaseDetailsForEmail?.transactionId
//                                 ? `
//                               <tr>
//                                 <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                   ট্রানজেকশন আইডি:
//                                 </td>
//                                 <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                   ${purchaseDetailsForEmail.transactionId}
//                                 </td>
//                               </tr>
//                             `
//                                 : ""
//                             }
//                             ${
//                               purchaseDetailsForEmail?.purchaseId
//                                 ? `
//                                     <tr>
//                                     <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                         ক্রয় আইডি:
//                                     </td>
//                                     <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                         ${purchaseDetailsForEmail.purchaseId}
//                                     </td>
//                                     </tr>
//                                 `
//                                 : ""
//                             }
//                             <tr>
//                               <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
//                                 ${
//                                   purchaseDetailsForEmail?.purchaseType ===
//                                   "EVENT"
//                                     ? "নিবন্ধনের তারিখ:"
//                                     : "পেমেন্ট তারিখ:"
//                                 }
//                               </td>
//                               <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
//                                 ${new Date().toLocaleDateString("bn-BD", {
//                                   year: "numeric",
//                                   month: "long",
//                                   day: "numeric",
//                                 })}
//                               </td>
//                             </tr>
//                           </table>
//                         </div>
                        
//                         <!-- Footer -->
//                         <table
//                           width="100%"
//                           border="0"
//                           cellpadding="0"
//                           cellspacing="0"
//                           role="presentation"
//                           style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0;">
//                           <tbody>
//                             <tr>
//                              <td style="text-align:center;">
//                               <p style="margin:0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:12px;color:#666;">
//                                 এই ইমেইলটি 
//                                 <a href="${process.env.NEXT_PUBLIC_APP_URL}" target="_blank" style="color:#4f46e5; text-decoration:none; font-weight:600;">
//                                   প্রায়োগিক
//                                 </a> 
//                                 থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
//                               </p>
//                             </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </body>
//             </html>`;
// };



export const sendAdminNotification = (
  userEmail: any,
  username: any,
  isNewUser: any,
  purchaseDetailsForEmail: any
) => {
  const isEventRegistration = purchaseDetailsForEmail?.purchaseType === "EVENT";
  const isFreeEvent =
    purchaseDetailsForEmail?.eventPrice === null ||
    purchaseDetailsForEmail?.eventPrice === 0;
  const isFreeCourse =
    purchaseDetailsForEmail?.coursePrice === null ||
    purchaseDetailsForEmail?.coursePrice === 0;
  const isTrial = purchaseDetailsForEmail?.isTrial;
  const isEOIEvent = purchaseDetailsForEmail?.eventType === "EOI";
  const isPaidTransaction =
    purchaseDetailsForEmail?.amount && purchaseDetailsForEmail.amount > 0;

  // Determine main notification message
  let notificationMessage = "";
  if (isNewUser && isEventRegistration) {
    if (isFreeEvent || isEOIEvent) {
      notificationMessage =
        "একজন নতুন ব্যবহারকারী সফলভাবে একটি ইভেন্টে নিবন্ধন করেছে। অ্যাকাউন্ট তৈরি করা হয়েছে।";
    } else {
      notificationMessage =
        "একজন নতুন ব্যবহারকারী সফলভাবে একটি ইভেন্টে নিবন্ধন করেছে এবং পেমেন্ট সম্পন্ন করেছে।";
    }
  } else if (isNewUser && !isEventRegistration) {
    notificationMessage =
      "একজন নতুন ব্যবহারকারী সফলভাবে নিবন্ধন করেছে এবং পেমেন্ট সম্পন্ন করেছে।";
  } else if (!isNewUser && isEventRegistration) {
    if (isFreeEvent || isEOIEvent) {
      notificationMessage =
        "একজন বর্তমান ব্যবহারকারী একটি ইভেন্টে নিবন্ধন করেছে।";
    } else {
      notificationMessage =
        "একজন বর্তমান ব্যবহারকারী একটি ইভেন্টে নিবন্ধন করেছে এবং পেমেন্ট সম্পন্ন করেছে।";
    }
  } else {
    notificationMessage =
      "সিস্টেমে একটি নতুন এনরোলমেন্ট এবং ট্রান্সেকশন সফলভাবে সম্পন্ন হয়েছে।";
  }


  const { timeString, dateString }: any = purchaseDetailsForEmail?.eventDate
    ? getConsistentBangladeshTime(purchaseDetailsForEmail.eventDate)
    : { timeString: "", dateString: "" };

  // Block 1: User Information
  const userInformationBlock = `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        ব্যবহারকারীর তথ্য
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;">
            ব্যবহারকারীর ধরন:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${
              isNewUser
                ? '<span style="background-color:#48bb78;color:white;padding:6px 12px;border-radius:6px;font-size:13px;font-weight:600;">নতুন ব্যবহারকারী</span>'
                : '<span style="background-color:#3182ce;color:white;padding:6px 12px;border-radius:6px;font-size:13px;font-weight:600;">বর্তমান ব্যবহারকারী</span>'
            }
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ইমেইল:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            ${userEmail}
          </td>
        </tr>
        ${
          username
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ব্যবহারকারীর নাম:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            ${username}
          </td>
        </tr>
        `
            : ""
        }
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            নিবন্ধনের সময়:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${new Date().toLocaleString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </td>
        </tr>
      </table>
    </div>
  `;

  // Block 2: Event Details (if event registration)
  const eventDetailsBlock = isEventRegistration
    ? `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        ইভেন্ট বিবরণ
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            ইভেন্টের নাম:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            ${purchaseDetailsForEmail?.eventName || "N/A"}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            ইভেন্টের ধরন:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            ${
              purchaseDetailsForEmail?.eventType
                ? `<span style="background-color:#edf2f7;color:#2d3748;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">${purchaseDetailsForEmail.eventType}</span>`
                : "N/A"
            }
          </td>
        </tr>
        ${
          purchaseDetailsForEmail?.eventDate
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            তারিখ ও সময়:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${dateString}, ${timeString}
          </td>
        </tr>
        `
            : ""
        }
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            ইভেন্ট মাধ্যম:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${
              purchaseDetailsForEmail?.isOnlineEvent
                ? '<span style="background-color:#10b981;color:white;padding:6px 12px;border-radius:6px;font-size:13px;font-weight:600;">অনলাইন</span>'
                : '<span style="background-color:#f59e0b;color:white;padding:6px 12px;border-radius:6px;font-size:13px;font-weight:600;">অফলাইন</span>'
            }
          </td>
        </tr>
        ${
          purchaseDetailsForEmail?.eventLocation &&
          !purchaseDetailsForEmail?.isOnlineEvent
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            স্থান:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${purchaseDetailsForEmail.eventLocation}
          </td>
        </tr>
        `
            : ""
        }
        ${
          !isEOIEvent
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            ইভেন্ট ফি:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            ${
              isFreeEvent
                ? '<span style="background-color:#10b981;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">ফ্রি</span>'
                : `৳${purchaseDetailsForEmail?.eventPrice}`
            }
          </td>
        </tr>
        `
            : `
        <tr>
          <td colspan="2" style="padding:12px 0;">
            <div style="background-color:#fff3cd;border:1px solid#ffeaa7;border-radius:8px;padding:12px;">
              <p style="margin:0;font-size:14px;color:#856404;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                ⚠️ EOI ইভেন্ট - ফি এখনো নির্ধারিত হয়নি
              </p>
            </div>
          </td>
        </tr>
        `
        }
        ${
          purchaseDetailsForEmail?.eventZoomLink &&
          purchaseDetailsForEmail?.isOnlineEvent
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            মিটিং লিংক:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
            <a href="${purchaseDetailsForEmail.eventZoomLink}" 
               style="color:#3182ce;text-decoration:none;font-weight:500;padding:8px 12px;background-color:#f7fafc;border-radius:6px;display:inline-block;">
              জুম লিংক দেখুন
            </a>
          </td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
  `
    : "";

  // Block 3: Course Details
  const courseDetailsBlock =
    purchaseDetailsForEmail?.courseName && !isEventRegistration
      ? `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        কোর্স বিবরণ
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            কোর্সের নাম:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            ${purchaseDetailsForEmail.courseName}
          </td>
        </tr>
        ${
          purchaseDetailsForEmail?.coursePrice !== null &&
          purchaseDetailsForEmail?.coursePrice !== undefined
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            কোর্স মূল্য:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            ${
              isFreeCourse
                ? '<span style="background-color:#10b981;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">ফ্রি</span>'
                : `৳${purchaseDetailsForEmail.coursePrice}`
            }
          </td>
        </tr>
        `
            : ""
        }
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            এনরোলমেন্ট তারিখ:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${new Date().toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </td>
        </tr>
      </table>
    </div>
  `
      : "";

  // Block 4: Subscription Details
  const subscriptionDetailsBlock = purchaseDetailsForEmail?.subscriptionPlanName
    ? `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        সাবস্ক্রিপশন বিবরণ
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            সাবস্ক্রিপশন প্ল্যান:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            ${purchaseDetailsForEmail.subscriptionPlanName}
            ${
              isTrial
                ? ' <span style="background-color:#fd9a31;color:white;padding:6px 12px;border-radius:6px;font-size:13px;font-weight:600;margin-left:8px;">ট্রায়াল</span>'
                : ""
            }
          </td>
        </tr>
        ${
          isTrial && purchaseDetailsForEmail?.trialStartDate
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            ট্রায়াল শুরু:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${new Date(
              purchaseDetailsForEmail.trialStartDate
            ).toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </td>
        </tr>
        `
            : ""
        }
        ${
          purchaseDetailsForEmail?.expiresAt
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            ${isTrial ? "ট্রায়াল শেষ:" : "মেয়াদ শেষ:"}
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${new Date(purchaseDetailsForEmail.expiresAt).toLocaleDateString(
              "bn-BD",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
  `
    : "";

  // Block 5: Transaction Details
  const transactionDetailsBlock =
    isPaidTransaction || purchaseDetailsForEmail?.transactionId
      ? `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        পেমেন্ট ও ট্রানজেকশন বিবরণ
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        ${
          isPaidTransaction
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            পেমেন্ট পরিমাণ:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            <span style="background-color:#f0fdf4;color:#166534;padding:8px 16px;border-radius:8px;font-size:16px;border:1px solid #bbf7d0;">
              ৳${purchaseDetailsForEmail.amount}
            </span>
          </td>
        </tr>
        `
            : ""
        }
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            পেমেন্ট মাধ্যম:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${isTrial ? "ফ্রি ট্রায়াল" : "বিকাশ"}
          </td>
        </tr>
        ${
          purchaseDetailsForEmail?.transactionId
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            ট্রানজেকশন আইডি:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
            <span style="background-color:#f7fafc;color:#2d3748;font-weight:600;padding:10px 16px;border-radius:8px;border:1px solid #e2e8f0;font-family:monospace;letter-spacing:0.5px;display:inline-block;">
              ${purchaseDetailsForEmail.transactionId}
            </span>
          </td>
        </tr>
        `
            : ""
        }
        ${
          purchaseDetailsForEmail?.purchaseId
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            ক্রয় আইডি:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
            <span style="background-color:#f7fafc;color:#2d3748;font-weight:600;padding:10px 16px;border-radius:8px;border:1px solid #e2e8f0;font-family:monospace;letter-spacing:0.5px;display:inline-block;">
              ${purchaseDetailsForEmail.purchaseId}
            </span>
          </td>
        </tr>
        `
            : ""
        }
        ${
          purchaseDetailsForEmail?.transactionId
            ? `
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            পেমেন্ট স্ট্যাটাস:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
            <span style="background-color:#10b981;color:white;padding:6px 12px;border-radius:6px;font-size:13px;font-weight:600;">সম্পন্ন</span>
          </td>
        </tr>
        `
            : ""
        }
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            পেমেন্ট তারিখ:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${new Date().toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </td>
        </tr>
      </table>
    </div>
  `
      : "";

  // Quick Action Block
  const quickActionBlock = `
    <div style="background-color:#fef7f0;border:1px solid #fed7aa;border-radius:12px;padding:20px;margin:24px 0;">
      <h3 style="font-size:16px;font-weight:600;margin:0 0 12px 0;font-family:'Open Sans', Arial,sans-serif;color:#c2410c;">
        ⚡ দ্রুত অ্যাকশন
      </h3>
      <ul style="margin:0;padding-left:20px;font-size:14px;color:#7c2d12;font-family:'Open Sans', Arial,sans-serif;line-height:1.6;">
        ${
          isNewUser
            ? '<li style="margin-bottom:8px;">নতুন ব্যবহারকারীর প্রোফাইল যাচাই করুন</li>'
            : ""
        }
        ${
          isEventRegistration
            ? '<li style="margin-bottom:8px;">ইভেন্ট উপস্থিতি তালিকা আপডেট করুন</li>'
            : ""
        }
        ${
          purchaseDetailsForEmail?.transactionId
            ? '<li style="margin-bottom:8px;">পেমেন্ট রেকর্ড যাচাই করুন</li>'
            : ""
        }
        <li style="margin-bottom:8px;">ব্যবহারকারীর অ্যাক্সেস নিশ্চিত করুন</li>
        ${
          isEOIEvent
            ? '<li style="margin-bottom:8px;">EOI ইভেন্ট - পরবর্তী পদক্ষেপের জন্য ব্যবহারকারীকে ফলো-আপ করুন</li>'
            : ""
        }
      </ul>
    </div>
  `;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="en">
      <head>
        <link rel="preload" as="image" href="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
      </head>
      <body style="background-color:#f6f9fc;padding:10px 0">
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:45.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
          <tbody>
            <tr style="width:100%">
              <td>
                <img alt="Prayogik" height="33" src="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png" style="display:block;outline:none;border:none;text-decoration:none" />
                
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  প্রিয় অ্যাডমিন,
                </p>
                
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  ${notificationMessage}
                </p>
                ${userInformationBlock}
                ${eventDetailsBlock}
                ${courseDetailsBlock}
                ${subscriptionDetailsBlock}
                ${transactionDetailsBlock}
                ${quickActionBlock}

                

                <!-- Footer -->
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0;">
                  <tbody>
                    <tr>
                      <td style="text-align:center;">
                        <p style="margin:0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:12px;color:#666;">
                          এই ইমেইলটি 
                          <a href="${
                            process.env.NEXT_PUBLIC_APP_URL
                          }" target="_blank" style="color:#4f46e5; text-decoration:none; font-weight:600;">
                            প্রয়োগিক
                          </a> 
                          থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
                        </p>
                        <p style="margin:8px 0 0 0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:11px;color:#999;">
                          ${new Date().toLocaleString("bn-BD", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`;
};