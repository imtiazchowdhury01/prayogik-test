export const resetPasswordTemplate = (
  email: string,
  name: string,
  password: string
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
                      <div
                        style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
                        আপনার পাসওয়ার্ড রিসেট করা হয়েছে – প্রয়োগিক
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
                                src="./prayogik-nav-logo.svg"
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
                                        হ্যালো ${name},
                                      </p>
                                      <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                        আপনার পাসওয়ার্ড ‘প্রয়োগিক’-এর অ্যাডমিন দ্বারা রিসেট করা হয়েছে।
                                      </p>
                                      <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                        আপনার আপডেট করা লগইন তথ্যসমূহ নিচে দেওয়া হলো:
                                      </p>
                                      <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                        <strong>লগইন URL:</strong> <a href="${process.env.NEXT_PUBLIC_APP_URL}/signin" style="color:#067df7;text-decoration:underline;font-weight:600;">${process.env.NEXT_PUBLIC_APP_URL}/signin</a><br>
                                        <strong>ইমেইল:</strong> ${email}<br>
                                        <strong>পাসওয়ার্ড:</strong> ${password}
                                      </p>
                                      <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                        আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করার জন্য, এই তথ্য কারো সাথে শেয়ার করবেন না। লগইন করার পর পাসওয়ার্ড পরিবর্তন করার পরামর্শ দেওয়া হচ্ছে।
                                      </p>
                                      <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                        If you have any questions or need assistance, feel free to <a href="${contactUrl}" style="color:#067df7;text-decoration:none" target="_blank">যোগাযোগ করুন</a>
                                      </p>
                                      <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                        শুভ অধ্যয়ন!
                                      </p>
                                      <p
                                        style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                                        শুভেচ্ছাসহ,<br>
                                        প্রয়োগিক টিম
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
