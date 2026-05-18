const fs = require('fs');
const path = require('path');
const dir = "/Users/riteshverma/Documents/VERMA'S copy/VERMAS_Images_2026-03-26/Sofa/done editing";

try {
  const files = fs.readdirSync(dir);
  console.log("Total files:", files.length);
  const exts = {};
  files.forEach(f => {
    const ext = path.extname(f).toLowerCase();
    exts[ext] = (exts[ext] || 0) + 1;
  });
  console.log("Extensions:", exts);
} catch (e) {
  console.error("Error reading dir:", e.message);
}
