// Fixes mobile alignment in the WTL emailer.
//
// Root cause: both .player and .stack are <td> elements inside a single <tr>.
// A <tr> renders its cells on one line — `display:inline-block` in a media
// query cannot make them wrap, because the cells are still row children.
// iOS Mail partially applied width:50% while keeping them in-row, which is the
// squashed/left-drifting layout in the screenshot.
//
// Fix (standard email-safe pattern):
//   .stack  -> display:block; width:100%  (one full-width card per row)
//   .player -> display:inline-block on a <td> that is wrapped so two fit per
//              row; paired with text-align:center on the container so the
//              inline-blocks centre as a group rather than hugging the left.
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "src", "lib", "emailTemplates", "wtl-2026.processed.html");
let html = fs.readFileSync(FILE, "utf8");

const OLD_MQ = `  @media only screen and (max-width:620px) {
    .wrap { width:100% !important; }
    .px { padding-left:22px !important; padding-right:22px !important; }
    .stack { display:block !important; width:100% !important; }
    .player { display:inline-block !important; width:50% !important; }
    .hero-h { font-size:34px !important; line-height:40px !important; }
    .big { font-size:30px !important; }
  }`;

const NEW_MQ = `  @media only screen and (max-width:620px) {
    .wrap { width:100% !important; }
    .px { padding-left:22px !important; padding-right:22px !important; }

    /* Cards stack full width. table-layout:fixed stops long values from
       stretching a cell wider than the screen. */
    .stack {
      display:block !important;
      width:100% !important;
      max-width:100% !important;
      padding-left:0 !important;
      padding-right:0 !important;
      padding-bottom:12px !important;
      box-sizing:border-box !important;
    }

    /* Two players per row. The <tr> is forced to behave as a block so its
       cells can wrap; .player-row centres the resulting group. */
    .player-grid, .player-row { display:block !important; width:100% !important; }
    .player-row { text-align:center !important; font-size:0 !important; }
    .player {
      display:inline-block !important;
      width:50% !important;
      max-width:50% !important;
      box-sizing:border-box !important;
      padding:0 4px 22px !important;
      vertical-align:top !important;
      text-align:center !important;
    }

    .hero-h { font-size:34px !important; line-height:40px !important; }
    .big { font-size:30px !important; }
  }`;

if (!html.includes(OLD_MQ)) {
  console.error("FAIL: media query block not found — template may have changed");
  process.exit(1);
}
html = html.replace(OLD_MQ, NEW_MQ);

// Tag the player tables/rows so the media query can target them.
const beforeGrid = (html.match(/class="player-grid"/g) || []).length;
html = html.replace(
  /<table role="presentation" width="100%" cellpadding="0" cellspacing="0">\s*(\r?\n\s*)<tr>(\s*\r?\n\s*<td class="player")/g,
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="player-grid">$1<tr class="player-row">$2'
);
const afterGrid = (html.match(/class="player-grid"/g) || []).length;

// Font-size:0 on the row (to kill inline-block gaps) must be undone on cells.
html = html.replace(
  /<td class="player" width="25%" align="center" valign="top" style="padding:0 4px 22px;">/g,
  '<td class="player" width="25%" align="center" valign="top" style="padding:0 4px 22px;font-size:14px;">'
);

fs.writeFileSync(FILE, html, "utf8");

console.log("media query replaced     : PASS");
console.log("player tables tagged     :", beforeGrid + " -> " + afterGrid, afterGrid > 0 ? "PASS" : "FAIL");
console.log("player rows tagged       :", (html.match(/class="player-row"/g) || []).length);
console.log("player cells w/ font-size:", (html.match(/class="player"[^>]*font-size:14px/g) || []).length);
console.log("stack cells (unchanged)  :", (html.match(/class="stack"/g) || []).length);
