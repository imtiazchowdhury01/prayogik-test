export const resetEmailTemplate = (resetUrl: string, contactUrl: string) => {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html dir="ltr" lang="en">
        <head>
            <link
            rel="preload"
            as="image"
            href="https://prayogik-files-bucket.s3.us-east-1.amazonaws.com/685790643134bb610de5d957/1750831073066-prayogik-nav-logo.png" />
            <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
            <meta name="x-apple-disable-message-reformatting" />
            <!--$-->
        </head>
        <body style="background-color:#f6f9fc;padding:10px 0">
            <div
            style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
            প্রয়োগিক-এ আপনার পাসওয়ার্ড রিসেট করা হয়েছে
            <div>
            
            </div>
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
                    style="display:block;outline:none;border:none;text-decoration:none"
                    />
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
                            style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                            হ্যালো,
                            </p>
                            <p
                            style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                            সম্প্রতি কেউ আপনার প্রয়োগিক অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তনের জন্য অনুরোধ করেছে। যদি এটা আপনার পক্ষ থেকে হয়ে থাকে, তাহলে আপনি নিচের লিঙ্ক থেকে নতুন পাসওয়ার্ড সেট করতে পারেন:
                            </p>
                            
                            <!-- RESET_LINK-->
                            <a
                            href=${resetUrl}
                            style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#18918B;border-radius:4px;color:#fff;font-family:&#x27;Open Sans&#x27;, &#x27;Helvetica Neue&#x27;, Arial;font-size:15px;text-align:center;width:210px;padding:14px 7px 14px 7px"
                            target="_blank"
                            ><span
                                ><!--[if mso]><i style="mso-font-width:350%;mso-text-raise:21" hidden>&#8202;</i><![endif]--></span
                            ><span
                                style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:10.5px"
                                >পাসওয়ার্ড রিসেট করুন</span
                            ><span
                                ><!--[if mso]><i style="mso-font-width:350%" hidden>&#8202;&#8203;</i><![endif]--></span
                            ></a
                            >
                            <p
                            style="font-size:16px;line-height:26px;margin:16px 0;font-family:&#x27;Open Sans&#x27;, &#x27;HelveticaNeue-Light&#x27;, &#x27;Helvetica Neue Light&#x27;, &#x27;Helvetica Neue&#x27;, Helvetica, Arial, &#x27;Lucida Grande&#x27;, sans-serif;font-weight:300;color:#404040">
                             যদি আপনি পাসওয়ার্ড পরিবর্তন করতে না চান অথবা এরকম কোনো অনুরোধ করেননি, তাহলে এই মেসেজটি উপেক্ষা করে মুছে ফেলুন।
                            </p>
                            <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                               সাহায্যের প্রয়োজন? <a href=${contactUrl} style="color:#067df7;text-decoration-line:none;text-decoration:underline; cursor: pointer;" target="_blank">যোগাযোগ করুন</a> অথবা contact@prayogik.com এ ইমেইল করুন।
                            </p>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </td>
                </tr>
            </tbody>
            </table>
            <!--/$-->
        </body>
        </html>`;
};
