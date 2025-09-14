// @ts-nocheck

export const sendCredentialTemplate = (email, username, password) => {
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
                        <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          অ্যাডমিন আপনার জন্য প্রয়োগিক-এ একটি অ্যাকাউন্ট তৈরি করেছেন। আপনার লগইন তথ্য নিচে দেওয়া হলো:
                        </p>
                        <p style="font-size:16px;color:#404040;font-family:'Open Sans', Arial,sans-serif;">
                          <strong>লগইন URL:</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL}/signin" style="color:#067df7;text-decoration:underline;font-weight:600;">${process.env.NEXT_PUBLIC_APP_URL}/signin</a>
                        </p>
                        <p style="font-size:16px;color:#404040;font-family:'Open Sans', Arial,sans-serif;"><strong>ইমেইল:</strong> ${email}</p>
                        <p style="font-size:16px;color:#404040;font-family:'Open Sans', Arial,sans-serif;"><strong>পাসওয়ার্ড:</strong> ${password}</p>
                        <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          আপনি এই অনুরোধ না করলে, এই ইমেইলটি উপেক্ষা করুন।
                        </p>
                        <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে, এই তথ্য কারো সাথে শেয়ার করবেন না।
                        </p>
                        <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          সাহায্যের জন্য <a href="mailto:contact@prayogik.com" style="color:#067df7;text-decoration:underline;">যোগাযোগ করুন</a>
                        </p>
                        <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                          শুভ অধ্যয়ন!
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </body>
            </html>`;
};
