"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { getMissionById } from "@/lib/missions";
import { ChiefReactionTiers } from "@/types";

interface ChiefReactionDisplayProps {
  reactions?: ChiefReactionTiers;
}

export default function ChiefReactionDisplay({ reactions }: ChiefReactionDisplayProps) {
  const currentMissionId = useGameStore((s) => s.currentMissionId);
  const currentTaskIndex = useGameStore((s) => s.currentTaskIndex);
  const hintTier = useGameStore((s) => s.hintTier);
  const wrongAttempts = useGameStore((s) => s.wrongAttempts);

  if (!reactions) return null;

  // Resolve the real task id (the old `task-${index}` heuristic never matched
  // the actual ids, so this always fell through to the clean line).
  const task = getMissionById(currentMissionId).tasks[currentTaskIndex];
  const taskId = task?.id ?? "";
  const hintsUsed = hintTier[taskId] ?? 0;
  const attempts = wrongAttempts[taskId] ?? 0;

  // Tier the reaction the same way XP is scored: a hint (or lots of wrong
  // attempts) earns the "brute force" nudge; a clean solve earns the clean line.
  let line: string;
  if (hintsUsed >= 1 || attempts >= 3) {
    line = reactions.bruteForce || reactions.standard;
  } else {
    line = reactions.clean || reactions.standard;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm"
    >
      <span className="mr-1 font-noir text-xs uppercase tracking-widest text-accent">
        Chief Reyes:
      </span>
      <span className="text-accent-soft italic">"{line}"</span>
    </motion.div>
  );
}
