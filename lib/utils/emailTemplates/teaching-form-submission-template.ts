interface CourseProposal {
  category: string;
  courseTitle: string;
  courseDetails: string;
}

export const teachingFormSubmissionTemplate = (
  name: string,
  email: string,
  message: string,
  phone: string,
  facebookUrl: string,
  linkedinUrl: string,
  youtubeUrl: string,
  websiteUrl: string,
  courseProposals: CourseProposal[],
  baseUrl: string
) => {
  // কোর্স প্রস্তাবনা HTML
  const courseProposalsHtml = courseProposals.length
    ? `
    <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
      <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
        কোর্স প্রস্তাবনা
      </h3>
      <table width="100%" border="0" cellpadding="0" cellspacing="0">
        ${courseProposals
          ?.map(
            (proposal, index) => `
              <tr>
                <td colspan="2" style="padding:16px 0;">
                  <div style="background-color:#f7fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;">
                    <div style="margin-bottom:8px;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
                      <strong>প্রস্তাবনা-${index + 1}</strong>
                    </div>
                    <div style="margin-bottom:8px;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
                      <strong>ক্যাটেগরি:</strong> ${proposal.category}
                    </div>
                    <div style="margin-bottom:8px;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
                      <strong>কোর্স টাইটেল:</strong> ${proposal.courseTitle}
                    </div>
                    <div style="font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;line-height:24px;">
                      <strong>কোর্স বিস্তারিত:</strong><br/>${proposal.courseDetails.replace(
                        /\n/g,
                        "<br/>"
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            `
          )
          .join("")}
      </table>
    </div>
  `
    : "";

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
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          একটি নতুন শিক্ষকতার আবেদন জমা দেওয়া হয়েছে।
                        </p>
                        
                        <!-- User Information Section -->
                        <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
                          <h3 style="font-size:18px;font-weight:600;margin:0 0 20px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;border-bottom:1px solid #e1e5e9;padding-bottom:12px;">
                            ব্যবহারকারীর তথ্য
                          </h3>
                          <table width="100%" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;width:35%;">
                                নাম:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                ${name}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                ইমেইল:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                <a href="mailto:${email}" style="color:#3182ce;text-decoration:none;">${email}</a>
                              </td>
                            </tr>
                            ${
                              phone
                                ? `
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                ফোন নম্বর:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;font-weight:500;">
                                <a href="tel:${phone}" style="color:#3182ce;text-decoration:none;">${phone}</a>
                              </td>
                            </tr>
                            `
                                : ""
                            }
                            ${
                              facebookUrl
                                ? `
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;vertical-align:top;">
                                ফেসবুক প্রোফাইল:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
                                <a href="${facebookUrl}" target="_blank" style="color:#3182ce;text-decoration:none;word-break:break-all;">${facebookUrl}</a>
                              </td>
                            </tr>
                            `
                                : ""
                            }
                            ${
                              linkedinUrl
                                ? `
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;vertical-align:top;">
                                লিংকডইন প্রোফাইল:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
                                <a href="${linkedinUrl}" target="_blank" style="color:#3182ce;text-decoration:none;word-break:break-all;">${linkedinUrl}</a>
                              </td>
                            </tr>
                            `
                                : ""
                            }
                            ${
                              youtubeUrl
                                ? `
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;vertical-align:top;">
                                ইউটিউব চ্যানেল:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
                                <a href="${youtubeUrl}" target="_blank" style="color:#3182ce;text-decoration:none;word-break:break-all;">${youtubeUrl}</a>
                              </td>
                            </tr>
                            `
                                : ""
                            }
                            ${
                              websiteUrl
                                ? `
                            <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;vertical-align:top;">
                                ওয়েবসাইট:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;">
                                <a href="${websiteUrl}" target="_blank" style="color:#3182ce;text-decoration:none;word-break:break-all;">${websiteUrl}</a>
                              </td>
                            </tr>
                            `
                                : ""
                            }
                            ${
                              message
                                ? `
                                <tr>
                              <td style="padding:12px 0;font-size:15px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-weight:500;vertical-align:top;">
                                বিস্তারিত বার্তা:
                              </td>
                              <td style="padding:12px 0;font-size:15px;color:#2d3748;font-family:'Open Sans', Arial,sans-serif;line-height:24px;">
                                ${message.replace(/\n/g, "<br/>")}
                              </td>
                            </tr>
                                `
                                : ""
                            }

                          </table>
                        </div>
                         ${courseProposalsHtml}
                        
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          অনুগ্রহ করে আবেদনটি পর্যালোচনা করুন এবং প্রয়োজনীয় ব্যবস্থা গ্রহণ করুন।
                        </p>
                        
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          ধন্যবাদ,<br>
                          প্রয়োগিক সিস্টেম
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
                                  <a href="${
                                    process.env.NEXT_PUBLIC_APP_URL
                                  }" target="_blank" style="color:#4f46e5; text-decoration:none; font-weight:600;">
                                    Prayogik
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
