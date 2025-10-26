// @ts-nocheck

export const sendEventRegistrationEmail = (
  email,
  username, // This parameter is kept for compatibility but not used
  password, // This parameter is kept for compatibility but not used
  eventDetails,
  isNewUser = false // This parameter is kept for compatibility but not used
) => {
  let contactUrl = process.env.NEXT_PUBLIC_APP_URL + "/contact";
  function getConsistentBangladeshTime(eventDate: Date | string) {
    const dateObj =
      typeof eventDate === "string" ? new Date(eventDate) : eventDate;
    if (!dateObj) {
      return "Invalid date"; // or any fallback string
    }
    // Create date formatter for Bangladesh timezone
    const timeFormatter = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });

    const dateFormatter = new Intl.DateTimeFormat("bn-BD", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    // Get the hour in Bangladesh timezone for period determination
    const bangladeshHour = parseInt(
      dateObj?.toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        hour12: false,
      })
    );

    const bangladeshMinute = parseInt(
      dateObj.toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        minute: "2-digit",
      })
    );

    let period = "";
    if (bangladeshHour >= 4 && bangladeshHour < 12) {
      period = "সকাল";
    } else if (bangladeshHour >= 12 && bangladeshHour < 16) {
      period = "দুপুর";
    } else if (bangladeshHour >= 16 && bangladeshHour < 19) {
      period = "বিকেল";
    } else {
      period = "রাত";
    }

    // Convert to 12-hour format
    let displayHour = bangladeshHour % 12;
    if (displayHour === 0) displayHour = 12;

    // Format numbers in Bangla
    const numberFormatter = new Intl.NumberFormat("bn-BD");
    const hourText = numberFormatter.format(displayHour);
    const minuteText =
      bangladeshMinute > 0
        ? `:${numberFormatter.format(bangladeshMinute).padStart(2, "০")}`
        : "";

    const timeString = `${period} ${hourText}${minuteText} টা`;
    const dateString = dateFormatter.format(dateObj);

    return { timeString, dateString };
  }

  const { timeString, dateString } = getConsistentBangladeshTime(event?.date);

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
                          হ্যালো,
                        </p>
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          আপনার ইভেন্ট রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!
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
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                তারিখ ও সময়:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                ${
                                  eventDetails?.date
                                    ? `${dateString}, ${timeString}`
                                    : "তারিখ ও সময় নির্ধারণ করা হয়নি"
                                }
                              </td>
                            </tr>
                            ${
                              eventDetails?.type === "PAID" &&
                              eventDetails?.price
                                ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  ফি:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
                                  ৳${eventDetails.price}
                                </td>
                             </tr>
                              `
                                : eventDetails?.type === "EOI"
                                ? `
                                ''
                              `
                                : `
                                <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  ফি:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
                                  <span style="background-color:#10b981;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">ফ্রি</span>
                                </td>
                              </tr>
                            `
                            }
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                স্থান:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                ${
                                  eventDetails?.isOnline
                                    ? "অনলাইন"
                                    : eventDetails?.location ||
                                      "তথ্য পরে জানানো হবে"
                                }
                              </td>
                            </tr>
                            ${
                              eventDetails?.isOnline && eventDetails?.zoomLink
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
                              eventDetails?.type === "EOI"
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
                        
                        <!-- Important Instructions Section -->
                        <div style="background-color:#fef7f0;border:1px solid #fed7aa;border-radius:12px;padding:20px;margin:24px 0;">
                          <h3 style="font-size:16px;font-weight:600;margin:0 0 12px 0;font-family:'Open Sans', Arial,sans-serif;color:#c2410c;">
                            গুরুত্বপূর্ণ নির্দেশনা
                          </h3>
                          <ul style="margin:0;padding-left:20px;font-size:14px;color:#7c2d12;font-family:'Open Sans', Arial,sans-serif;line-height:1.6;">
                            <li style="margin-bottom:8px;">ইভেন্টের আগে আপনার ইমেইল চেক করুন যেকোনো আপডেটের জন্য</li>
                            <li style="margin-bottom:8px;">ইভেন্টের দিন সময়মতো উপস্থিত থাকুন</li>
                            ${
                              eventDetails?.isOnline
                                ? '<li style="margin-bottom:8px;">অনলাইন ইভেন্টের জন্য একটি স্থিতিশীল ইন্টারনেট সংযোগ নিশ্চিত করুন</li>'
                                : '<li style="margin-bottom:8px;">অফলাইন ইভেন্টের জন্য ভেন্যুর ঠিকানা এবং পথ নির্দেশনা আগে থেকেই জেনে নিন</li>'
                            }
                          </ul>
                        </div>
                        
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          যদি আপনার প্রয়োগিক প্ল্যাটফর্মে অ্যাকাউন্ট না থাকে, তাহলে একটি নতুন ইমেইল পাবেন যেখানে লগইন তথ্য থাকবে।
                        </p>
                        
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          যদি কোনো প্রশ্ন থাকে অথবা সাহায্যের প্রয়োজন হয়, অনুগ্রহ করে <a href="${contactUrl}" style="color:#067df7;text-decoration:none" target="_blank">যোগাযোগ করুন</a>।
                        </p>
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          ইভেন্টে আপনাকে দেখার অপেক্ষায় রইলাম!
                        </p>
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
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
                                  এই ইমেইলটি ${
                                    process.env.NEXT_PUBLIC_APP_URL
                                  } থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
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
