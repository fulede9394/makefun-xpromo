// Entry for post-x-promote-make-your-own-bounty-01 (Node 22, standard library only).
// The entry itself is the X post: one post of our own that quotes make.fun's
// make-your-own-bounty post (https://x.com/makefunai/status/2124915864336236646),
// with a photo of its own attached and the sponsor line plus play code in its text.
// All this program has to do is hand the post's address to the gate: it reads
// POST.json from the repository root, checks it names a post address, and writes
// it to the output directory, where the gate reads it and scores the post's
// replies, reposts and quotes from X. Nothing this program writes about the post
// is scored.
//
// Run it locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
let raw: string;
try {
  raw = readFileSync(join(botDir, 'POST.json'), 'utf8');
} catch (error) {
  console.error(`POST.json could not be read from ${botDir}: ${(error as Error).message}`);
  process.exit(1);
}
let post: unknown;
try {
  post = JSON.parse(raw);
} catch (error) {
  console.error(`POST.json is not valid JSON: ${(error as Error).message}`);
  process.exit(1);
}
if (
  typeof post !== 'object' ||
  post === null ||
  typeof (post as { url?: unknown }).url !== 'string' ||
  ((post as { url: string }).url.length === 0)
) {
  console.error('POST.json must be an object with a non-empty string "url" field.');
  process.exit(1);
}
// Write the file back byte for byte, so the output matches the repository copy.
writeFileSync(join(outputDir, 'POST.json'), raw);
