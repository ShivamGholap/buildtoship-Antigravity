import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "../client/dist");

console.log("Checking client bundle for leaked secrets...");

if (!fs.existsSync(distDir)) {
  console.log("client/dist does not exist. Run 'npm run build' before check:secrets.");
  process.exit(0);
}

const forbiddenPatterns = [
  { pattern: /AIza[0-9A-Za-z-_]{35}/, name: "Google API Key (AIza...)" },
  { pattern: /service_role/i, name: "Supabase service_role key identifier" }
];

let foundLeaks = false;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (/\.(js|css|html|map)$/i.test(file)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const { pattern, name } of forbiddenPatterns) {
        if (pattern.test(content)) {
          console.error(`[SECURITY LEAK DETECTED] ${name} found in: ${fullPath}`);
          foundLeaks = true;
        }
      }
    }
  }
}

scanDirectory(distDir);

if (foundLeaks) {
  console.error("FAILED: Leaked secrets detected in client bundle!");
  process.exit(1);
} else {
  console.log("SUCCESS: No leaked secrets found in client bundle.");
  process.exit(0);
}
