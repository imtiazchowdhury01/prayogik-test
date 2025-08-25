// @ts-nocheck
/**
 * Template for course enrollment notification email
 * @param userEmail - User's email address
 * @param userName - User's name
 * @param enrolledCourses - Array of course objects with title and slug
 * @param baseUrl - Application base URL
 * @returns HTML email template
 */
export const courseEnrollmentNotificationTemplate = (
  userEmail: string,
  userName: string,
  enrolledCourses: { title: string; slug: string }[],
  baseUrl: string
) => {
  const courseList = enrolledCourses.map(course => `
    <li style="margin:8px 0;">
      <a href="${baseUrl}/courses/${course.slug}" 
         style="color:#14b8a9;text-decoration:underline;">
        ${course.title}
      </a>
    </li>
  `).join('');

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="bn">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>কোর্স এনরোলমেন্ট নিশ্চিতকরণ - প্রায়োগিক</title>
      </head>
      <body style="background-color:#f6f9fc;padding:10px 0">
        <div
          style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
          আপনি নতুন কোর্সে এনরোল করেছেন - প্রায়োগিক
          <div></div>
        </div>
        <table
          align="center"
          width="100%"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="max-width:37.5em;background-color:#ffffff;border:1px solid #f0f0f0;padding:30px">
          <tbody>
            <tr style="width:100%">
              <td>
                <img
                  alt="Prayogik"
                  height="33"
                  src="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png"
                  style="display:block;outline:none;border:none;text-decoration:none" />
                
                <!-- Header -->
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background-color:#115e57;border-radius:8px;margin:20px 0;padding:18px;">
                  <tbody>
                    <tr>
                      <td>
                        <h1 style="color:#ffffff;text-align:center;margin:0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:18px;font-weight:semibold;">
                          কোর্স এনরোলমেন্ট নিশ্চিতকরণ
                        </h1>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation">
                  <tbody>
                    <tr>
                      <td>
                        <p
                          style="font-size:18px;line-height:28px;margin:20px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:400;color:#115e57">
                          প্রিয় ${userName},
                        </p>
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          অভিনন্দন! নিম্মোক্ত কোর্সে আপনার এনরোলমেন্ট সফল হয়েছে:
                        </p>
                        
                        <!-- Enrolled Courses Box -->
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="background-color:#f0fdfc;border-radius:8px;margin:25px 0;padding:20px;">
                          <tbody>
                            <tr>
                              <td>
                                <h3 style="margin:0 0 15px 0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:18px;font-weight:600;color:#115e57;">
                                    আপনার ${enrolledCourses.length > 1 ? 'কোর্সসমূহ' : 'কোর্স'}:
                                </h3>
                                <ul style="margin:10px 0;padding-left:20px;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:15px;line-height:24px;color:#404040 !important;">
                                    ${courseList}
                                </ul>
                            </td>
                            </tr>
                          </tbody>
                        </table>

                        <p
                          style="font-size:16px;line-height:26px;margin:20px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          এখনই আপনার অ্যাকাউন্টে <a href="${baseUrl}/signin" style="color:#14b8a9;text-decoration:underline;">লগইন</a> করে শেখা শুরু করুন!
                        </p>

                        <p
                          style="font-size:16px;line-height:26px;margin:30px 0 20px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:400;color:#115e57">
                          শুভেচ্ছা,<br>
                          <strong>প্রায়োগিক টিম</strong>
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
                                  এই ইমেইলটি ${baseUrl} থেকে স্বয়ংক্রিয়ভাবে পাঠানো হয়েছে।
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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