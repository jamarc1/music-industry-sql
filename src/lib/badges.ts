import { Badge } from "@/types";

export const BADGE_CATALOG: Record<string, Badge> = {
  // ===== Per-task progression badges =====
  "badge-clean-pull": {
    id: "badge-clean-pull",
    name: "Clean Pull",
    description: "Ran your very first SELECT against the label's data.",
    icon: "🎧",
  },
  "badge-bot-signature": {
    id: "badge-bot-signature",
    name: "Bot Signature",
    description: "Filtered out the streams too short to be real listens.",
    icon: "🤖",
  },
  "badge-timestamp": {
    id: "badge-timestamp",
    name: "Perfect Timing",
    description: "Sorted a suspicious spike down to the exact minute it began.",
    icon: "🕑",
  },
  "badge-first-join": {
    id: "badge-first-join",
    name: "Follow the Signal",
    description: "Joined two tables to put a name behind the numbers.",
    icon: "🔗",
  },
  "badge-left-join": {
    id: "badge-left-join",
    name: "Ghost in the NULLs",
    description: "Used a LEFT JOIN to keep an erased contributor visible.",
    icon: "👻",
  },
  "badge-group-by": {
    id: "badge-group-by",
    name: "One Total Per Region",
    description: "Aggregated with GROUP BY to expose an outlier region.",
    icon: "📊",
  },
  "badge-multi-hop": {
    id: "badge-multi-hop",
    name: "Follow the Money",
    description: "Chained a multi-hop join from transfer to contract to payout.",
    icon: "💸",
  },

  // ===== Case completion badges =====
  "badge-golden-ear": {
    id: "badge-golden-ear",
    name: "Golden Ear",
    description: "Closed The Bot Stream Scandal and traced the fraud to PulseBoost Media.",
    icon: "🥇",
  },
  "badge-paper-trail": {
    id: "badge-paper-trail",
    name: "Paper Trail",
    description: "Closed The Ghost Producer and got Theo Marsh his credit back.",
    icon: "📄",
  },
  "badge-perfect-pitch": {
    id: "badge-perfect-pitch",
    name: "Perfect Pitch",
    description: "Closed The Chart Rig and exposed the region someone paid to fake.",
    icon: "🎯",
  },
  "badge-ledger-hawk": {
    id: "badge-ledger-hawk",
    name: "Ledger Hawk",
    description: "Closed The Vanishing Royalties and followed Delia's money to the shell.",
    icon: "🦅",
  },

  // ===== Meta badge =====
  "badge-no-notes": {
    id: "badge-no-notes",
    name: "No Notes",
    description: "Closed all four cases without using a single hint. Reyes has no notes.",
    icon: "🏆",
  },
};
