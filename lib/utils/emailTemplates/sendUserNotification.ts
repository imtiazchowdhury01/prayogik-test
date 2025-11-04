import { getConsistentBangladeshTime } from "../stringUtils";

export const sendUserNotification = (
  email: any,
  username: any,
  password: any,
  purchaseDetailsForEmail: any,
  eventDetails = null
) => {
  let contactUrl = process.env.NEXT_PUBLIC_APP_URL + "/contact";
  const isNewUser = username && password;
  const isEventRegistration =
    eventDetails || purchaseDetailsForEmail?.eventName;
  const isFreeEvent =
    purchaseDetailsForEmail?.eventPrice === null ||
    purchaseDetailsForEmail?.eventPrice === 0;
  const isFreeCourse =
    purchaseDetailsForEmail?.coursePrice === null ||
    purchaseDetailsForEmail?.coursePrice === 0;
  const isTrial = purchaseDetailsForEmail?.isTrial;
  const isEOIEvent = purchaseDetailsForEmail?.eventType === "EOI";

  const eventInfo = eventDetails || {
    title: purchaseDetailsForEmail?.eventName,
    date: purchaseDetailsForEmail?.eventDate,
    type: purchaseDetailsForEmail?.eventType,
    location: purchaseDetailsForEmail?.eventLocation,
    isOnline: purchaseDetailsForEmail?.isOnlineEvent,
    price: purchaseDetailsForEmail?.eventPrice,
    zoomLink: purchaseDetailsForEmail?.eventZoomLink,
  };

  // Determine main message
  let mainMessage = "";
  if (isNewUser && isEventRegistration) {
    if (isFreeEvent) {
      mainMessage =
        "প্রায়োগিক প্ল্যাটফর্মে আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে এবং ইভেন্ট রেজিস্ট্রেশন সাবমিট হয়েছে। আমরা শীঘ্রই ইভেন্ট নিশ্চিতকরণ সম্পর্কে আপনাকে জানাব। প্ল্যাটফর্মে স্বাগতম!";
    } else {
      mainMessage =
        "প্রায়োগিক প্ল্যাটফর্মে আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে এবং ইভেন্ট রেজিস্ট্রেশন সম্পন্ন হয়েছে। প্ল্যাটফর্মে স্বাগতম!";
    }
  } else if (isNewUser && !isEventRegistration) {
    mainMessage =
      "প্রায়োগিক প্ল্যাটফর্মে আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে। প্ল্যাটফর্মে স্বাগতম!";
  } else if (!isNewUser && isEventRegistration) {
    if (isFreeEvent) {
      mainMessage =
        "আপনার ইভেন্ট রেজিস্ট্রেশন সাবমিট হয়েছে! আমরা শীঘ্রই ইভেন্ট নিশ্চিতকরণ সম্পর্কে আপনাকে জানাব।";
    } else {
      mainMessage = "আপনার ইভেন্ট রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!";
    }
  } else {
    mainMessage =
      "আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে! আপনার সাবস্ক্রিপশন সক্রিয় করা হয়েছে।";
  }


  const { timeString, dateString }: any = getConsistentBangladeshTime(
    eventInfo?.date
  );

  // Block 1: Account Information (for new users)
  const accountInformationBlock = isNewUser
    ? `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        অ্যাকাউন্টের তথ্য
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;">
            লগইন URL:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/signin" 
               style="color:#3182ce;text-decoration:none;font-weight:500;padding:8px 12px;background-color:#f7fafc;border-radius:6px;display:inline-block;">
              ${process.env.NEXT_PUBLIC_APP_URL}/signin
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ইমেইল:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${email}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            পাসওয়ার্ড:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
            <span style="background-color:#f7fafc;color:#2d3748;font-weight:600;padding:10px 16px;border-radius:8px;border:1px solid #e2e8f0;font-family:monospace;letter-spacing:1px;display:inline-block;">
              ${password}
            </span>
          </td>
        </tr>
      </table>
    </div>
  `
    : "";

  // Block 2: Platform Access (for existing users, non-event)
  const platformAccessBlock =
    !isNewUser && !isEventRegistration
      ? `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        প্ল্যাটফর্ম অ্যাক্সেস
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;">
            লগইন করুন:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/signin" 
               style="color:#3182ce;text-decoration:none;font-weight:500;padding:8px 12px;background-color:#f7fafc;border-radius:6px;display:inline-block;">
              ${process.env.NEXT_PUBLIC_APP_URL}/signin
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            আপনার ইমেইল:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${email}
          </td>
        </tr>
      </table>
    </div>
  `
      : "";

  // Block 3: Event Details
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
            ${eventInfo?.title || "N/A"}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            তারিখ ও সময়:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${
              eventInfo?.date
                ? `${dateString}, ${timeString}`
                : "তারিখ ও সময় নির্ধারণ করা হয়নি"
            }
          </td>
        </tr>
        ${
          !isEOIEvent
            ? `
          <tr>
            <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
              ফি:
            </td>
            <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
              ${
                isFreeEvent
                  ? '<span style="background-color:#10b981;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">ফ্রি</span>'
                  : `৳${eventInfo?.price}`
              }
            </td>
          </tr>
        `
            : ""
        }
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            স্থান:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${
              eventInfo?.isOnline
                ? "অনলাইন"
                : eventInfo?.location || "পরে জানানো হবে"
            }
          </td>
        </tr>
        ${
          eventInfo?.isOnline &&
          eventInfo?.zoomLink &&
          purchaseDetailsForEmail?.transactionId
            ? `
          <tr>
            <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
              মিটিং লিংক:
            </td>
            <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
              <a href="${eventInfo.zoomLink}" 
                 style="color:#3182ce;text-decoration:none;font-weight:500;padding:8px 12px;background-color:#f7fafc;border-radius:6px;display:inline-block;">
                মিটিং মিটিং লিংক
              </a>
            </td>
          </tr>
        `
            : ""
        }
        <tr>
          <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
            রেজিস্ট্রেশন তারিখ:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${new Date().toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </td>
        </tr>
        ${
          isEOIEvent
            ? `
          <tr>
            <td colspan="2" style="padding:16px 0;">
              <div style="background-color:#fff3cd;border:1px solid #ffeaa7;border-radius:8px;padding:12px;">
                <p style="margin:0;font-size:14px;color:#856404;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                  ইভেন্টের ফি এখনো নির্ধারণ হয়নি। পরবর্তীতে ইমেইলের মাধ্যমে জানানো হবে।
                </p>
              </div>
            </td>
          </tr>
        `
            : ""
        }
      </table>
    </div>
  `
    : "";

  // Block 4: Course Details
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
            কোর্স:
          </td>
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${purchaseDetailsForEmail.courseName}
          </td>
        </tr>
        ${
          purchaseDetailsForEmail?.coursePrice !== null
            ? `
          <tr>
            <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
              মূল্য:
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

  // Block 5: Subscription Details
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
          <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
            ${purchaseDetailsForEmail.subscriptionPlanName}
            ${
              isTrial
                ? ' <span style="background-color:#fd9a31;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;margin-left:8px;">ট্রায়াল</span>'
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

  // Block 6: Payment Information
  const paymentInformationBlock =
    (purchaseDetailsForEmail?.amount && purchaseDetailsForEmail.amount > 0) ||
    purchaseDetailsForEmail?.transactionId
      ? `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        পেমেন্ট বিবরণ
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        ${
          purchaseDetailsForEmail?.amount && purchaseDetailsForEmail.amount > 0
            ? `
          <tr>
            <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
              পেমেন্ট:
            </td>
            <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
              ৳${purchaseDetailsForEmail.amount}
            </td>
          </tr>
        `
            : ""
        }
        ${
          purchaseDetailsForEmail?.amount && purchaseDetailsForEmail.amount > 0
            ? `
          <tr>
            <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
              পেমেন্ট মেথড:
            </td>
            <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
              ${isTrial ? "ফ্রি ট্রায়াল" : "বিকাশ"}
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
              ট্রানজেকশন আইডি:
            </td>
            <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
              ${purchaseDetailsForEmail.transactionId}
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
              <span style="background-color:#10b981;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">পেইড</span>
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

  // Trial Bonus Section
  const trialBonusBlock =
    isTrial && isNewUser && isEventRegistration
      ? `
    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:24px 0;">
      <h3 style="font-size:16px;font-weight:600;margin:0 0 12px 0;font-family:'Open Sans', Arial,sans-serif;color:#166534;">
        🎉 বোনাস: প্রায়োগিক প্রাইম - ফ্রি ট্রায়াল অ্যাক্সেস!
      </h3>
      <p style="margin:0;font-size:14px;color:#15803d;font-family:'Open Sans', Arial,sans-serif;line-height:1.6;">
        আপনি <strong>প্রায়োগিক প্রাইম</strong> এর ফ্রি ট্রায়াল অ্যাক্সেস পেয়েছেন। 
        সমস্ত প্রাইম কোর্স
        <strong>আগামী ${new Date(
          purchaseDetailsForEmail.expiresAt
        ).toLocaleDateString("bn-BD", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</strong> পর্যন্ত <strong>ফ্রি অ্যাক্সেস</strong> করতে পারবেন।
      </p>
    </div>
  `
      : "";

  // Event Instructions
  const eventInstructionsBlock = isEventRegistration
    ? `
    <div style="background-color:#fef7f0;border:1px solid #fed7aa;border-radius:12px;padding:20px;margin:24px 0;">
      <h3 style="font-size:16px;font-weight:600;margin:0 0 12px 0;font-family:'Open Sans', Arial,sans-serif;color:#c2410c;">
        গুরুত্বপূর্ণ নির্দেশনা
      </h3>
      <ul style="margin:0;padding-left:20px;font-size:14px;color:#7c2d12;font-family:'Open Sans', Arial,sans-serif;line-height:1.6;">
        <li style="margin-bottom:8px;">ইভেন্টের আগে আপনার ইমেইল চেক করুন যেকোনো আপডেটের জন্য</li>
        <li style="margin-bottom:8px;">ইভেন্টের দিন সময়মতো উপস্থিত থাকুন</li>
        ${
          eventInfo?.isOnline
            ? '<li style="margin-bottom:8px;">অনলাইন ইভেন্টের জন্য একটি স্থিতিশীল ইন্টারনেট সংযোগ নিশ্চিত করুন</li>'
            : '<li style="margin-bottom:8px;">অফলাইন ইভেন্টের জন্য ভেন্যুর ঠিকানা এবং পথ নির্দেশনা আগে থেকেই জেনে নিন</li>'
        }
      </ul>
    </div>
  `
    : "";

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
                  হ্যালো,
                </p>
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  ${mainMessage}
                </p>
                ${
                  !isEventRegistration
                    ? `
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                    আপনি এখন আপনার বিদ্যমান অ্যাকাউন্ট দিয়ে সমস্ত নতুন কন্টেন্ট অ্যাক্সেস করতে পারবেন।
                  </p>
                `
                    : ""
                }

                ${accountInformationBlock}
                ${platformAccessBlock}
                ${eventDetailsBlock}
                ${courseDetailsBlock}
                ${subscriptionDetailsBlock}
                ${paymentInformationBlock}
                ${trialBonusBlock}
                ${eventInstructionsBlock}

                ${
                  isNewUser
                    ? `
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                    আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করার জন্য, অনুগ্রহ করে লগইন করে দ্রুত আপনার পাসওয়ার্ড পরিবর্তন করুন।
                  </p>
                `
                    : !isEventRegistration
                    ? `
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                    আপনি এখন আপনার বিদ্যমান অ্যাকাউন্ট দিয়ে সমস্ত নতুন কন্টেন্ট অ্যাক্সেস করতে পারবেন।
                  </p>
                `
                    : ""
                }

                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  যদি কোনো প্রশ্ন থাকে অথবা সাহায্যের প্রয়োজন হয়, অনুগ্রহ করে <a href="${contactUrl}" style="color:#067df7;text-decoration:none" target="_blank">যোগাযোগ করুন</a>।
                </p>
                ${
                  isEventRegistration
                    ? `
                  <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                    ইভেন্টে আপনাকে দেখার অপেক্ষায় রইলাম!
                  </p>
                `
                    : ""
                }
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  শুভেচ্ছাসহ,<br>
                  প্রায়োগিক টিম
                </p>

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
                            প্রায়োগিক
                          </a> 
                          থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
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
