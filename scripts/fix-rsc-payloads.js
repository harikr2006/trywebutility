/**
 * Post-build: create flat-file aliases for RSC __PAGE__ payloads.
 *
 * Next.js static export generates:
 *   out/tool-name/__next.tool-name/__PAGE__.txt   (directory structure)
 *
 * But the client JS requests:
 *   /tool-name/__next.tool-name.__PAGE__.txt      (flat file, dots not slash)
 *
 * This script copies each nested __PAGE__.txt to the flat-file location so
 * the request resolves on any static host without needing URL rewrites.
 */

const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(__dirname, "..", "out");
let copied = 0;

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Check if this directory is a __next.<segment> directory
      if (entry.name.startsWith("__next.")) {
        const pageTxt = path.join(fullPath, "__PAGE__.txt");
        if (fs.existsSync(pageTxt)) {
          // Flat-file target: parent/__next.segment.__PAGE__.txt
          const flatTarget = path.join(dir, `${entry.name}.__PAGE__.txt`);
          fs.copyFileSync(pageTxt, flatTarget);
          copied++;
        }
      }
      // Always recurse
      walkDir(fullPath);
    }
  }
}

walkDir(OUT_DIR);
console.log(`fix-rsc-payloads: created ${copied} flat-file aliases`);
