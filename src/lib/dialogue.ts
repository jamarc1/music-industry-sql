// Short, in-character reactions Chief Reyes can open with after a successful
// query, before delivering the case-specific line. Keeps the mentor feeling
// present and reactive instead of repeating the same beat every time.
export const DETECTIVE_FILLER_LINES: string[] = [
  "\"Interesting.\"",
  "\"Had a feeling.\"",
  "\"That changes things.\"",
  "\"Now the numbers are talking.\"",
  "\"Good analysts don't stop at the first row.\"",
  "\"Keep pulling that thread.\"",
  "\"That's the kind of lead I trust.\"",
  "\"Something's starting to add up.\"",
  "\"Sharp query.\"",
  "\"The data's finally cooperating.\"",
  "\"That's not nothing.\"",
  "\"You're onto something.\"",
  "\"Hm. Didn't expect that.\"",
  "\"This case just got a little clearer.\"",
  "\"Nice catch.\"",
  "\"That's one more piece of the picture.\"",
  "\"You're thinking in SQL now.\"",
  "\"I knew this data was hiding something.\"",
  "\"Every clean case starts with a row like that.\"",
  "\"Don't stop there.\"",
];

/**
 * Picks a random filler line, avoiding an immediate repeat of `exclude`
 * (e.g. the line shown for the previous success) so it doesn't feel canned.
 */
export function pickFillerLine(exclude?: string): string {
  const pool = exclude
    ? DETECTIVE_FILLER_LINES.filter((line) => line !== exclude)
    : DETECTIVE_FILLER_LINES;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Shown occasionally while the player is reviewing a successful query's
// results, before they click "Continue" — nudges them to actually look at
// the evidence instead of rushing to the next lead.
export const REFLECTION_LINES: string[] = [
  "\"Take a minute. Every row matters.\"",
  "\"Don't rush. The data tells the story.\"",
  "\"Read the records before you assume anything.\"",
  "\"The query knows more than the memo ever will.\"",
];

export function pickReflectionLine(exclude?: string): string {
  const pool = exclude
    ? REFLECTION_LINES.filter((line) => line !== exclude)
    : REFLECTION_LINES;
  return pool[Math.floor(Math.random() * pool.length)];
}

const REFLECTION_CHANCE = 0.65;

/** Reyes only "occasionally" chimes in during evidence review — this rolls that chance. */
export function maybePickReflectionLine(exclude?: string): string | null {
  if (Math.random() >= REFLECTION_CHANCE) return null;
  return pickReflectionLine(exclude);
}

// Stateful wrappers so callers don't have to thread "the line shown last
// time" through their own state just to avoid an immediate repeat.
let lastFillerLine: string | undefined;

export function nextFillerLine(): string {
  lastFillerLine = pickFillerLine(lastFillerLine);
  return lastFillerLine;
}

let lastReflectionLine: string | null = null;

export function nextReflectionLine(): string | null {
  lastReflectionLine = maybePickReflectionLine(lastReflectionLine ?? undefined);
  return lastReflectionLine;
}
