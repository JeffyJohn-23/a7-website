// Verifies the WTL template renders correctly in both states:
// images configured, and images missing (<img> must be removed, not broken).
const fs = require("path") && require("fs");
const path = require("path");

const src = fs.readFileSync(
  path.join(__dirname, "..", "src", "lib", "emailTemplates", "wtl2026.ts"),
  "utf8"
);
const m = src.match(/export const WTL_2026_HTML = `([\s\S]*)`;\s*$/);
if (!m) {
  console.error("FAIL: could not parse template literal");
  process.exit(1);
}
// Unescape what the generator escaped.
const HTML = m[1].split("\\`").join("`").split("\\${").join("${").split("\\\\").join("\\");

function applyImages(html, urls) {
  let out = html;
  for (const [token, url] of Object.entries(urls)) {
    if (url) out = out.split(token).join(url);
    else {
      const re = new RegExp(`<img[^>]*${token.replace(/[{}]/g, "\\$&")}[^>]*>`, "g");
      out = out.replace(re, "");
    }
  }
  return out;
}

console.log("--- WhatsApp buttons ---");
const waLinks = HTML.match(/https:\/\/wa\.me\/918655242422\?text=[^"]*/g) || [];
console.log("wa.me link count (want 2):", waLinks.length, waLinks.length === 2 ? "PASS" : "FAIL");
waLinks.forEach((l, i) => {
  const text = decodeURIComponent(l.split("text=")[1] || "");
  console.log(`  button ${i + 1} prefilled: "${text}"`);
});
console.log("no leftover mailto      :", !HTML.includes("partnerships@example.com") ? "PASS" : "FAIL");

console.log("\n--- images configured ---");
const withImgs = applyImages(HTML, {
  "{{IMG_HERO}}": "https://www.a7entertainment.in/wtl/hero.jpg",
  "{{IMG_PLAYERS}}": "https://www.a7entertainment.in/wtl/players.jpg",
  "{{IMG_RUUD}}": undefined,
});
console.log("tokens substituted      :", !/\{\{IMG_/.test(withImgs) ? "PASS" : "FAIL");
console.log("img tags present        :", (withImgs.match(/<img/g) || []).length);

console.log("\n--- images MISSING ---");
const noImgs = applyImages(HTML, {
  "{{IMG_HERO}}": undefined,
  "{{IMG_PLAYERS}}": undefined,
  "{{IMG_RUUD}}": undefined,
});
console.log("no leftover tokens      :", !/\{\{IMG_/.test(noImgs) ? "PASS" : "FAIL");
const leftoverImgs = (noImgs.match(/<img/g) || []).length;
console.log("broken <img> removed    :", leftoverImgs === 0 ? "PASS" : `FAIL (${leftoverImgs} remain)`);
console.log("body still intact       :", noImgs.includes("The Greatest Show on Court") ? "PASS" : "FAIL");

console.log("\n--- hygiene ---");
console.log("no google fonts link    :", !noImgs.includes("fonts.googleapis.com") ? "PASS" : "FAIL");
console.log("unsubscribe placeholder :", HTML.includes("[UNSUBSCRIBE_URL]") ? "present (stripped at render)" : "absent");
