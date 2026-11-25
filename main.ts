// The Best Advice I Ever Got — make.fun entry (u-pangg7-the-best-advice-i-ever-got-358cefb0).
//
// Writes one sentence about the best advice I ever received to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt when set).
// The gate needs 1-200 characters of UTF-8 text, a single sentence,
// nothing but the sentence itself — no trailing newline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ADVICE =
  "My father, counting tips at the kitchen table at 2 a.m., told me never to borrow money to look rich, because the interest always arrives before the applause does.";

const MAX_CHARS = 200;

// Count characters the way the gate does: Unicode code points, not UTF-16 units.
function charCount(text: string): number {
  return [...text].length;
}

// Self-check: one sentence, 1-200 characters, a single non-blank line.
// The "a.m." in the sentence carries its own periods, so strip time
// abbreviations before looking for a sentence break.
function validateEntry(text: string): void {
  const chars = charCount(text);
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line, no line breaks");
  }
  const withoutTimes = text.replace(/\b[ap]\.m\./gi, "");
  if (/[?!]/.test(withoutTimes) || /[.!?]\s/.test(withoutTimes)) {
    throw new Error("entry must be exactly one sentence");
  }
  if (!withoutTimes.endsWith(".")) {
    throw new Error("entry must end with a full stop");
  }
}

function main(): void {
  validateEntry(ADVICE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, ADVICE, "utf8");
  // Read back what landed on disk and check the file itself, not just
  // the string in memory — the gate reads the file.
  const written = readFileSync(outPath, "utf8");
  if (written !== ADVICE) {
    throw new Error("written file does not match the entry sentence");
  }
  validateEntry(written);
  console.log(`wrote ${charCount(ADVICE)} characters to ${outPath}`);
}

main();
