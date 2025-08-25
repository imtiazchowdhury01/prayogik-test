export const contactFormSubmissionTemplate = (
  name: string,
  email: string,
  subject: string,
  message: string,
  baseUrl: string
) => {
  return `<!DOCTYPE html>
  <html dir="ltr" lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="x-apple-disable-message-reformatting" />
    </head>
    <body style="background-color:#f4f7fa;padding:30px;font-family:'Arial', sans-serif;">
      <table
        align="center"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="max-width:600px;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1);padding:30px;border:1px solid #e1e1e1;">
        <tbody>
          <tr>
            <td style="text-align:left;padding-bottom:20px;">
              <h2 style="color:#333;margin-bottom:10px;font-size:22px;font-weight:600;">
                যোগাযোগ ফর্ম থেকে প্রাপ্ত তথ্য
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #ddd;">
              <strong style="color:#333;">নাম</strong>
              <p style="color:#555;margin-top:5px;">${name}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 0 20px 0;border-bottom:1px solid #ddd;">
              <strong style="color:#333;">ইমেইল</strong>
              <p style="color:#0073e6;margin-top:5px;"><a href="mailto:${email}" style="color:#0073e6;text-decoration:none;">${email}</a></p>
            </td>
          </tr>
          
          <tr>
            <td style="padding:28px 0 20px 0;border-bottom:1px solid #ddd;">
              <strong style="color:#333;">বিষয়</strong>
              <p style="color:#555;margin-top:5px;">${subject}</p>
            </td>
          </tr>
          
          <tr>
            <td style="padding:28px 0 20px 0;">
              <strong style="color:#333;">মেসেজ</strong>
              <p style="color:#555;margin-top:5px;">${message.replace(
                /\n/g,
                "<br>"
              )}</p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding-top:20px;color:#888;font-size:12px;">
              পাঠানো হয়েছে <a href=${baseUrl} style="color:#0073e6;text-decoration:none;">প্রয়োগিক</a> থেকে
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>`;
};
