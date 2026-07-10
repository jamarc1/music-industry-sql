"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export default function EmailCaptureModal({ isOpen, onClose, onSubmit }: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    // Log the event for Mailchimp integration
    console.log("[EmailCapture]", {
      event: "email_captured",
      email,
      timestamp: new Date().toISOString(),
      source: "game_case_1_completion",
    });

    // Store locally
    localStorage.setItem("ar-files-captured-email", email);
    localStorage.setItem("ar-files-email-captured-at", new Date().toISOString());

    // Brief delay for UX feedback
    setTimeout(() => {
      onSubmit(email);
      setEmail("");
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  const handleDismiss = () => {
    // Mark that we've shown this prompt, even if skipped
    localStorage.setItem("ar-files-email-prompt-shown", "true");
    console.log("[EmailCapture]", {
      event: "email_prompt_dismissed",
      timestamp: new Date().toISOString(),
      source: "game_case_1_completion",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="noir-panel relative w-full max-w-md rounded-lg p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 text-foreground/40 transition hover:text-foreground"
              aria-label="Close"
            >
              ✕
            </button>

            <p className="font-noir text-xs uppercase tracking-widest text-accent mb-3">
              Episode Two
            </p>
            <h2 className="font-serif text-lg font-bold text-foreground mb-2">
              Great work, detective.
            </h2>
            <p className="text-sm text-foreground/70 mb-5">
              Save your progress and get notified when Episode Two opens.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-md border border-accent/30 bg-background px-3 py-2 text-sm text-foreground placeholder-foreground/40 transition focus:border-accent focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="flex-1 rounded-md border-2 border-accent bg-accent/10 px-3 py-2 text-sm font-noir text-accent-soft transition hover:bg-accent/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving…" : "Save email"}
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 rounded-md border border-accent/30 bg-transparent px-3 py-2 text-sm font-noir text-foreground/60 transition hover:text-foreground/80"
                >
                  Skip
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs text-foreground/40">
              No spam. One email when Episode Two opens.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
