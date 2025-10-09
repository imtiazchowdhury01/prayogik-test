export const paymentReminderTemplate = (
  recipientName: string,
  eventDetails: {
    title: string;
    slug: string;
    date?: string;
    type?: string;
    location?: string;
    isOnline?: boolean;
    zoomLink?: string;
    price?: number;
    registeredAt?: string;
  },
  baseUrl: string
) => {
  const isFreeEvent = eventDetails.type === "FREE";
  const isPaidEvent = eventDetails.type === "PAID";
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
      </head>
      <body style="background-color:#f6f9fc;padding:10px 0">
        <table
          align="center"
          width="100%"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="max-width:45.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
          <tbody>
            <tr style="width:100%">
              <td>
                <img
                  alt="Prayogik"
                  height="33"
                  src="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png"
                  style="display:block;outline:none;border:none;text-decoration:none" />
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  প্রিয় ${recipientName},
                </p>
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  ${
                    isFreeEvent
                      ? "আপনার ইভেন্ট রেজিস্ট্রেশন সফল হয়েছে। নিচে ইভেন্টের বিস্তারিত তথ্য দেওয়া হলো।"
                      : "উক্ত ইভেন্টে পেমেন্ট প্রক্রিয়া শুরু হয়েছে। অনুগ্রহপূর্বক দ্রুত সময়ের মধ্যে পেমেন্ট সম্পন্ন করে আপনার সিট নিশ্চিত করুন।"
                  }
                </p>
                
                <!-- Event Details Section -->
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
                        ${eventDetails?.title || "N/A"}
                      </td>
                    </tr>
                    ${
                      eventDetails?.date
                        ? `
                    <tr>
                      <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                        তারিখ ও সময়:
                      </td>
                      <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                        ${new Date(eventDetails.date).toLocaleDateString(
                          "bn-BD",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                    </tr>
                    `
                        : "পরে জানানো হবে"
                    }
                    ${
                      isPaidEvent && eventDetails?.price
                        ? `
                    <tr>
                      <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                        ফি:
                      </td>
                      <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
                        <span style="background-color:#fee2e2;color:#dc2626;padding:6px 12px;border-radius:6px;font-size:16px;font-weight:600;">
                          ৳ ${eventDetails.price}
                        </span>
                      </td>
                    </tr>
                    `
                        : isFreeEvent
                        ? `
                    <tr>
                      <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                        ফি:
                      </td>
                      <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
                        <span style="background-color:#dcfce7;color:#16a34a;padding:6px 12px;border-radius:6px;font-size:16px;font-weight:600;">
                          ফ্রি
                        </span>
                      </td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      eventDetails?.location !== undefined
                        ? `
                    <tr>
                      <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                       
                        ${eventDetails?.isOnline ? "প্লাটফর্ম" : "স্থান:"}
                      </td>
                      <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                        ${
                          eventDetails?.isOnline
                            ? "অনলাইন"
                            : eventDetails?.location || "পরে জানানো হবে"
                        }
                      </td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      eventDetails?.isOnline &&
                      eventDetails?.zoomLink &&
                      isFreeEvent
                        ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  মিটিং লিংক:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
                                  <a href="${eventDetails.zoomLink}" 
                                     style="color:#3182ce;text-decoration:none;font-weight:500;padding:8px 12px;background-color:#f7fafc;border-radius:6px;display:inline-block;">
                                    মিটিং লিংক
                                  </a>
                                </td>
                              </tr>
                            `
                        : ""
                    }
                  </table>
                  
                  ${
                    isPaidEvent && eventDetails?.slug
                      ? `
                  <!-- Payment Button for PAID events -->
                  <div style="text-align:center;margin:20px 0;">
                    <a target="_blank" href="${baseUrl}/events/${eventDetails.slug}"
                      style="display:inline-block;background-color:#0D9488;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;font-family:'Open Sans', Arial,sans-serif;">
                      পেমেন্ট সম্পন্ন করুন
                    </a>
                  </div>
                  `
                      : isFreeEvent && eventDetails?.slug
                      ? `
                  <!-- Event Details Button for FREE events -->
                  <div style="text-align:center;margin:20px 0;">
                    <a target="_blank" href="${baseUrl}/events/${eventDetails.slug}"
                      style="display:inline-block;background-color:#0D9488;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:15px;font-weight:600;font-family:'Open Sans', Arial,sans-serif;">
                      ইভেন্টের বিস্তারিত দেখুন
                    </a>
                  </div>
                  `
                      : ""
                  }
                </div>
                
                ${
                  isPaidEvent
                    ? `
                <!-- Payment Reminder Notice (Only for PAID events) -->
                <div style="background-color:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:20px;margin:24px 0;">
                  <h3 style="font-size:16px;font-weight:600;margin:0 0 12px 0;font-family:'Open Sans', Arial,sans-serif;color:#92400e;">
                    ⚠️ পেমেন্ট রিমাইন্ডার
                  </h3>
                  <p style="margin:0;font-size:14px;color:#92400e;font-family:'Open Sans', Arial,sans-serif;line-height:1.6;">
                    আপনার ইভেন্ট রেজিস্ট্রেশন নিশ্চিত করতে অনুগ্রহ করে পেমেন্ট সম্পন্ন করুন। 
                    পেমেন্ট না করলে আপনার রেজিস্ট্রেশন বাতিল হয়ে যেতে পারে।
                  </p>
                </div>
                `
                    : ""
                }
                
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  যদি কোনো প্রশ্ন থাকে অথবা সাহায্যের প্রয়োজন হয়, অনুগ্রহ করে <a href="${baseUrl}/contact" style="color:#067df7;text-decoration:none" target="_blank">যোগাযোগ করুন</a>।
                </p>
                
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  শুভেচ্ছাসহ,<br>
                  প্রয়োগিক টিম
                </p>
                
                <!-- Footer -->
                <table
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0;">
                  <tbody>
                    <tr>
                      <td style="text-align:center;">
                        <p style="margin:0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:12px;color:#666;">
                          এই ইমেইলটি 
                          <a href="${baseUrl}" target="_blank" style="color:#4f46e5; text-decoration:none; font-weight:600;">
                            প্রয়োগিক
                          </a> 
                          থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে। অনুগ্রহ করে এই ইমেইলে রিপ্লাই করবেন না।
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
    </html>
    `;
};
