export const verifyEmailTemplate = (
  verificationUrl: string,
  contactUrl: string
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
                    <div
                      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
                      প্রয়োগিক-এর জন্য আপনার ইমেইল যাচাই করুন
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
                                      প্রিয় ইউজার,
                                    </p>
                                    <p
                                      style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                      প্রয়োগিক-এ নিবন্ধনের জন্য আপনাকে ধন্যবাদ! অনুগ্রহ করে নিচের বাটনে ক্লিক করে আপনার ইমেইল ঠিকানা যাচাই করুন:
                                    </p>
                                    <!-- VERIFY_LINK -->
                                    <a
                                      href=${verificationUrl}
                                      style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#18918B;border-radius:4px;color:#fff;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:15px;text-align:center;width:210px;padding:14px 7px 14px 7px"
                                      target="_blank">
                                      <span>ইমেইল যাচাই করুন</span>
                                    </a>
                                    <p
                                      style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                      যদি আপনি এই অ্যাকাউন্টটি তৈরি না করে থাকেন, তাহলে অনুগ্রহ করে এই ইমেইলটি উপেক্ষা করুন।
                                    </p>
                                    <p
                                      style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                      কোন সাহায্য প্রয়োজন? <a href=${contactUrl} style="color:#067df7;text-decoration-line:none;text-decoration:underline" target="_blank">যোগাযোগ করুন</a> অথবা contact@prayogik.com এ ইমেইল করুন।
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
