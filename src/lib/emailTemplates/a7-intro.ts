// Source: A7_Entertainment_Mailer.html — self-contained (no image tokens), pasted verbatim.
// To update, replace the template literal below with the new HTML.

export const A7_INTRO_HTML = `<!DOCTYPE html>
<html lang="en" translate="no" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="google" content="notranslate">
<meta http-equiv="Content-Language" content="en">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>A7 Entertainment — Innovate. Create. Inspire.</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:#000000;-webkit-text-size-adjust:100%;}
  table{border-collapse:collapse;}
  a{text-decoration:none;}
  .display{font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;}
  .body{font-family:'Barlow','Helvetica Neue',Arial,sans-serif;}

  /* Instagram carousel: auto-scrolls where CSS animation is supported (Apple Mail, iOS, browsers);
     elsewhere it shows the first three posts as a static, clickable row. */
  .ig-viewport{overflow:hidden;width:100%;}
  .ig-track{width:1800px;}
  @keyframes igslide{0%{transform:translateX(0)}100%{transform:translateX(-900px)}}
  .ig-track{animation:igslide 22s linear infinite;}
  .ig-viewport:hover .ig-track{animation-play-state:paused;}
  .ig-tile:hover .ig-inner{border-color:#ED3638 !important;}
  @media (prefers-reduced-motion: reduce){.ig-track{animation:none;}}

  a.chip:hover{border-color:#ED3638 !important;}

  /* Hero headline loop (6s): words start as outlines, fill in one after another like a loading bar,
     hold, then wipe back to outlines and start again. Clients without text clipping see the solid headline. */
  @keyframes a7f1{
    0%,4%{background-size:0% 100%;background-position:0 0;-webkit-text-stroke-color:#5A5A5A;}
    20%{background-size:100% 100%;background-position:0 0;-webkit-text-stroke-color:#5A5A5A;}
    22%,84%{background-size:100% 100%;background-position:0 0;-webkit-text-stroke-color:transparent;}
    85%{background-size:100% 100%;background-position:100% 0;-webkit-text-stroke-color:#5A5A5A;}
    96%,100%{background-size:0% 100%;background-position:100% 0;-webkit-text-stroke-color:#5A5A5A;}
  }
  @keyframes a7f2{
    0%,18%{background-size:0% 100%;background-position:0 0;-webkit-text-stroke-color:#5A5A5A;}
    34%{background-size:100% 100%;background-position:0 0;-webkit-text-stroke-color:#5A5A5A;}
    36%,84%{background-size:100% 100%;background-position:0 0;-webkit-text-stroke-color:transparent;}
    85%{background-size:100% 100%;background-position:100% 0;-webkit-text-stroke-color:#5A5A5A;}
    96%,100%{background-size:0% 100%;background-position:100% 0;-webkit-text-stroke-color:#5A5A5A;}
  }
  @keyframes a7f3{
    0%,32%{background-size:0% 100%;background-position:0 0;-webkit-text-stroke-color:#5A5A5A;}
    48%{background-size:100% 100%;background-position:0 0;-webkit-text-stroke-color:#5A5A5A;}
    50%,84%{background-size:100% 100%;background-position:0 0;-webkit-text-stroke-color:transparent;}
    85%{background-size:100% 100%;background-position:100% 0;-webkit-text-stroke-color:#5A5A5A;}
    96%,100%{background-size:0% 100%;background-position:100% 0;-webkit-text-stroke-color:#5A5A5A;}
  }
  @keyframes a7load{
    0%,4%{width:0;}
    48%,84%{width:120px;}
    96%,100%{width:0;}
  }
  @supports ((-webkit-background-clip:text) and (-webkit-text-stroke:1px black)){
    .fx{display:inline-block;color:transparent !important;-webkit-text-stroke:1.5px transparent;
        background-image:linear-gradient(#ffffff,#ffffff);background-repeat:no-repeat;background-size:100% 100%;
        -webkit-background-clip:text;background-clip:text;}
    .fx3{background-image:linear-gradient(#ED3638,#ED3638);}
    .fx1{animation:a7f1 6s cubic-bezier(.65,0,.35,1) infinite both;}
    .fx2{animation:a7f2 6s cubic-bezier(.65,0,.35,1) infinite both;}
    .fx3{animation:a7f3 6s cubic-bezier(.65,0,.35,1) infinite both;}
    .loadbar{animation:a7load 6s cubic-bezier(.65,0,.35,1) infinite both;}
  }
  @media (prefers-reduced-motion: reduce){
    .fx,.loadbar{animation:none !important;}
  }

  .btn:hover{background:#ffffff !important;color:#000000 !important;}

  @media only screen and (max-width:620px){
    .container{width:100% !important;}
    .pad{padding-left:24px !important;padding-right:24px !important;}
    .hero-head{font-size:76px !important;line-height:68px !important;}
    .hero-inner{padding-left:6px !important;padding-right:6px !important;}
    .hero-cta{text-align:left !important;padding-top:24px !important;}
    .hero-cta table{float:none !important;}
    .hero-sub{padding-right:0 !important;}
    .logo-img{width:160px !important;}
    .ig-viewport{width:calc(100vw - 24px) !important;max-width:calc(100vw - 24px) !important;}
    .igpad{padding-right:0 !important;}
    .pillar{padding:24px 18px 18px 18px !important;}
    .pillar-name{font-size:40px !important;line-height:38px !important;}
    .services-head{font-size:48px !important;line-height:44px !important;}
    .chip{font-size:12px !important;padding:7px 12px !important;}
    .ig-handle{font-size:16px !important;}
    .ig-bar{padding:8px 8px 8px 18px !important;}
    .ig-follow-btn{padding:11px 20px !important;}
    .intro-lead{font-size:19px !important;line-height:28px !important;}
    .col{display:block !important;width:100% !important;}
    .stack-btn{display:block !important;width:100% !important;margin-bottom:12px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#000000;">

<!-- Preheader (shows in inbox preview) -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#000000;">
  Building brands that connect and convert. Events, influencers, celebrities and content, end to end, from A7 Entertainment.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000000;">
<tr><td align="center" style="padding:0;">

<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" style="width:600px;background:#000000;">

  <!-- ============ HERO ============ -->
  <tr><td class="pad" style="padding:28px 28px 0 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <!-- viewfinder corners, from the deck -->
      <tr>
        <td width="40" height="40" style="border-top:3px solid #ffffff;border-left:3px solid #ffffff;font-size:0;line-height:0;">&nbsp;</td>
        <td style="font-size:0;line-height:0;">&nbsp;</td>
        <td width="40" height="40" style="border-top:3px solid #ffffff;border-right:3px solid #ffffff;font-size:0;line-height:0;">&nbsp;</td>
      </tr>
      <tr><td colspan="3" align="left" class="hero-inner" style="padding:18px 28px 10px 28px;text-align:left;">

        <!-- Logo -->
        <img class="logo-img" src="https://www.a7entertainment.in/logo-white.png" width="200" alt="A7 Entertainment" style="display:block;width:200px;max-width:100%;height:auto;border:0;margin:0;">
        <div style="clear:both;font-size:0;line-height:0;">&nbsp;</div>

        <p class="body" style="margin:10px 0 0 0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:14px;color:#ffffff;letter-spacing:3px;text-align:left;">
          <span style="color:#ED3638;">&#9679;</span>&nbsp; Curating experiences
        </p>

        <!-- Headline -->
        <h1 class="display hero-head" style="margin:48px 0 0 0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-weight:400;font-size:104px;line-height:92px;color:#ffffff;letter-spacing:0;text-align:left;">
          <span class="fx fx1" style="color:#ffffff;">Innovate.</span><br><span class="fx fx2" style="color:#ffffff;">Create.</span><br><span class="fx fx3" style="color:#ED3638;">Inspire.</span>
        </h1>
        <div class="loadbar" style="width:120px;height:4px;background:#ED3638;margin-top:22px;font-size:0;line-height:0;">&nbsp;</div>

        <!-- Subline left, call to action right -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px;">
          <tr>
            <td class="col hero-sub" valign="bottom" style="text-align:left;padding-right:16px;">
              <p class="body" style="margin:0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:22px;line-height:29px;font-weight:500;color:#ffffff;">
                Building brands that<br>connect and convert.
              </p>
              <p class="body" style="margin:10px 0 0 0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;color:#8A8A8A;">
                Your end-to-end event and marketing partner for 15 years.
              </p>
            </td>
            <td class="col hero-cta" valign="bottom" align="right" style="text-align:right;white-space:nowrap;">
              <table role="presentation" cellpadding="0" cellspacing="0" align="right"><tr>
                <td style="background:#ED3638;">
                  <a class="btn body" href="mailto:enquiry@a7entertainment.in?subject=Enquiry%20for%20A7%20Entertainment" style="display:inline-block;padding:16px 26px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;background:#ED3638;letter-spacing:1px;">Start your project</a>
                </td>
              </tr></table>
            </td>
          </tr>
        </table>

      </td></tr>
      <tr>
        <td width="40" height="40" style="border-bottom:3px solid #ffffff;border-left:3px solid #ffffff;font-size:0;line-height:0;">&nbsp;</td>
        <td style="font-size:0;line-height:0;">&nbsp;</td>
        <td width="40" height="40" style="border-bottom:3px solid #ED3638;border-right:3px solid #ED3638;font-size:0;line-height:0;">&nbsp;</td>
      </tr>
    </table>
  </td></tr>

  <!-- ============ INTRO ============ -->
  <tr><td class="pad" style="padding:60px 48px 8px 48px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="3" style="width:3px;background:#ED3638;font-size:0;line-height:0;">&nbsp;</td>
      <td style="padding-left:20px;">
        <p class="body intro-lead" style="margin:0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:21px;line-height:31px;font-weight:500;color:#ffffff;">
          A7 Entertainment is an end-to-end event and marketing company that helps brands create experiences people remember and campaigns people talk about.
        </p>
      </td>
    </tr></table>
    <p class="body" style="margin:22px 0 0 0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:27px;color:#BDBDBD;">
      We&rsquo;ve spent 15 years working with film studios, hospitality groups, sports leagues and lifestyle brands. From concerts and brand launches to celebrity and influencer partnerships, movie promotions and in-house content production, one team takes your idea from strategy to the final show.
    </p>
  </td></tr>

  <!-- ============ SERVICES ============ -->
  <tr><td class="pad" style="padding:64px 48px 0 48px;">
    <h2 class="display services-head" style="margin:0 0 30px 0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-weight:400;font-size:58px;line-height:52px;color:#ffffff;">Everything your brand needs.<br><span style="color:#ED3638;">Under one roof.</span></h2>
  </td></tr>

  <tr><td class="pad" style="padding:0 48px 14px 48px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141414;">
      <tr>
        <td width="6" style="width:6px;background:#ED3638;font-size:0;line-height:0;">&nbsp;</td>
        <td class="pillar" style="padding:28px 28px 22px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="bottom" style="text-align:left;">
              <p class="display pillar-name" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:46px;line-height:42px;color:#ffffff;">Experiences</p>
            </td>
          </tr></table>
          <p class="body" style="margin:10px 0 18px 0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:23px;color:#9A9A9A;">Live moments built to be remembered, and shared.</p>
          <div style="line-height:0;"><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Concerts &amp; live music</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Product &amp; brand launches</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Corporate events</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Award shows</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Venue openings</a></div>
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td class="pad" style="padding:0 48px 14px 48px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ED3638;">
      <tr>
        <td width="6" style="width:6px;background:#B8282A;font-size:0;line-height:0;">&nbsp;</td>
        <td class="pillar" style="padding:28px 28px 22px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="bottom" style="text-align:left;">
              <p class="display pillar-name" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:46px;line-height:42px;color:#ffffff;">Marketing</p>
            </td>
          </tr></table>
          <p class="body" style="margin:10px 0 18px 0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:23px;color:#FFE3E3;">The people and platforms that put your brand in front of the right audience.</p>
          <div style="line-height:0;"><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #ffffff;background:#ffffff;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#000000;white-space:nowrap;text-decoration:none;">Influencer marketing</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #ffffff;background:#ffffff;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#000000;white-space:nowrap;text-decoration:none;">Celebrity management</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #ffffff;background:#ffffff;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#000000;white-space:nowrap;text-decoration:none;">Movie promotions</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #ffffff;background:#ffffff;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#000000;white-space:nowrap;text-decoration:none;">Social media handling</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #ffffff;background:#ffffff;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#000000;white-space:nowrap;text-decoration:none;">Brand collaborations</a></div>
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td class="pad" style="padding:0 48px 14px 48px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141414;">
      <tr>
        <td width="6" style="width:6px;background:#ffffff;font-size:0;line-height:0;">&nbsp;</td>
        <td class="pillar" style="padding:28px 28px 22px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="bottom" style="text-align:left;">
              <p class="display pillar-name" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:46px;line-height:42px;color:#ffffff;">Content</p>
            </td>
          </tr></table>
          <p class="body" style="margin:10px 0 18px 0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:23px;color:#9A9A9A;">Shot in-house at A7&rsquo; Studio, our fully equipped space in Bengaluru.</p>
          <div style="line-height:0;"><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Ad shoots</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Fashion shoots</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Portfolio shoots</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Podcasts</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Studio rentals</a><a class="chip" href="https://www.a7entertainment.in" target="_blank" style="display:inline-block;margin:0 6px 8px 0;padding:8px 14px;border:1px solid #3A3A3A;background:transparent;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:500;line-height:16px;color:#ffffff;white-space:nowrap;text-decoration:none;">Event creatives</a></div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ============ INSTAGRAM CAROUSEL ============ -->
  <tr><td class="pad" style="padding:60px 48px 0 48px;">
    <h2 class="display" style="margin:0 0 6px 0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-weight:400;font-size:44px;line-height:1;color:#ffffff;">Our projects</h2>
    <div style="width:64px;height:3px;background:#ED3638;font-size:0;line-height:0;">&nbsp;</div>
    <p class="body" style="margin:14px 0 0 0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:15px;line-height:24px;color:#BDBDBD;">
      Recent work from our feed. Tap any post to see it on <a href="https://www.instagram.com/a7entertainment/" style="color:#ffffff;text-decoration:underline;">@a7entertainment</a>, or see more on <a href="https://www.a7entertainment.in" style="color:#ffffff;text-decoration:underline;">our website</a>.
    </p>
  </td></tr>

  <tr><td style="padding:22px 0 0 48px;" class="pad igpad">
    <div class="ig-viewport" style="overflow:hidden;width:552px;max-width:552px;">
      <div class="ig-track" style="width:1800px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <!-- Set A (6 posts) -->
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#ED3638;border:2px solid #ED3638;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">Ben Böhmer live</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ffffff;">Concert</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#1A1A1A;border:2px solid #333333;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">World Tennis League</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ED3638;">Celebrity mgmt</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#ffffff;border:2px solid #ffffff;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#000000;">Ramee Icon launch</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ED3638;">Brand launch</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#1A1A1A;border:2px solid #333333;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">Vesparo &amp; Pulse</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ED3638;">Venue opening</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#ED3638;border:2px solid #ED3638;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">Guru Randhawa</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ffffff;">Concert</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#1A1A1A;border:2px solid #333333;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">A7&rsquo; Studio</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ED3638;">Shoots</p>
            </td></tr></table></a></td>
          <!-- Set B: duplicate of Set A so the loop is seamless -->
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#ED3638;border:2px solid #ED3638;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">Ben Böhmer live</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ffffff;">Concert</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#1A1A1A;border:2px solid #333333;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">World Tennis League</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ED3638;">Celebrity mgmt</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#ffffff;border:2px solid #ffffff;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#000000;">Ramee Icon launch</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ED3638;">Brand launch</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#1A1A1A;border:2px solid #333333;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">Vesparo &amp; Pulse</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ED3638;">Venue opening</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#ED3638;border:2px solid #ED3638;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">Guru Randhawa</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ffffff;">Concert</p>
            </td></tr></table></a></td>
          <td class="ig-tile" style="padding-right:12px;"><a href="https://www.instagram.com/a7entertainment/" style="display:block;">
            <table role="presentation" class="ig-inner" width="138" cellpadding="0" cellspacing="0" style="width:138px;height:170px;background:#1A1A1A;border:2px solid #333333;"><tr><td valign="bottom" style="padding:12px;height:170px;">
              <p class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-size:22px;line-height:21px;color:#ffffff;">A7&rsquo; Studio</p>
              <p class="body" style="margin:6px 0 0 0;font-family:'Barlow',Arial,sans-serif;font-size:11px;color:#ED3638;">Shoots</p>
            </td></tr></table></a></td>
        </tr></table>
      </div>
    </div>
  </td></tr>

  <!-- Instagram follow bar -->
  <tr><td class="pad" style="padding:26px 48px 0 48px;">
    <a href="https://www.instagram.com/a7entertainment/" target="_blank" style="display:block;text-decoration:none;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #2E2E2E;border-radius:60px;border-collapse:separate;">
      <tr>
        <td class="ig-bar" style="padding:10px 10px 10px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="30" valign="middle" style="width:30px;padding-right:14px;">
              <div style="width:22px;height:22px;border:2px solid #ffffff;border-radius:7px;position:relative;">
                <div style="width:8px;height:8px;border:2px solid #ffffff;border-radius:50%;margin:5px auto 0 auto;"></div>
                <div style="position:absolute;top:3px;right:3px;width:3px;height:3px;background:#ED3638;border-radius:50%;"></div>
              </div>
            </td>
            <td valign="middle" style="text-align:left;">
              <span class="body ig-handle" style="font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:18px;line-height:24px;font-weight:600;color:#ffffff;">@a7entertainment</span>
            </td>
            <td valign="middle" align="right" style="text-align:right;white-space:nowrap;">
              <span class="ig-follow-btn" style="display:inline-block;padding:13px 28px;background:#ED3638;border-radius:40px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:600;line-height:18px;color:#ffffff;">Follow</span>
            </td>
          </tr></table>
        </td>
      </tr>
    </table>
    </a>
  </td></tr>

  <!-- ============ CTA ============ -->
  <tr><td class="pad" style="padding:64px 48px 0 48px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #ED3638;">
      <tr><td align="center" style="padding:40px 28px;">
        <h2 class="display" style="margin:0;font-family:'Bebas Neue','Oswald',Impact,Haettenschweiler,'Arial Narrow Bold',sans-serif;font-weight:400;font-size:48px;line-height:46px;color:#ffffff;">Let&rsquo;s curate<br>something <span style="color:#ED3638;">together.</span></h2>
        <p class="body" style="margin:14px auto 0 auto;max-width:400px;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:26px;color:#BDBDBD;">
          Whether it&rsquo;s a launch, a campaign or a night to remember, every great experience starts with a conversation. Share your idea, and we&rsquo;ll shape it into something your audience won&rsquo;t forget.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-top:28px;"><tr>
          <td class="stack-btn" style="padding:0 6px;">
            <a class="btn body" href="mailto:enquiry@a7entertainment.in?subject=Enquiry%20for%20A7%20Entertainment" style="display:block;padding:15px 26px;background:#ED3638;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-align:center;">Email</a>
          </td>
          <td class="stack-btn" style="padding:0 6px;">
            <a class="btn body" href="tel:+919632707695" style="display:block;padding:13px 26px;border:2px solid #ffffff;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:600;color:#ffffff;text-align:center;">Call</a>
          </td>
        </tr></table>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============ FOOTER ============ -->
  <tr><td class="pad" align="center" style="padding:56px 48px 48px 48px;">
    <img src="https://www.a7entertainment.in/logo-white.png" width="150" alt="A7 Entertainment" style="display:block;width:150px;max-width:100%;height:auto;border:0;margin:0 auto;">
    <p class="body" style="margin:16px 0 0 0;font-family:'Barlow','Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:24px;color:#8A8A8A;">
      <a href="https://www.a7entertainment.in" style="color:#ffffff;">www.a7entertainment.in</a><br>
      <a href="mailto:enquiry@a7entertainment.in" style="color:#8A8A8A;">enquiry@a7entertainment.in</a> &nbsp;|&nbsp; <a href="tel:+919632707695" style="color:#8A8A8A;">+91 96327 07695</a><br>
      <a href="https://www.instagram.com/a7entertainment/" style="color:#8A8A8A;">Instagram</a>
    </p>
    <div style="width:14px;height:14px;background:#ED3638;margin:24px auto 0 auto;font-size:0;line-height:0;">&nbsp;</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>
`;
