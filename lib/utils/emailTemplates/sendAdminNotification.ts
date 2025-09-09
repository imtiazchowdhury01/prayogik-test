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
                        
//                         <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
//                           প্রিয় অ্যাডমিন,
//                         </p>
                        
//                         <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
//                           ${
//                             isNewUser
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
//                             পেমেন্ট বিবরণ
//                           </h3>
//                           <table width="100%" border="0" cellpadding="0" cellspacing="0">
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
//                                 পেমেন্ট তারিখ:
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
//                               <td style="text-align:center;">
//                                 <p style="margin:0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:12px;color:#666;">
//                                   এই ইমেইলটি ${
//                                     process.env.NEXT_PUBLIC_APP_URL
//                                   } থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
//                                 </p>
//                               </td>
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


// @ts-nocheck

export const sendAdminNotification = (
  userEmail,
  username,
  isNewUser,
  purchaseDetailsForEmail
) => {
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
                          প্রিয় অ্যাডমিন,
                        </p>
                        
                        <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          ${
                            purchaseDetailsForEmail?.purchaseType === "EVENT"
                              ? isNewUser
                                ? `একজন নতুন ব্যবহারকারী সফলভাবে একটি ইভেন্টে নিবন্ধন করেছে এবং পেমেন্ট সম্পন্ন করেছে।`
                                : `একজন ব্যবহারকারী সফলভাবে একটি ইভেন্টে নিবন্ধন করেছে।`
                              : isNewUser
                              ? `একজন নতুন ব্যবহারকারী সফলভাবে নিবন্ধন করেছে এবং পেমেন্ট সম্পন্ন করেছে।`
                              : `সিস্টেমে একটি নতুন এনরোলমেন্ট এবং ট্রান্সেকশন সফলভাবে সম্পন্ন হয়েছে।`
                          }
                        </p>
                        
                        <!-- User Details Section -->
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
                                    ? '<span style="background-color:#48bb78;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">নতুন ব্যবহারকারী</span>'
                                    : '<span style="background-color:#3182ce;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">বর্তমান ব্যবহারকারী</span>'
                                }
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                ইমেইল:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
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
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                ${username}
                              </td>
                            </tr>
                            `
                                : ""
                            }
                          </table>
                        </div>
                        
                        <!-- Purchase Details Section -->
                        <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
                          <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
                            ${
                              purchaseDetailsForEmail?.purchaseType === "EVENT"
                                ? "ইভেন্ট নিবন্ধন বিবরণ"
                                : "পেমেন্ট বিবরণ"
                            }
                          </h3>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            ${
                              purchaseDetailsForEmail?.eventName
                                ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  ইভেন্ট:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:600;">
                                  ${purchaseDetailsForEmail.eventName}
                                </td>
                              </tr>
                            `
                                : ""
                            }
                            ${
                              purchaseDetailsForEmail?.eventDate
                                ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  ইভেন্টের তারিখ:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                  ${new Date(
                                    purchaseDetailsForEmail.eventDate
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
                              purchaseDetailsForEmail?.eventType
                                ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  ইভেন্টের ধরন:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                  ${purchaseDetailsForEmail.eventType}
                                </td>
                              </tr>
                            `
                                : ""
                            }
                            ${
                              purchaseDetailsForEmail?.isOnlineEvent !== undefined
                                ? `
                              <tr>
                                <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                  ইভেন্ট মাধ্যম:
                                </td>
                                <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                  ${
                                    purchaseDetailsForEmail.isOnlineEvent
                                      ? '<span style="background-color:#10b981;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">অনলাইন</span>'
                                      : '<span style="background-color:#f59e0b;color:white;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;">অফলাইন</span>'
                                  }
                                </td>
                              </tr>
                            `
                                : ""
                            }
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
                            ${
                              purchaseDetailsForEmail?.purchaseId
                                ? `
                                    <tr>
                                    <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                        ক্রয় আইডি:
                                    </td>
                                    <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                        ${purchaseDetailsForEmail.purchaseId}
                                    </td>
                                    </tr>
                                `
                                : ""
                            }
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;vertical-align:top;">
                                ${
                                  purchaseDetailsForEmail?.purchaseType ===
                                  "EVENT"
                                    ? "নিবন্ধনের তারিখ:"
                                    : "পেমেন্ট তারিখ:"
                                }
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
                                <a href="${process.env.NEXT_PUBLIC_APP_URL}" target="_blank" style="color:#4f46e5; text-decoration:none; font-weight:600;">
                                  প্রায়োগিক
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