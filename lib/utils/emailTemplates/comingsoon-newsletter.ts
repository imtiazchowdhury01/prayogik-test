// Newsletter Email Templates

/**
 * Template for admin notification when someone subscribes to newsletter
 * @param email - Subscriber's email address
 * @param baseUrl - Application base URL
 * @param timestamp - Subscription timestamp (optional)
 * @returns HTML email template
 */
export const newsletterAdminNotificationTemplate = (
  email: string,
  baseUrl: string,
  timestamp?: string
) => {
  const subscriptionTime = timestamp || new Date().toLocaleString("bn-BD");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="bn">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>নতুন নিউজলেটার সাবস্ক্রিপশন</title>
      </head>
      <body style="background-color:#f6f9fc;padding:10px 0">
        <div
          style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
          নতুন নিউজলেটার সাবস্ক্রিপশন - প্রায়োগিক
          <div></div>
        </div>
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
                
                <!-- Header -->
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background-color:#115e57;border-radius:8px;margin:20px 0;padding:20px;">
                  <tbody>
                    <tr>
                      <td>
                        <h1 style="color:#ffffff;text-align:center;margin:0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:24px;font-weight:bold;">
                          নতুন নিউজলেটার সাবস্ক্রিপশন
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
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          প্রিয় অ্যাডমিন,
                        </p>
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          একজন নতুন ইউজার আপনার "শীঘ্রই আসছে" পৃষ্ঠা থেকে নিউজলেটারে সাবস্ক্রাইব করেছেন।
                        </p>
                        
                        <!-- Subscriber Info Box -->
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="background-color:#f8f9fa;border-left:4px solid #14b8a9;border-radius:4px;margin:20px 0;padding:20px;">
                          <tbody>
                            <tr>
                              <td>
                                <h3 style="margin:0 0 15px 0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:18px;font-weight:600;color:#115e57;">
                                  সাবস্ক্রাইবারের তথ্য:
                                </h3>
                                <p style="margin:8px 0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:14px;color:#404040;">
                                  <strong>ইমেইল:</strong> <span style="color:#14b8a9;font-weight:500;">${email}</span>
                                </p>
                                <p style="margin:8px 0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:14px;color:#404040;">
                                  <strong>সাবস্ক্রিপশনের সময়:</strong> ${subscriptionTime}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          অনুগ্রহ করে এই ইমেইলটি আপনার নিউজলেটার মেইলিং লিস্টে যোগ করুন।
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

/**
 * Template for subscriber confirmation email
 * @param subscriberEmail - Subscriber's email address
 * @param baseUrl - Application base URL
 * @param contactUrl - Contact page URL (optional)
 * @returns HTML email template
 */
export const newsletterSubscriberConfirmationTemplate = (
  subscriberEmail: string,
  baseUrl: string,
  contactUrl?: string
) => {
  const contactLink = contactUrl || `${baseUrl}/contact`;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html dir="ltr" lang="bn">
      <head>
        <link
          rel="preload"
          as="image"
          href="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png" />
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>স্বাগতম প্রায়োগিকে!</title>
      </head>
      <body style="background-color:#f6f9fc;padding:10px 0">
        <div
          style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
          স্বাগতম প্রায়োগিকে! নিউজলেটার সাবস্ক্রিপশন নিশ্চিত হয়েছে।
          <div></div>
        </div>
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
                
                <!-- Header -->
                <table
                  align="center"
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="background-color:#115e57;border-radius:8px;margin:20px 0;padding:30px;">
                  <tbody>
                    <tr>
                      <td>
                        <h1 style="color:#ffffff;text-align:center;margin:0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:28px;font-weight:bold;">
                          স্বাগতম প্রায়োগিকে!
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
                          ধন্যবাদ আমাদের সাথে থাকার জন্য!
                        </p>
                        <p
                          style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          আমরা শীঘ্রই আমাদের নতুন প্ল্যাটফর্ম নিয়ে আসছি। আপনি যখন আমাদের নিউজলেটারে সাবস্ক্রাইব করেছেন, তখন আমরা আপনাকে সর্বপ্রথম জানিয়ে দেব।
                        </p>
                        
                        <!-- Features Box -->
                        <table
                          width="100%"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="background-color:#f0fdfc;border-radius:8px;margin:25px 0;padding:25px;">
                          <tbody>
                            <tr>
                              <td>
                                <h3 style="margin:0 0 15px 0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:18px;font-weight:600;color:#115e57;">
                                  কী আশা করতে পারেন:
                                </h3>
                                <ul style="margin:10px 0;padding-left:20px;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:15px;line-height:24px;color:#404040;">
                                  <li style="margin:8px 0;">উন্নত অনলাইন কোর্স</li>
                                  <li style="margin:8px 0;">ইন্টারঅ্যাক্টিভ লার্নিং অভিজ্ঞতা</li>
                                  <li style="margin:8px 0;">বিশেষজ্ঞ শিক্ষকদের গাইডেন্স</li>
                                  <li style="margin:8px 0;">এবং আরও অনেক কিছু!</li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p
                          style="font-size:16px;line-height:26px;margin:20px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          ধৈর্য ধরে অপেক্ষা করার জন্য ধন্যবাদ।
                        </p>

                        <p
                          style="font-size:16px;line-height:26px;margin:25px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          কোনো প্রশ্ন থাকলে? <a href="${contactLink}" style="color:#14b8a9;text-decoration:none;font-weight:500;" target="_blank">আমাদের সাথে যোগাযোগ করুন</a> অথবা contact@prayogik.com এ ইমেইল করুন।
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
                                  © ২০২৫ প্রায়োগিক। সকল অধিকার সংরক্ষিত। <br>
                                  আপনি এই ইমেইলটি পেয়েছেন কারণ আপনি ${subscriberEmail} ঠিকানা দিয়ে আমাদের নিউজলেটারে সাবস্ক্রাইব করেছেন।
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
