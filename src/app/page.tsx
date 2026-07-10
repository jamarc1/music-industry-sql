"use client";

import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [emailNote, setEmailNote] = useState("NO SPAM. ONE EMAIL WHEN EPISODE TWO OPENS.");

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    if (input?.value) {
      setEmailNote("GOT IT — YOU'RE ON THE LIST.");
      input.value = "";
    }
  };

  return (
    <div style={styles.root}>
      {/* Navigation */}
      <header style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.wordmark}>
            Halcyon Records <span style={{ color: "var(--accent)" }}>· Data Integrity</span>
          </div>
          <ul style={styles.tabs}>
            <li><a href="#brief" style={styles.tabLink}>Case Brief</a></li>
            <li><a href="#method" style={styles.tabLink}>Method</a></li>
            <li><a href="#dossier" style={styles.tabLink}>Dossier</a></li>
            <li><a href="#faq" style={styles.tabLink}>FAQ</a></li>
          </ul>
          <Link href="/game" style={styles.btnPrimary}>
            Start the Investigation
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero} id="brief">
        <div style={styles.wrap}>
          <div style={styles.heroGrid}>
            {/* Case Card */}
            <div style={styles.caseCard}>
              <div style={styles.caseMeta}>
                <span><strong>Case</strong> No. 001</span>
                <span><strong>Assigned to</strong> You</span>
                <span><strong>Division</strong> Data Integrity</span>
              </div>
              <span style={styles.eyebrow}>The A&R Files</span>
              <h1 style={styles.h1}>
                Halcyon Records has a data integrity problem. You're the analyst who solves it.
              </h1>
              <p style={styles.heroSub}>
                Open the file. Every clue is a query. Four investigations — streaming fraud, missing credits, chart manipulation, royalty theft — solved with real SQL, right in your browser.
              </p>
              <div style={styles.heroCtaRow}>
                <Link href="/game" style={styles.btnPrimary}>
                  Start the Investigation
                </Link>
                <a href="#method" style={styles.btnGhost}>
                  See how it works
                </a>
              </div>
              <div style={styles.finePrint}>
                FREE TO PLAY · NO INSTALL · RUNS ENTIRELY IN YOUR BROWSER
              </div>
            </div>

            {/* Terminal Demo */}
            <div style={styles.terminal}>
              <div style={styles.terminalBar}>
                <span style={{ ...styles.dot, background: "var(--danger)" }} />
                <span style={{ ...styles.dot, background: "var(--accent)" }} />
                <span style={{ ...styles.dot, background: "var(--success)" }} />
                <span style={{ marginLeft: "6px" }}>query_editor.sql</span>
              </div>
              <div style={styles.terminalBody}>
                <div style={styles.line}>
                  <span style={styles.cmt}>-- Case 001: streaming activity, Q3</span>
                </div>
                <div style={styles.line}>
                  <span style={styles.kw}>SELECT</span> track_id, artist, play_count
                </div>
                <div style={styles.line}>
                  <span style={styles.kw}>FROM</span> streams
                </div>
                <div style={styles.line}>
                  <span style={styles.kw}>WHERE</span> play_count &gt; <span style={styles.str}>1000000</span>
                </div>
                <div style={styles.line}>
                  <span style={styles.kw}>AND</span> unique_listeners &lt; <span style={styles.str}>500</span>;
                </div>
                <div style={styles.line}>
                  &nbsp;<span style={styles.cursor} />
                </div>
                <div style={styles.resultTable}>
                  <div style={styles.resultRowHead}>
                    <span>track_id</span><span>artist</span><span>flag</span>
                  </div>
                  <div style={styles.resultRow}>
                    <span>TRK-2291</span><span>Midnight Runner</span>
                    <span style={styles.flag}>⚠ anomaly</span>
                  </div>
                  <div style={styles.resultRow}>
                    <span>TRK-0847</span><span>Coastline</span>
                    <span style={styles.flag}>⚠ anomaly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Difference Section */}
      <section style={styles.section}>
        <div style={styles.wrap}>
          <div style={styles.sectionHead}>
            <span style={styles.eyebrow}>The difference</span>
            <h2 style={styles.h2}>This isn't another SQL course.</h2>
            <p>Tutorials teach you to write a query. They rarely give you a reason to care about the answer. This does.</p>
          </div>
          <div style={styles.compare}>
            <div style={styles.compareCardBad}>
              <h3 style={styles.h3}>The usual drill</h3>
              <ul style={styles.ul}>
                <li>Isolated exercises with no stakes</li>
                <li>Correct syntax, no context for why it matters</li>
                <li>Forgettable the moment the course ends</li>
                <li>You practice SQL in a vacuum</li>
              </ul>
            </div>
            <div style={styles.compareCardGood}>
              <h3 style={styles.h3}>The case file method</h3>
              <ul style={styles.ul}>
                <li>A real case, assigned by your boss</li>
                <li>A wrong query means a wrong answer to a real question</li>
                <li>Four investigations deep, one throughline</li>
                <li>You use SQL to actually find something out</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.section}>
        <div style={styles.wrap}>
          <div style={styles.sectionHead}>
            <span style={styles.eyebrow}>How it works</span>
            <h2 style={styles.h2}>Four steps. One case at a time.</h2>
          </div>
          <div style={styles.steps}>
            {[
              { num: "01", title: "Get the case", desc: "Chief Reyes hands you an investigation — streaming fraud, missing credits, chart manipulation, or royalty theft." },
              { num: "02", title: "Query the database", desc: "A real relational database, running in your browser. You write the actual SQL — nothing is simulated." },
              { num: "03", title: "Find the answer", desc: "Hints are there if you're stuck, but the database only gives up the truth to the right query." },
              { num: "04", title: "Close the case", desc: "Earn XP and a badge, then move to the next investigation — with a few loose threads that don't stay loose forever." },
            ].map((step) => (
              <div key={step.num} style={styles.step}>
                <div style={styles.stepNum}>{step.num}</div>
                <h3 style={styles.h3}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chief Reyes Section */}
      <section id="dossier" style={styles.section}>
        <div style={styles.wrap}>
          <div style={styles.sectionHead}>
            <span style={styles.eyebrow}>Meet the division</span>
            <h2 style={styles.h2}>Your boss doesn't want a report. She wants an answer.</h2>
          </div>
          <div style={styles.divisionGrid}>
            <div style={styles.personnel}>
              <div style={styles.avatar}>CR</div>
              <dl style={styles.dl}>
                <dt>Name</dt><dd>Chief Reyes</dd>
                <dt>Role</dt><dd>Head, Data Integrity Division</dd>
                <dt>Status</dt><dd>Watching your query history</dd>
              </dl>
            </div>
            <div style={styles.divisionCopy}>
              <p>
                You've just been hired as a Data Analyst at Halcyon Records. Chief Reyes doesn't hand out busywork — every case on your desk is a real problem the label needs solved: someone's numbers don't add up, and it's your job to find out why, with nothing but a database and a query editor.
              </p>
              <blockquote style={styles.blockquote}>
                "I don't need a dashboard. I need to know who did this, and I need it backed by a query I can defend in a room full of lawyers."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Mockups */}
      <section style={styles.section}>
        <div style={styles.wrap}>
          <div style={styles.sectionHead}>
            <span style={styles.eyebrow}>Inside the file</span>
            <h2 style={styles.h2}>What it actually looks like.</h2>
          </div>
          <div style={styles.mockGrid}>
            <div style={styles.mockCard}>
              <div style={styles.mockLabel}>Badge unlocked</div>
              <div style={styles.mockBody}>
                <div style={styles.badgeMock}>✓</div>
              </div>
            </div>
            <div style={styles.mockCard}>
              <div style={styles.mockLabel}>Case dialogue</div>
              <div style={styles.mockBody}>
                <div style={styles.dialogueMock}>
                  <div style={styles.who}>CHIEF REYES</div>
                  <div>"Play counts don't lie. People do. Find out which one this is."</div>
                </div>
              </div>
            </div>
            <div style={styles.mockCard}>
              <div style={styles.mockLabel}>Progress</div>
              <div style={styles.mockBody}>
                <div style={styles.xpMock}>
                  <div style={styles.xpLabel}>CASE 2 OF 4 · 620 XP</div>
                  <div style={styles.xpBar}>
                    <div style={styles.xpFill} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section style={styles.section}>
        <div style={styles.wrap}>
          <div style={styles.sectionHead}>
            <span style={styles.eyebrow}>Who this is for</span>
            <h2 style={styles.h2}>Built for people who'd rather investigate than drill.</h2>
          </div>
          <div style={styles.chipRow}>
            {["Aspiring analysts", "Career switchers into data", "BI professionals sharpening real skills", "Anyone who's bounced off a SQL course"].map((chip) => (
              <span key={chip} style={styles.chip}>{chip}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section style={styles.section}>
        <div style={styles.wrap}>
          <div style={styles.cred}>
            <div style={styles.credMark}>HA</div>
            <p>
              <strong>Built by a data strategy consultant</strong> who's spent years teaching SQL in live workshops — every case in this file is drawn from patterns real analysts actually get stuck on, not invented in a vacuum. Same architecture that powers Data Detective, the studio's first title.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={styles.section}>
        <div style={styles.wrap}>
          <div style={styles.sectionHead}>
            <span style={styles.eyebrow}>Before you start</span>
            <h2 style={styles.h2}>Frequently asked.</h2>
          </div>
          {[
            { q: "Is it actually free?", a: "Yes. Episode One — all four cases — is free to play, no account required to start." },
            { q: "Do I need to already know SQL?", a: "No. The cases are built to work for beginners through intermediate — the game gives you enough of the schema and hints to reason your way to the query." },
            { q: "Do I need to install anything?", a: "No. It runs entirely in your browser using an in-browser database — no backend, no setup, nothing to download." },
            { q: "How long does it take?", a: "Most players get through all four cases in about 45–90 minutes, depending on how much you lean on hints." },
          ].map((faq) => (
            <details key={faq.q} style={styles.details}>
              <summary style={styles.summary}>{faq.q}</summary>
              <p style={styles.detailsP}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.section}>
        <div style={{ ...styles.wrap, maxWidth: "640px" }}>
          <div style={styles.finalCta}>
            <span style={styles.eyebrow}>Case still open</span>
            <h2 style={styles.h2}>Chief Reyes is waiting on your report.</h2>
            <p>Free to play, right now, in your browser. When you're done — or if you get stuck — I'd genuinely like to know.</p>
            <Link href="/game" style={styles.btnPrimary}>
              Start the Investigation — Free
            </Link>
            <form style={styles.emailRow} onSubmit={handleEmailSubmit}>
              <input
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
                style={styles.emailInput}
              />
              <button type="submit" style={styles.emailButton}>
                Notify me for Episode Two
              </button>
            </form>
            <div style={styles.emailNote}>{emailNote}</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.wrap}>
          The A&R Files — a Halcyon Records case file. Part of the same universe as{" "}
          <a href="#" style={{ color: "var(--accent-soft)", textDecoration: "none" }}>
            Data Detective
          </a>
          .
        </div>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    margin: 0,
    background: "var(--background)",
    color: "var(--foreground)",
    fontFamily: "var(--font-geist-sans)",
    lineHeight: 1.55,
    WebkitFontSmoothing: "antialiased",
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(11,15,26,0.9)",
    backdropFilter: "blur(6px)",
    borderBottom: "1px solid var(--panel-border)",
  },
  navInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    maxWidth: "1120px",
    margin: "0 auto",
  },
  wordmark: {
    fontFamily: "var(--font-detective)",
    fontSize: "1.05rem",
    letterSpacing: "0.01em",
  },
  tabs: {
    display: "flex",
    gap: "4px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  tabLink: {
    display: "inline-block",
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textDecoration: "none",
    color: "var(--foreground)",
    opacity: 0.55,
    padding: "8px 12px",
    border: "1px solid var(--panel-border)",
    borderTop: "none",
    borderRadius: "0 0 4px 4px",
    cursor: "pointer",
    transition: "opacity 0.15s ease, color 0.15s ease, border-color 0.15s ease",
  },
  btnPrimary: {
    background: "var(--accent)",
    color: "var(--background)",
    padding: "15px 28px",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    fontFamily: "var(--font-geist-sans)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
    display: "inline-block",
    textDecoration: "none",
  },
  btnGhost: {
    background: "transparent",
    color: "var(--foreground)",
    border: "1px solid var(--panel-border)",
    padding: "14px 26px",
    fontSize: "0.95rem",
    borderRadius: "4px",
    fontFamily: "var(--font-geist-sans)",
    fontWeight: 600,
    cursor: "pointer",
    transition: "border-color 0.15s ease, color 0.15s ease",
    display: "inline-block",
    textDecoration: "none",
  },
  hero: {
    padding: "64px 0 88px",
  },
  wrap: {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "0 24px",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "28px",
  },
  caseCard: {
    background: "var(--panel)",
    border: "1px solid var(--panel-border)",
    borderRadius: "4px",
    padding: "36px 32px",
    position: "relative",
  },
  caseMeta: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.75rem",
    color: "var(--foreground)",
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
    marginBottom: "22px",
    borderBottom: "1px dashed var(--panel-border)",
    paddingBottom: "14px",
    opacity: 0.55,
  },
  eyebrow: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.72rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "var(--accent)",
  },
  h1: {
    fontFamily: "var(--font-detective)",
    fontSize: "clamp(1.5rem, 3.6vw, 2.3rem)",
    lineHeight: 1.28,
    marginBottom: "16px",
    margin: "16px 0",
  },
  h2: {
    fontFamily: "var(--font-detective)",
    fontSize: "clamp(1.3rem, 2.6vw, 1.8rem)",
    marginTop: "10px",
    lineHeight: 1.4,
  },
  h3: {
    fontFamily: "var(--font-detective)",
    fontSize: "1.05rem",
    marginBottom: "16px",
  },
  heroSub: {
    fontSize: "1.02rem",
    color: "var(--foreground)",
    opacity: 0.75,
    marginBottom: "26px",
    maxWidth: "46ch",
  },
  heroCtaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    alignItems: "center",
  },
  finePrint: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.72rem",
    color: "var(--foreground)",
    opacity: 0.45,
    marginTop: "18px",
    letterSpacing: "0.02em",
  },
  terminal: {
    background: "var(--panel)",
    border: "1px solid var(--panel-border)",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  terminalBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    background: "var(--background)",
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.7rem",
    color: "var(--foreground)",
    opacity: 0.6,
    borderBottom: "1px solid var(--panel-border)",
  },
  dot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
  },
  terminalBody: {
    padding: "22px 20px",
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.82rem",
    flex: 1,
  },
  line: {
    minHeight: "1.5em",
    opacity: 1,
  },
  cmt: {
    color: "var(--foreground)",
    opacity: 0.4,
  },
  kw: {
    color: "var(--accent-soft)",
  },
  str: {
    color: "var(--success)",
  },
  cursor: {
    display: "inline-block",
    width: "7px",
    height: "1em",
    background: "var(--accent-soft)",
    verticalAlign: "text-bottom",
  },
  resultTable: {
    marginTop: "16px",
    borderTop: "1px solid var(--panel-border)",
    paddingTop: "14px",
  },
  resultRow: {
    display: "flex",
    gap: "18px",
    padding: "5px 0",
    color: "var(--foreground)",
    opacity: 0.6,
    fontSize: "0.78rem",
  },
  resultRowHead: {
    display: "flex",
    gap: "18px",
    padding: "5px 0",
    opacity: 1,
    fontWeight: 600,
    color: "var(--foreground)",
    fontSize: "0.78rem",
  },
  flag: {
    color: "var(--danger)",
    fontWeight: 600,
    opacity: 1,
  },
  section: {
    padding: "72px 0",
    borderTop: "1px solid var(--panel-border)",
  },
  sectionHead: {
    maxWidth: "640px",
    marginBottom: "40px",
  },
  compare: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "1fr",
  },
  compareCardBad: {
    borderRadius: "4px",
    padding: "28px 26px",
    background: "var(--panel)",
    border: "1px solid var(--panel-border)",
  },
  compareCardGood: {
    borderRadius: "4px",
    padding: "28px 26px",
    background: "var(--panel)",
    border: "1px solid var(--accent)",
  },
  ul: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  steps: {
    display: "grid",
    gap: "22px",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  step: {
    background: "var(--panel)",
    border: "1px solid var(--panel-border)",
    borderRadius: "4px",
    padding: "24px 22px",
    borderLeft: "2px solid var(--accent)",
  },
  stepNum: {
    fontFamily: "var(--font-geist-mono)",
    color: "var(--accent)",
    fontSize: "0.85rem",
  },
  stepDesc: {
    color: "var(--foreground)",
    opacity: 0.65,
    fontSize: "0.9rem",
    margin: 0,
  },
  divisionGrid: {
    display: "grid",
    gap: "28px",
    alignItems: "center",
  },
  personnel: {
    background: "var(--panel)",
    border: "1px solid var(--panel-border)",
    borderRadius: "4px",
    padding: "20px",
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.75rem",
  },
  avatar: {
    width: "100%",
    aspectRatio: "3 / 4",
    borderRadius: "2px",
    background: "var(--background)",
    border: "1px solid var(--panel-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--accent)",
    fontFamily: "var(--font-detective)",
    fontSize: "2.4rem",
    marginBottom: "12px",
  },
  dl: {
    margin: 0,
  },
  divisionCopy: {
    color: "var(--foreground)",
    opacity: 0.75,
    fontSize: "1rem",
  },
  blockquote: {
    margin: "18px 0 0",
    paddingLeft: "18px",
    borderLeft: "2px solid var(--success)",
    fontFamily: "var(--font-detective)",
    fontSize: "1.05rem",
    color: "var(--foreground)",
    opacity: 0.95,
  },
  mockGrid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  },
  mockCard: {
    background: "var(--panel)",
    borderRadius: "4px",
    overflow: "hidden",
    border: "1px solid var(--panel-border)",
  },
  mockLabel: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.68rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--foreground)",
    opacity: 0.5,
    padding: "12px 16px",
    borderBottom: "1px solid var(--panel-border)",
  },
  mockBody: {
    padding: "20px 16px",
    minHeight: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeMock: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    background: "radial-gradient(circle at 30% 30%, var(--accent-soft), var(--accent) 65%, #a97a2c 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-detective)",
    color: "var(--background)",
    fontSize: "1.7rem",
    boxShadow: "0 8px 24px rgba(217,164,65,0.3)",
  },
  dialogueMock: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.82rem",
    color: "var(--foreground)",
  },
  who: {
    color: "var(--accent-soft)",
    fontWeight: 600,
    marginBottom: "6px",
  },
  xpMock: {
    width: "100%",
  },
  xpLabel: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.75rem",
    color: "var(--foreground)",
    opacity: 0.6,
  },
  xpBar: {
    height: "10px",
    borderRadius: "6px",
    background: "var(--background)",
    border: "1px solid var(--panel-border)",
    overflow: "hidden",
    marginTop: "10px",
  },
  xpFill: {
    height: "100%",
    width: "62%",
    background: "linear-gradient(90deg, var(--success), var(--accent))",
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  chip: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.78rem",
    letterSpacing: "0.02em",
    border: "1px solid var(--panel-border)",
    color: "var(--accent-soft)",
    padding: "9px 16px",
    borderRadius: "999px",
    background: "var(--panel)",
  },
  cred: {
    background: "var(--panel)",
    border: "1px solid var(--panel-border)",
    borderRadius: "4px",
    padding: "32px",
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  credMark: {
    fontFamily: "var(--font-detective)",
    fontSize: "1.2rem",
    color: "var(--accent)",
    border: "1px solid var(--panel-border)",
    borderRadius: "50%",
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  details: {
    background: "var(--panel)",
    borderRadius: "4px",
    padding: "4px 20px",
    marginBottom: "10px",
    border: "1px solid var(--panel-border)",
  },
  summary: {
    cursor: "pointer",
    padding: "16px 0",
    fontWeight: 600,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.98rem",
    fontFamily: "var(--font-geist-sans)",
    listStyle: "none",
  },
  detailsP: {
    color: "var(--foreground)",
    opacity: 0.65,
    margin: "0 0 18px",
    fontSize: "0.92rem",
  },
  finalCta: {
    background: "var(--panel)",
    border: "1px solid var(--accent)",
    borderRadius: "6px",
    padding: "52px 40px",
    textAlign: "center",
    margin: "0 auto",
  },
  emailRow: {
    display: "flex",
    gap: "10px",
    maxWidth: "420px",
    margin: "28px auto 0",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emailInput: {
    flex: 1,
    minWidth: "220px",
    padding: "13px 14px",
    borderRadius: "4px",
    border: "1px solid var(--panel-border)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.92rem",
    background: "var(--background)",
    color: "var(--foreground)",
  },
  emailButton: {
    background: "var(--accent)",
    color: "var(--background)",
    padding: "13px 20px",
    fontSize: "0.9rem",
    border: "none",
    borderRadius: "4px",
    fontFamily: "var(--font-geist-sans)",
    fontWeight: 600,
    cursor: "pointer",
  },
  emailNote: {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "0.7rem",
    color: "var(--foreground)",
    opacity: 0.45,
    marginTop: "14px",
  },
  footer: {
    padding: "40px 0 60px",
    textAlign: "center",
    color: "var(--foreground)",
    opacity: 0.5,
    fontSize: "0.82rem",
  },
};
