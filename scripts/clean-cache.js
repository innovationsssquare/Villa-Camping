import fs from "node:fs";

try {
  fs.rmSync(".next/cache", { recursive: true, force: true });
  console.log("✓ Cleared .next/cache to guarantee clean Turbopack build without stale artifacts");
} catch {
  // Ignore if folder does not exist
}
