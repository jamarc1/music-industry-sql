"use client";

import { motion } from "framer-motion";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-2xl flex flex-col"
      >
        <div className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-noir text-accent-soft">CASE FILE ZERO</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xl transition"
            aria-label="Close help"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 text-sm leading-relaxed text-slate-300">
          <section>
            <h3 className="text-accent font-noir font-bold mb-2">Welcome, analyst</h3>
            <p>
              Every stream, royalty payment, and chart position tells a story. Your primary tool will be SQL. The goal isn't perfect syntax—it's learning how to think through a problem using evidence.
            </p>
          </section>

          <section>
            <h3 className="text-accent font-noir font-bold mb-2">The investigation workflow</h3>
            <p className="space-y-1">
              <span className="block">1. Receive briefing — Chief Reyes sets up the mystery</span>
              <span className="block">2. Review evidence — explore the case files and tables</span>
              <span className="block">3. Open terminal — write your SQL query</span>
              <span className="block">4. Review results — check the evidence and continue</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">Repeat for all four tasks in each case.</p>
          </section>

          <section>
            <h3 className="text-accent font-noir font-bold mb-2">The Reyes method</h3>
            <p className="text-xs text-slate-400 mb-2">Before you write SQL, ask these five questions:</p>
            <div className="space-y-1 text-xs">
              <p><strong>1. What is the business asking?</strong> Understand the objective.</p>
              <p><strong>2. What information do I need?</strong> Identify the data required.</p>
              <p><strong>3. Which table contains it?</strong> Start with the most relevant source.</p>
              <p><strong>4. How is the data connected?</strong> Do you need filters, sorts, or joins?</p>
              <p><strong>5. Does my result answer the question?</strong> Your output should support the investigation.</p>
            </div>
          </section>

          <section>
            <h3 className="text-accent font-noir font-bold mb-2">Scoring and rewards</h3>
            <p className="space-y-1 text-xs">
              <span className="block">• <strong>No hints used:</strong> 100% XP</span>
              <span className="block">• <strong>One hint:</strong> 80% XP</span>
              <span className="block">• <strong>Two or more hints:</strong> 60% XP</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Case badges are earned only by solving a case with zero hints. Clear all four cases hint-free to unlock the "No Notes" meta-badge.
            </p>
          </section>

          <section>
            <h3 className="text-accent font-noir font-bold mb-2">Getting unstuck</h3>
            <div className="space-y-2 text-xs">
              <p><strong>Start simple:</strong> Use <span className="font-mono">SELECT * FROM table_name;</span> to explore first.</p>
              <p><strong>Build incrementally:</strong> Add one clause at a time (WHERE, ORDER BY, JOIN). Test after each step.</p>
              <p><strong>Read the results:</strong> Unexpected output is a clue, not a failure.</p>
              <p><strong>Think like an analyst:</strong> Ask "What business question am I answering?" instead of "What SQL should I write?"</p>
            </div>
          </section>

          <section>
            <h3 className="text-accent font-noir font-bold mb-2">What you'll learn</h3>
            <p className="text-xs">
              SELECT · WHERE · ORDER BY · JOIN · LEFT JOIN · GROUP BY · Aggregate functions · Multi-table analysis
            </p>
            <p className="text-xs text-slate-400 mt-2">
              More importantly, you'll develop the mindset professional analysts use every day: asking better questions, investigating with evidence, and solving business problems with data.
            </p>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}
