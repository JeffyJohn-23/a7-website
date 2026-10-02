// Generates src/lib/emailTemplates/wtl2026.ts from the processed HTML.
// Embedding as a TS module avoids runtime fs reads on serverless.
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "src", "lib", "emailTemplates", "wtl-2026.processed.html");
const OUT = path.join(__dirname, "..", "src", "lib", "emailTemplates", "wtl2026.ts");

const html = fs.readFileSync(SRC, "utf8");

// Escape only what breaks a template literal: backslash, backtick, ${
const esc = html
  .split("\\").join("\\\\")
  .split("`").join("\\`")
  .split("${").join("\\${");

const out =
  "// AUTO-GENERATED from WTL_2026_Emailer.html — do not edit by hand.\n" +
  "// Regenerate with: node scripts/gen-wtl-template.js\n" +
  "//\n" +
  "// Transformations applied to the original:\n" +
  "//   - the two mailto: buttons -> wa.me links with pre-filled text\n" +
  "//   - Google Fonts <link> removed (stripped by Gmail/Outlook anyway)\n" +
  "//   - image srcs -> {{IMG_HERO}} / {{IMG_PLAYERS}} / {{IMG_RUUD}} tokens\n\n" +
  "export const WTL_2026_HTML = `" + esc + "`;\n";

fs.writeFileSync(OUT, out, "utf8");
console.log("written:", OUT, out.length, "bytes");
