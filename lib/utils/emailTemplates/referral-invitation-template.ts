// lib/email-templates/referral-invitation-template.ts
export const referralInvitationTemplate = (
  senderName: string,
  referralLink: string,
  baseUrl: string
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
                  হ্যালো,
                </p>
                
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  আপনাকে <strong>প্রয়োগিক</strong> প্ল্যাটফর্মে যোগ দেওয়ার জন্য আমন্ত্রণ জানিয়েছেন! 
                </p>
                
                <!-- Invitation Card -->
                <div style="background-color:#ffffff;border:1px solid #e1e5e9;border-radius:12px;padding:24px;margin:24px 0;box-shadow:0 2px 4px rgba(0,0,0,0.04);">
                  <h3 style="font-size:20px;font-weight:600;margin:0 0 16px 0;font-family:'Open Sans', Arial,sans-serif;color:#1a202c;text-align:center;">
                    🎉 বিশেষ আমন্ত্রণ 🎉
                  </h3>
                  
                  <p style="font-size:15px;line-height:24px;margin:16px 0;font-family:'Open Sans', Arial,sans-serif;color:#4a5568;text-align:center;">
                    প্রয়োগিক হলো একটি অসাধারণ প্ল্যাটফর্ম যেখানে আপনি বিভিন্ন ইভেন্ট, ওয়ার্কশপ এবং সেমিনারে অংশগ্রহণ করতে পারবেন।
                  </p>
                  
                  <!-- Benefits Section -->
                  <div style="background-color:#f7fafc;border-radius:8px;padding:20px;margin:20px 0;">
                    <h4 style="font-size:16px;font-weight:600;margin:0 0 12px 0;font-family:'Open Sans', Arial,sans-serif;color:#2d3748;">
                      যোগদানের সুবিধাসমূহ:
                    </h4>
                    <ul style="margin:0;padding-left:20px;color:#4a5568;font-family:'Open Sans', Arial,sans-serif;font-size:14px;line-height:22px;">
                      <li style="margin:8px 0;">✅ বিনামূল্যে ট্রায়াল অ্যাক্সেসের সুবিধা</li>
                      <li style="margin:8px 0;">✅ কন্টেন্ট এবং রিসোর্সে অ্যাক্সেস</li>
                      <li style="margin:8px 0;">✅ রেফারেল বোনাস এবং রিওয়ার্ড</li>
                    </ul>
                  </div>
                  
                  <!-- CTA Button -->
                  <div style="text-align:center;margin:30px 0;">
                    <a target="_blank" href="${referralLink}"
                      style="display:inline-block;background-color:#0D9488;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;font-family:'Open Sans', Arial,sans-serif;box-shadow:0 2px 4px rgba(13,148,136,0.2);">
                      এখনই যোগ দিন
                    </a>
                  </div>
                </div>
                
                
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  আমরা আপনাকে আমাদের কমিউনিটিতে স্বাগত জানাতে উন্মুখ!
                </p>
                
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
                  যদি কোনো প্রশ্ন থাকে, অনুগ্রহ করে <a href="${baseUrl}/contact" style="color:#067df7;text-decoration:none" target="_blank">যোগাযোগ করুন</a>।
                </p>
                
                <p style="font-size:16px;line-height:26px;margin:16px 0;font-family:'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif;font-weight:300;color:#404040">
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
                        <p style="margin:0 0 8px 0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:12px;color:#999;">
                          ${senderName} এর পক্ষ থেকে পাঠানো
                        </p>
                        <p style="margin:0;font-family:'Open Sans', 'Helvetica Neue', Arial;font-size:12px;color:#666;">
                          এই ইমেইলটি 
                          <a href="${baseUrl}" target="_blank" style="color:#4f46e5; text-decoration:none; font-weight:600;">
                            প্রয়োগিক
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