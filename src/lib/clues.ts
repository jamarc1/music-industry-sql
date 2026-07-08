import { Clue } from "@/types";

export const CLUE_CATALOG: Record<string, Clue> = {
  // ===== Case 1 — The Bot Stream Scandal =====
  "clue-play-log": {
    id: "clue-play-log",
    title: "Play Log",
    description: "Every registered stream of Neon Static — including how long each one actually played.",
    icon: "🎧",
    revealHook: "Now we can see what really happened, second by second.",
  },
  "clue-short-streams": {
    id: "clue-short-streams",
    title: "Sub-15-Second Streams",
    description: "A pile of streams too short to count as real listens.",
    icon: "🤖",
    revealHook: "Now we know which streams were never really plays at all.",
  },
  "clue-2am-spike": {
    id: "clue-2am-spike",
    title: "The 2 AM Spike",
    description: "The fake streams, lined up in time — starting at 2:14 AM sharp.",
    icon: "🕑",
    revealHook: "Now we know the exact minute the operation switched on.",
  },
  "clue-pulseboost": {
    id: "clue-pulseboost",
    title: "PulseBoost Media",
    description: "One IP block, one signup day, one email domain behind every fake account.",
    icon: "🏢",
    revealHook: "Now we know this wasn't a fanbase — it was one operation.",
  },

  // ===== Case 2 — The Ghost Producer =====
  "clue-credit-sheet": {
    id: "clue-credit-sheet",
    title: "Credit Sheet",
    description: "The label's official writers on Gravity — one name at 100%.",
    icon: "📄",
    revealHook: "Now we know exactly what the paperwork claims.",
  },
  "clue-session-logs": {
    id: "clue-session-logs",
    title: "Session Logs",
    description: "Who actually booked studio time — two names, not one.",
    icon: "🎚️",
    revealHook: "Now we know who was really in the room.",
  },
  "clue-session-timeline": {
    id: "clue-session-timeline",
    title: "Session Timeline",
    description: "The sessions in order — Marsh was there from day one.",
    icon: "🗓️",
    revealHook: "Now we know who was building this song before anyone else showed up.",
  },
  "clue-ghost-producer": {
    id: "clue-ghost-producer",
    title: "The Ghost Producer",
    description: "Every session, no credit, no royalties — a producer erased from the paperwork.",
    icon: "👻",
    revealHook: "Now we can prove the blank row is Theo Marsh.",
  },

  // ===== Case 3 — The Chart Rig =====
  "clue-chart-performance": {
    id: "clue-chart-performance",
    title: "Regional Chart Data",
    description: "Wildfire's points across all five regions we track.",
    icon: "📈",
    revealHook: "Now we can see the whole chart picture at once.",
  },
  "clue-spike-week": {
    id: "clue-spike-week",
    title: "The Spike Week",
    description: "The single week where the numbers stopped behaving.",
    icon: "🗓️",
    revealHook: "Now we're only looking at the week that matters.",
  },
  "clue-outlier-region": {
    id: "clue-outlier-region",
    title: "The Outlier Region",
    description: "One region carrying a share of the chart no organic release ever does.",
    icon: "📊",
    revealHook: "Now we know which region somebody's leaning on.",
  },
  "clue-crescendo": {
    id: "clue-crescendo",
    title: "Crescendo Media Partners",
    description: "A radio-spin spike that lines up, almost to the dollar, with an undisclosed payment.",
    icon: "💰",
    revealHook: "Now we know who got paid to buy this chart position.",
  },

  // ===== Case 4 — The Vanishing Royalties =====
  "clue-contract-split": {
    id: "clue-contract-split",
    title: "Contract Split",
    description: "Delia's contracted share of the track — clean on paper.",
    icon: "📜",
    revealHook: "Now we know exactly what she's owed.",
  },
  "clue-payout-cliff": {
    id: "clue-payout-cliff",
    title: "The Payout Cliff",
    description: "Delia's real payouts, quarter by quarter — dropping off a cliff.",
    icon: "📉",
    revealHook: "Now we can see the exact quarter the money stopped.",
  },
  "clue-quiet-transfer": {
    id: "clue-quiet-transfer",
    title: "The Quiet Transfer",
    description: "A catalog transfer dated right before the payouts dried up.",
    icon: "🔄",
    revealHook: "Now we know something changed — and when.",
  },
  "clue-meridian": {
    id: "clue-meridian",
    title: "Meridian Catalog Holdings",
    description: "The shell that started collecting Delia's share the moment the transfer cleared.",
    icon: "🏦",
    revealHook: "Now we know where the money actually went.",
  },
};
