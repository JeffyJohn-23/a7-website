// Source: orion-rare-rabbit-voucher-email.html (Orion Model Hunt × Rare Rabbit).
// Per-recipient tokens, filled in by renderTemplate():
//   {{FIRST_NAME}}         first word of the sheet's Name column
//   {{VOUCHER_CODE}}       the recipient's own code from the voucher sheet
//   {{IMG_ORION_BANNER}}   absolute URL of public/orion/banner.jpg (the source
//                          embedded it as base64, which Gmail strips)

export const ORION_VOUCHER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>Your Rare Rabbit collaboration gift – Orion Model Hunt 2026</title>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:#e9e9e9;}
  @media (max-width:620px){
    .wrap{width:100%!important;}
    .pad{padding-left:24px!important;padding-right:24px!important;}
    .code{font-size:30px!important;letter-spacing:4px!important;}
    .h1{font-size:30px!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#e9e9e9;">
<div style="display:none;max-height:0;overflow:hidden;">A thank-you from A7 Entertainment &amp; Parker Models — your Rare Rabbit voucher is inside.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e9e9e9;">
<tr><td align="center" style="padding:32px 12px;">

<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;background:#000000;">

  <!-- Banner -->
  <tr><td style="padding:0;">
    <img src="{{IMG_ORION_BANNER}}" width="600" alt="Orion Model Hunt 2026 — A7 Entertainment &amp; Parker Models" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
  </td></tr>

  <!-- Arc divider echoing the logo -->
  <tr><td align="center" style="padding:0 60px;">
    <div style="height:1px;background:#3a3a3a;line-height:1px;font-size:1px;">&nbsp;</div>
  </td></tr>

  <!-- Greeting + message -->
  <tr><td class="pad" style="padding:44px 56px 8px 56px;font-family:'Montserrat',Arial,Helvetica,sans-serif;color:#ffffff;">
    <p style="margin:0 0 22px 0;font-size:15px;line-height:24px;color:#bdbdbd;">Hi {{FIRST_NAME}},</p>
    <h1 class="h1" style="margin:0 0 22px 0;font-family:'Oswald','Arial Narrow',Arial,sans-serif;font-weight:600;font-size:38px;line-height:44px;letter-spacing:1px;color:#ffffff;">Thank you for the content you created.</h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:25px;color:#e6e6e6;">Your audition task at the Rare Rabbit store gave us some beautiful work — confident, stylish and exactly the energy we hoped Orion would bring out. We're grateful for your time, your effort and your support of the Model Hunt.</p>
    <p style="margin:0 0 0 0;font-size:15px;line-height:25px;color:#e6e6e6;">As a token of thanks for this collaboration, here's a gift from us and Rare Rabbit.</p>
  </td></tr>

  <!-- Voucher -->
  <tr><td class="pad" style="padding:36px 56px 8px 56px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;">
      <tr><td align="center" style="padding:28px 20px 6px 20px;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;color:#555555;">
        Your Rare Rabbit collaboration voucher
      </td></tr>
      <tr><td align="center" style="padding:14px 24px 0 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td align="center" style="border:2px dashed #000000;padding:18px 10px;">
            <span class="code" style="font-family:'Oswald','Arial Narrow',Arial,sans-serif;font-weight:500;font-size:38px;line-height:44px;letter-spacing:8px;color:#000000;">{{VOUCHER_CODE}}</span>
          </td></tr>
        </table>
      </td></tr>
      <tr><td align="center" style="padding:16px 24px 28px 24px;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:12px;line-height:19px;color:#555555;">
        Valid for online purchases on rarerabbit.in<br>Valid till 20 November 2026
      </td></tr>
    </table>
  </td></tr>

  <!-- How to redeem -->
  <tr><td class="pad" style="padding:28px 56px 8px 56px;font-family:'Montserrat',Arial,Helvetica,sans-serif;color:#e6e6e6;">
    <p style="margin:0;font-size:14px;line-height:23px;color:#bdbdbd;">To use it, shop online at rarerabbit.in and enter this code at checkout. The code is personal to you, so please don't share it.</p>
  </td></tr>

  <!-- Sign-off -->
  <tr><td class="pad" style="padding:30px 56px 44px 56px;font-family:'Montserrat',Arial,Helvetica,sans-serif;color:#ffffff;">
    <p style="margin:0;font-family:'Oswald','Arial Narrow',Arial,sans-serif;font-size:18px;line-height:26px;letter-spacing:1px;color:#ffffff;">Team Orion Model Hunt 2026</p>
    <p style="margin:2px 0 0 0;font-size:13px;line-height:20px;color:#8f8f8f;">A7 Entertainment &amp; Parker Models</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#ffffff;padding:18px 24px;" align="center">
    <p style="margin:0;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#000000;font-weight:600;letter-spacing:1px;">A7 ENTERTAINMENT &amp; PARKER MODELS</p>
    <p style="margin:4px 0 0 0;font-family:'Montserrat',Arial,Helvetica,sans-serif;font-size:11px;line-height:17px;color:#555555;">In collaboration with Rare Rabbit &nbsp;|&nbsp; <a href="https://www.instagram.com/a7entertainment/" target="_blank" style="color:#000000;text-decoration:underline;">@a7entertainment</a> &nbsp;|&nbsp; <a href="mailto:enquiry@a7entertainment.in" style="color:#000000;text-decoration:underline;">enquiry@a7entertainment.in</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>
`;
