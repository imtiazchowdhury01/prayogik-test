// @ts-nocheck

export const sendSubscriptionCredential = (
  email,
  username,
  password,
  purchaseDetailsForEmail
) => {
  let contactUrl = process.env.NEXT_PUBLIC_APP_URL + "/contact";
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
                  style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:45px">
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
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">অ্যাডমিন কর্তৃক আপনার প্রয়োগিক প্ল্যাটফর্মে অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে। প্ল্যাটফর্মে স্বাগতম!
                        </p>
                        <p
                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                        শুরু করতে নিচে আপনার লগইন তথ্য দেওয়া হলো:
                        </p>
                        
                        <!-- Updated Account Details Section with modern, clean design -->
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
                                <a href="${
                                  process.env.NEXT_PUBLIC_APP_URL
                                }/signin" 
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
                        
                        <!-- Updated Enrollment Details Section with modern, clean design -->
                        <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
                          <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
                            এনরোলমেন্ট বিবরণ
                          </h3>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            ${
                              purchaseDetailsForEmail?.courseName
                                ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  কোর্স:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                  ${purchaseDetailsForEmail.courseName}
                                </td>
                              </tr>
                            `
                                : ""
                            }
                            ${
                              purchaseDetailsForEmail?.subscriptionPlanName
                                ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  সাবস্ক্রিপশন প্ল্যান:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                  ${
                                    purchaseDetailsForEmail.subscriptionPlanName
                                  }
                                  ${
                                    purchaseDetailsForEmail?.isTrial
                                      ? ' <span style="background-color:#fd9a31;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;margin-left:8px;">ট্রায়াল</span>'
                                      : ""
                                  }
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
                                  ${
                                    purchaseDetailsForEmail?.isTrial
                                      ? "ট্রায়াল শেষ:"
                                      : "মেয়াদ শেষ:"
                                  }
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                  ${new Date(
                                    purchaseDetailsForEmail.expiresAt
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
                              purchaseDetailsForEmail?.amount &&
                              purchaseDetailsForEmail.amount > 0
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
                              purchaseDetailsForEmail?.purchaseType !== "TRIAL"
                                ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  পেমেন্ট মাধ্যম:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                  বিকাশ
                                </td>
                              </tr>
                            `
                                : `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  পেমেন্ট মাধ্যম:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                  ফ্রি ট্রায়াল
                                </td>
                              </tr>
                            `
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
                        
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করার জন্য, অনুগ্রহ করে লগইন করে দ্রুত আপনার পাসওয়ার্ড পরিবর্তন করুন।
                        </p>
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          যদি কোনো প্রশ্ন থাকে অথবা সাহায্যের প্রয়োজন হয়, অনুগ্রহ করে <a href="${contactUrl}" style="color:#067df7;text-decoration:none" target="_blank">যোগাযোগ করুন</a>।
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
