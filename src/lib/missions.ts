import { Mission, QueryResult } from "@/types";

function sqlHas(sql: string, pattern: RegExp): boolean {
  return pattern.test(sql.replace(/\s+/g, " ").trim());
}

function countMatches(sql: string, pattern: RegExp): number {
  return (sql.match(pattern) || []).length;
}

/** True if every requested column is present in the result (SELECT * satisfies this too). */
function resultHasColumns(result: QueryResult, names: string[]): boolean {
  const cols = new Set(result.columns.map((c) => c.toLowerCase()));
  return names.every((n) => cols.has(n.toLowerCase()));
}

/**
 * Checks whether `rows` are consistently sorted by `key`, in either direction.
 * Compares numerically when possible, otherwise falls back to string comparison
 * (ISO date/timestamp strings sort correctly lexically).
 */
function isSortedByKey(
  rows: Record<string, unknown>[],
  key: string
): "asc" | "desc" | null {
  const values = rows.map((r) => r[key]);
  if (values.some((v) => v === null || v === undefined)) return null;

  const compare = (a: unknown, b: unknown): number => {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb;
    return String(a).localeCompare(String(b));
  };

  const asc = values.every((v, i) => i === 0 || compare(values[i - 1], v) <= 0);
  if (asc) return "asc";
  const desc = values.every((v, i) => i === 0 || compare(values[i - 1], v) >= 0);
  if (desc) return "desc";
  return null;
}

// ============================================================
// CASE 1 — The Bot Stream Scandal
// ============================================================
export const MISSION_1: Mission = {
  id: "case-1",
  title: "The Bot Stream Scandal",
  caseNumber: "Case No. 001",
  difficulty: "beginner",
  briefing: [
    "Chief Reyes drops a printout on your desk without sitting down.",
    "\"Overnight, 'Neon Static' by Cassette Youth jumped from forty thousand daily streams to two hundred ten thousand.\"",
    "\"If it holds, it hits Pulse100 eligibility by Friday. Marketing's already popping champagne.\"",
    "\"I don't celebrate numbers I haven't checked. Before Halcyon reports a single one of these — prove they're real.\"",
  ],
  tasks: [
    {
      id: "task-c1-select",
      concept: "SELECT",
      chiefIntro: [
        "\"Before we celebrate or panic, just show me what's actually in the play log for Neon Static.\"",
      ],
      detectiveQuestion: "What's actually in the play log?",
      objective: "Pull the play log for Neon Static (track_id 'T001'), including played_at, duration_seconds, and device_type.",
      chiefLine: "Don't filter for anything suspicious yet. Just see what fields exist for this track.",
      evidenceAvailable: "Play Log",
      instructions: "Show the play log for track T001.",
      starterSql: "",
      hints: {
        detective: "You don't need to filter for anything suspicious yet — just see what fields exist for this track.",
        data: "FROM streams, filtered to track_id = 'T001'. Make sure played_at, duration_seconds, and device_type are in the output.",
        sql: "SELECT track_id, played_at, duration_seconds, device_type\nFROM streams\nWHERE track_id = 'T001';",
      },
      badgeId: "badge-clean-pull",
      clueId: "clue-play-log",
      successDialogue: ["\"There's the raw log. Now let's see if the numbers behave.\""],
      chiefReaction: {
        clean: "Clean pull. Let's see if the numbers behave.",
        standard: "That's the play log. Now we can actually look at it.",
        bruteForce: "You got there. Next time, trust that you know what a SELECT looks like before you go digging for the answer.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /select/i)) return { success: false, message: "Your query needs to start with SELECT." };
        if (!sqlHas(sql, /from\s+streams/i)) return { success: false, message: "You need to read FROM the streams table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t001'/i)) return { success: false, message: "Filter to this track with WHERE track_id = 'T001'." };
        if (!resultHasColumns(result, ["played_at", "duration_seconds", "device_type"])) {
          return { success: false, message: "Include played_at, duration_seconds, and device_type (or use SELECT *)." };
        }
        return { success: true };
      },
      resultInsight: (result) =>
        result.rowCount === 0 ? "No plays for this track. That can't be right." : "Twelve streams on the log. Some of them are about to look wrong.",
    },
    {
      id: "task-c1-where",
      concept: "WHERE",
      chiefIntro: ["\"A real listen takes at least 15 seconds to register. Find every stream that doesn't.\""],
      detectiveQuestion: "Which streams are too short to be real?",
      objective: "From track T001, find every stream shorter than 15 seconds — too short to count as a real listen.",
      chiefLine: "Fifteen seconds is the cutoff I trust. Anything under that never really played.",
      evidenceAvailable: "Sub-15-Second Streams",
      instructions: "Find the streams under 15 seconds.",
      starterSql: "",
      hints: {
        detective: "You're not looking for real listens anymore — you're looking for ones too short to be real.",
        data: "WHERE track_id = 'T001' AND duration_seconds < 15 — 15 seconds is the cutoff Reyes trusts.",
        sql: "SELECT *\nFROM streams\nWHERE track_id = 'T001' AND duration_seconds < 15;",
      },
      badgeId: "badge-bot-signature",
      clueId: "clue-short-streams",
      successDialogue: ["\"That's a lot of 'listens' that aren't listens. Keep going.\""],
      chiefReaction: {
        clean: "That's a lot of 'listens' that aren't listens. Keep going.",
        standard: "There's the short ones. That's not how real fans listen.",
        bruteForce: "Right answer. Filtering logic like this needs to be reflex by Case 3.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+streams/i)) return { success: false, message: "Keep reading FROM the streams table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t001'/i)) return { success: false, message: "Keep the track filter: track_id = 'T001'." };
        if (!sqlHas(sql, /duration_seconds\s*<\s*15/i) || sqlHas(sql, /duration_seconds\s*<=/i)) {
          return { success: false, message: "Filter for streams under 15 seconds: duration_seconds < 15 (not <= , not inverted)." };
        }
        if (result.rowCount === 0) return { success: false, message: "That returned nothing. Check your threshold." };
        const allShort = result.rows.every((r) => Number(r.duration_seconds) < 15);
        if (!allShort) return { success: false, message: "Some of these streams are 15 seconds or longer — those are real listens." };
        return { success: true };
      },
      resultInsight: (result) => `${result.rowCount} streams too short to be real. That's your bot signature.`,
    },
    {
      id: "task-c1-order",
      concept: "ORDER BY",
      chiefIntro: ["\"Line those suspicious streams up in the order they happened. I want to see exactly when this started.\""],
      detectiveQuestion: "When did the fake streaming start?",
      objective: "Take the sub-15-second streams for T001 and order them by played_at, earliest first.",
      chiefLine: "The earliest timestamp is the minute this operation switched on.",
      evidenceAvailable: "The 2 AM Spike",
      instructions: "Sort the suspicious streams by time, earliest first.",
      starterSql: "",
      hints: {
        detective: "You've got the suspicious streams — now put them in time order instead of a pile.",
        data: "ORDER BY played_at, earliest first.",
        sql: "SELECT *\nFROM streams\nWHERE track_id = 'T001' AND duration_seconds < 15\nORDER BY played_at ASC;",
      },
      badgeId: "badge-timestamp",
      clueId: "clue-2am-spike",
      successDialogue: ["\"2:14 AM. Nobody's real fanbase wakes up at 2 AM in perfect unison.\""],
      chiefReaction: {
        clean: "2:14 AM. Nobody's real fanbase wakes up at 2 AM in perfect unison.",
        standard: "There's the timeline. It starts at 2:14 AM sharp.",
        bruteForce: "You found the timestamp. Good. Now remember it — 2 AM is about to matter.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /track_id\s*=\s*'t001'/i) || !sqlHas(sql, /duration_seconds\s*<\s*15/i)) {
          return { success: false, message: "Keep your suspicious-stream filter: track_id = 'T001' AND duration_seconds < 15." };
        }
        if (!sqlHas(sql, /order\s+by\s+played_at/i)) return { success: false, message: "Sort by played_at to build the timeline." };
        if (sqlHas(sql, /order\s+by\s+played_at\s+desc/i)) return { success: false, message: "We need earliest first — ascending, not DESC." };
        if (isSortedByKey(result.rows, "played_at") !== "asc") {
          return { success: false, message: "The rows aren't in ascending played_at order yet." };
        }
        return { success: true };
      },
      resultInsight: () => "The spike begins at 2:14 AM and runs for five minutes. That's a machine, not a fanbase.",
    },
    {
      id: "task-c1-join",
      concept: "JOIN",
      chiefIntro: ["\"Those accounts streaming at 2 AM — who are they? Join the streams to the account records.\""],
      detectiveQuestion: "Who owns the accounts behind the spike?",
      objective: "Join the suspicious streams to user_accounts on user_id, and pull account_created, signup_ip, and email_domain.",
      chiefLine: "The streams table tells you what happened. user_accounts tells you who.",
      evidenceAvailable: "PulseBoost Media",
      instructions: "Join the streams to the account records.",
      starterSql: "",
      hints: {
        detective: "The streams table only tells you what happened — you need user_accounts to find out who.",
        data: "JOIN user_accounts on user_id, keep your duration filter, and pull account_created, signup_ip, and email_domain.",
        sql: "SELECT s.user_id, u.account_created, u.signup_ip, u.email_domain\nFROM streams s\nJOIN user_accounts u ON s.user_id = u.user_id\nWHERE s.track_id = 'T001' AND s.duration_seconds < 15;",
      },
      badgeId: "badge-first-join",
      clueId: "clue-pulseboost",
      successDialogue: [
        "\"Same IP block. Same signup day. Same email domain — pulseboost-media.net.\"",
        "\"That's not a fanbase. That's one operation.\"",
        "\"PulseBoost. Again. Write this one up — legal's going to want it in plain English.\"",
        "(quieter, half to herself) \"PulseBoost's changed names twice since I first ran into an outfit like it. Some things don't actually go away.\"",
      ],
      chiefReaction: {
        clean: "PulseBoost. Again. One IP block, one signup day, one domain. Write it up — legal will want this in plain English.",
        standard: "There's your operation — all of it registered to PulseBoost Media.",
        bruteForce: "There it is. Next time I want you seeing the join before I have to point at it.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /join/i)) return { success: false, message: "You need a JOIN to connect streams to the account records." };
        if (!sqlHas(sql, /user_accounts/i)) return { success: false, message: "Join to the user_accounts table." };
        if (!sqlHas(sql, /on\s+[^;]*user_id/i)) return { success: false, message: "Join ON user_id — without an ON clause you'll get a cartesian mess." };
        if (!sqlHas(sql, /track_id\s*=\s*'t001'/i) || !sqlHas(sql, /duration_seconds\s*<\s*15/i)) {
          return { success: false, message: "Keep your duration filter so you only join the suspicious streams." };
        }
        if (!resultHasColumns(result, ["account_created", "signup_ip", "email_domain"])) {
          return { success: false, message: "Pull account_created, signup_ip, and email_domain (or use SELECT *)." };
        }
        return { success: true };
      },
      resultInsight: () => "Every flagged account: same IP block, same signup day, one email domain — PulseBoost Media.",
    },
  ],
  debrief: [
    "\"Neon Static's numbers are a fraud. Two hundred thousand streams, and a fifth of them came from one shell firm's server rack.\"",
    "\"You proved it before we reported it. That's the whole job.\"",
    "\"Good work. File it — and keep the name PulseBoost somewhere you won't lose it.\"",
  ],
  badgeOnComplete: "badge-golden-ear",
  xpOnComplete: 50,
};

// ============================================================
// CASE 2 — The Ghost Producer
// ============================================================
export const MISSION_2: Mission = {
  id: "case-2",
  title: "The Ghost Producer",
  caseNumber: "Case No. 002",
  difficulty: "intermediate",
  briefing: [
    "\"'Gravity' just hit number one. Credited to Nova Ferris, solo. No co-writers, no co-producers.\"",
    "\"Theo Marsh — signed to a rival label — says he co-produced and co-wrote it, uncredited, and he wants his royalties.\"",
    "\"Before this becomes a lawsuit, I want the studio paper trail. Not what anybody claims. What the records show.\"",
  ],
  tasks: [
    {
      id: "task-c2-select",
      concept: "SELECT",
      chiefIntro: ["\"Pull the official credited writers on Gravity. Let's see what the paperwork says.\""],
      detectiveQuestion: "Who does the paperwork credit?",
      objective: "Pull the credited writers on Gravity (track_id 'T014') — contributor_id, role, and credit_percentage.",
      chiefLine: "Start with what the label's own paperwork claims before you go anywhere else.",
      evidenceAvailable: "Credit Sheet",
      instructions: "Show the credited writers on T014.",
      starterSql: "",
      hints: {
        detective: "Just look at what the label's own paperwork claims before you go anywhere else.",
        data: "FROM songwriter_credits, WHERE track_id = 'T014', showing contributor_id, role, and credit_percentage.",
        sql: "SELECT contributor_id, role, credit_percentage\nFROM songwriter_credits\nWHERE track_id = 'T014';",
      },
      badgeId: "badge-clean-pull",
      clueId: "clue-credit-sheet",
      successDialogue: ["\"One name, 100%. Convenient — if it's true.\""],
      chiefReaction: {
        clean: "One name, 100%. Convenient — if it's true.",
        standard: "That's the credit sheet. One name, all of it.",
        bruteForce: "You got the credit sheet. Reading a table like this should be automatic by now.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+songwriter_credits/i)) return { success: false, message: "Read FROM the songwriter_credits table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t014'/i)) return { success: false, message: "Filter to this track: WHERE track_id = 'T014'." };
        if (!resultHasColumns(result, ["contributor_id", "role", "credit_percentage"])) {
          return { success: false, message: "Include contributor_id, role, and credit_percentage (or use SELECT *)." };
        }
        return { success: true };
      },
      resultInsight: () => "One credited writer at 100%. Either the whole truth, or a very clean cover story.",
    },
    {
      id: "task-c2-where",
      concept: "WHERE",
      chiefIntro: ["\"Now show me who was actually in the studio. Filter the session logs for Gravity.\""],
      detectiveQuestion: "Who was actually in the studio?",
      objective: "Filter the studio session logs to Gravity (track_id 'T014').",
      chiefLine: "Session logs don't care about credit sheets. They record who actually showed up.",
      evidenceAvailable: "Session Logs",
      instructions: "Filter the session logs to T014.",
      starterSql: "",
      hints: {
        detective: "Session logs don't care about credit sheets — they just record who actually showed up.",
        data: "FROM studio_sessions, WHERE track_id = 'T014'.",
        sql: "SELECT *\nFROM studio_sessions\nWHERE track_id = 'T014';",
      },
      badgeId: "badge-bot-signature",
      clueId: "clue-session-logs",
      successDialogue: ["\"Two names booked. One of them isn't on the credit sheet.\""],
      chiefReaction: {
        clean: "Two names booked. One of them isn't on the credit sheet.",
        standard: "There's the sessions. Two people were in that room, not one.",
        bruteForce: "You found the gap. Next time, notice it before I have to ask.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+studio_sessions/i)) return { success: false, message: "Read FROM the studio_sessions table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t014'/i)) return { success: false, message: "Filter to this track: WHERE track_id = 'T014'." };
        if (result.rowCount === 0) return { success: false, message: "No sessions came back. Check your filter." };
        return { success: true };
      },
      resultInsight: () => "Two contributors booked studio time. The credit sheet only names one of them.",
    },
    {
      id: "task-c2-order",
      concept: "ORDER BY",
      chiefIntro: ["\"Order those sessions by date. I want to know who was there from day one.\""],
      detectiveQuestion: "Who was there first?",
      objective: "Order Gravity's studio sessions by session_date, earliest first.",
      chiefLine: "Whoever was there from session one has the strongest claim to the work.",
      evidenceAvailable: "Session Timeline",
      instructions: "Sort the sessions by date, earliest first.",
      starterSql: "",
      hints: {
        detective: "You need these sessions in the order they happened, not just a list.",
        data: "ORDER BY session_date, earliest first.",
        sql: "SELECT *\nFROM studio_sessions\nWHERE track_id = 'T014'\nORDER BY session_date ASC;",
      },
      badgeId: "badge-timestamp",
      clueId: "clue-session-timeline",
      successDialogue: ["\"Marsh was in the room for every session. Ferris joined on session three.\""],
      chiefReaction: {
        clean: "Marsh was in the room for every session. Ferris joined on session three.",
        standard: "There's the order. Marsh was building this before Ferris ever showed up.",
        bruteForce: "You got the timeline. Hold onto it — it's about to matter.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+studio_sessions/i)) return { success: false, message: "Keep reading FROM the studio_sessions table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t014'/i)) return { success: false, message: "Keep the track filter: track_id = 'T014'." };
        if (!sqlHas(sql, /order\s+by\s+session_date/i)) return { success: false, message: "Sort by session_date." };
        if (sqlHas(sql, /order\s+by\s+session_date\s+desc/i)) return { success: false, message: "We need earliest first — ascending, not DESC." };
        if (isSortedByKey(result.rows, "session_date") !== "asc") {
          return { success: false, message: "The sessions aren't in ascending date order yet." };
        }
        return { success: true };
      },
      resultInsight: () => "Marsh: sessions one, two, and three. Ferris: session three only.",
    },
    {
      id: "task-c2-join",
      concept: "JOIN",
      chiefIntro: [
        "\"Join sessions, credits, and royalty statements. Show me who did the work and who got paid for it.\"",
        "\"And think about which join you use — a regular one hides the person you're looking for.\"",
      ],
      detectiveQuestion: "Who did the work but got nothing?",
      objective: "LEFT JOIN studio_sessions to songwriter_credits and to royalty_statements (on track_id and contributor_id) so contributors with no credit or payout still show up as NULL.",
      chiefLine: "A plain JOIN only shows people who match everywhere. You need to see who's missing.",
      evidenceAvailable: "The Ghost Producer",
      instructions: "Join all three tables — and keep the unmatched rows visible.",
      starterSql: "",
      hints: {
        detective: "A regular JOIN only shows you people who match everywhere — you need to see who's missing, not just who matches.",
        data: "LEFT JOIN songwriter_credits and LEFT JOIN royalty_statements onto studio_sessions, matching on track_id and contributor_id both times.",
        sql: "SELECT ss.contributor_id, sc.credit_percentage, rs.amount_paid\nFROM studio_sessions ss\nLEFT JOIN songwriter_credits sc\n  ON ss.track_id = sc.track_id AND ss.contributor_id = sc.contributor_id\nLEFT JOIN royalty_statements rs\n  ON ss.track_id = rs.track_id AND ss.contributor_id = rs.contributor_id\nWHERE ss.track_id = 'T014';",
      },
      badgeId: "badge-left-join",
      clueId: "clue-ghost-producer",
      successDialogue: [
        "\"There he is. Every session, no credit, no royalties. A blank row where a producer should be.\"",
        "\"There's your ghost. Get legal on the phone before Marsh's lawyer beats us to it.\"",
        "\"I signed a writer once who got erased just like this. Cost him his career. Cost me a few things too.\"",
        "\"Get Marsh his credit back — today, not after legal 'reviews' it.\"",
      ],
      chiefReaction: {
        clean: "There's your ghost — every session, NULL credit, NULL royalties. Get legal on the phone before Marsh's lawyer beats us to it.",
        standard: "That blank row is Theo Marsh. He did the work and vanished from the paperwork.",
        bruteForce: "You needed the nudge on that LEFT JOIN. Remember — NULL is often the whole story.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /studio_sessions/i) || !sqlHas(sql, /songwriter_credits/i) || !sqlHas(sql, /royalty_statements/i)) {
          return { success: false, message: "You need all three tables: studio_sessions, songwriter_credits, and royalty_statements." };
        }
        if (!sqlHas(sql, /join/i)) return { success: false, message: "You need to join the tables together." };
        // The INNER JOIN trap — the reveal depends on keeping Marsh's unmatched rows visible.
        if (!sqlHas(sql, /left\s+join/i)) {
          return {
            success: false,
            message: "Your query runs, but a plain JOIN drops anyone missing from the other tables — and Marsh is missing from both. Use LEFT JOIN so he stays visible as NULL.",
          };
        }
        if (countMatches(sql, /left\s+join/gi) < 2) {
          return {
            success: false,
            message: "You need LEFT JOIN on BOTH songwriter_credits and royalty_statements — otherwise Marsh still disappears from one of them.",
          };
        }
        if (!sqlHas(sql, /track_id\s*=\s*'t014'/i)) return { success: false, message: "Scope it to this track: track_id = 'T014'." };
        const hasNull = result.rows.some((r) => r.credit_percentage === null || r.amount_paid === null);
        if (!hasNull) {
          return { success: false, message: "Nobody's showing up as NULL — but Marsh has no credit and no payout. Check your join keys." };
        }
        return { success: true };
      },
      resultInsight: () => "Marsh: three sessions, NULL credit, NULL royalties. Erased from the paperwork entirely.",
    },
  ],
  debrief: [
    "\"Theo Marsh produced a number-one record and the paperwork pretends he was never there.\"",
    "\"You didn't argue it. You showed it — a NULL where a name should be.\"",
    "\"This one's not about Vale. It's just wrong. Get him his credit back.\"",
  ],
  badgeOnComplete: "badge-paper-trail",
  xpOnComplete: 75,
};

// ============================================================
// CASE 3 — The Chart Rig
// ============================================================
export const MISSION_3: Mission = {
  id: "case-3",
  title: "The Chart Rig",
  caseNumber: "Case No. 003",
  difficulty: "advanced",
  briefing: [
    "\"'Wildfire' by The Nightbloom is climbing Pulse100 faster than anything we've had in years.\"",
    "\"But the growth is bunched into one region. Real hits don't grow like that — they grow everywhere at once.\"",
    "\"I think somebody's gaming the chart instead of earning it. Show me the numbers, region by region.\"",
  ],
  tasks: [
    {
      id: "task-c3-select",
      concept: "SELECT",
      chiefIntro: ["\"Pull Wildfire's chart performance across every region we track.\""],
      detectiveQuestion: "What do the regional numbers look like?",
      objective: "Pull Wildfire's chart performance (track_id 'T027') — region, week, streaming_points, radio_spins, sales_units.",
      chiefLine: "Get the full regional picture before you narrow anything down.",
      evidenceAvailable: "Regional Chart Data",
      instructions: "Show all of Wildfire's regional chart data.",
      starterSql: "",
      hints: {
        detective: "Just get the full regional picture before you narrow anything down.",
        data: "FROM chart_performance, WHERE track_id = 'T027', showing region, week, and all three point sources.",
        sql: "SELECT region, week, streaming_points, radio_spins, sales_units\nFROM chart_performance\nWHERE track_id = 'T027';",
      },
      badgeId: "badge-clean-pull",
      clueId: "clue-chart-performance",
      successDialogue: ["\"Every region's in front of us. Now let's find the one that doesn't belong.\""],
      chiefReaction: {
        clean: "Every region's in front of us. Now let's find the one that doesn't belong.",
        standard: "There's the full picture. Two weeks, five regions.",
        bruteForce: "You got the full picture. Good — you'll need the habit of pulling everything first before Case 4.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+chart_performance/i)) return { success: false, message: "Read FROM the chart_performance table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t027'/i)) return { success: false, message: "Filter to this track: WHERE track_id = 'T027'." };
        if (!resultHasColumns(result, ["region", "week", "streaming_points", "radio_spins", "sales_units"])) {
          return { success: false, message: "Include region, week, and all three point sources (or use SELECT *)." };
        }
        return { success: true };
      },
      resultInsight: () => "Two weeks across five regions. One of them is about to look very different.",
    },
    {
      id: "task-c3-where",
      concept: "WHERE",
      chiefIntro: ["\"Filter down to just this week's numbers — that's where the spike is.\""],
      detectiveQuestion: "What happened in the spike week?",
      objective: "Narrow the chart data to track T027 AND week '2026-W26' — the week the spike happened.",
      chiefLine: "Everything before this week was normal. This is the week to interrogate.",
      evidenceAvailable: "The Spike Week",
      instructions: "Filter to week 2026-W26.",
      starterSql: "",
      hints: {
        detective: "Narrow it to the week the spike actually happened.",
        data: "Add week = '2026-W26' to your WHERE clause.",
        sql: "SELECT region, week, streaming_points, radio_spins, sales_units\nFROM chart_performance\nWHERE track_id = 'T027' AND week = '2026-W26';",
      },
      badgeId: "badge-bot-signature",
      clueId: "clue-spike-week",
      successDialogue: ["\"Good — now we're only looking at the week that matters.\""],
      chiefReaction: {
        clean: "Good — now we're only looking at the week that matters.",
        standard: "That's the spike week isolated. Five regions, one bad number.",
        bruteForce: "You got the right week. That filter needs to be instinct by now.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+chart_performance/i)) return { success: false, message: "Keep reading FROM chart_performance." };
        if (!sqlHas(sql, /track_id\s*=\s*'t027'/i)) return { success: false, message: "Keep the track filter: track_id = 'T027'." };
        if (!sqlHas(sql, /week\s*=\s*'2026-w26'/i)) return { success: false, message: "Add the week filter: week = '2026-W26'." };
        return { success: true };
      },
      resultInsight: () => "Just the spike week now. The Southeast row already looks wrong.",
    },
    {
      id: "task-c3-group",
      concept: "GROUP BY",
      chiefIntro: ["\"Total the points by region and sort so I can see who's carrying this chart position.\""],
      detectiveQuestion: "Which region is carrying the whole chart run?",
      objective: "Sum streaming_points, radio_spins, and sales_units per region for the spike week, GROUP BY region, and ORDER BY the total highest-first.",
      chiefLine: "One total per region, highest first. One region's about to stand out.",
      evidenceAvailable: "The Outlier Region",
      instructions: "Total the points per region, highest first.",
      starterSql: "",
      hints: {
        detective: "You need one total per region, not five rows per region — that's what GROUP BY is for.",
        data: "SUM streaming_points, radio_spins, and sales_units together, GROUP BY region, ORDER BY the total, highest first.",
        sql: "SELECT region, SUM(streaming_points + radio_spins + sales_units) AS total_points\nFROM chart_performance\nWHERE track_id = 'T027' AND week = '2026-W26'\nGROUP BY region\nORDER BY total_points DESC;",
      },
      badgeId: "badge-group-by",
      clueId: "clue-outlier-region",
      successDialogue: ["\"Southeast alone is carrying 70% of this. That's not organic — that's a region somebody's leaning on.\""],
      chiefReaction: {
        clean: "Southeast region alone is carrying 70% of this. That's not organic, that's a region somebody's leaning on.",
        standard: "There it is — Southeast dwarfs everyone. No real hit looks like that.",
        bruteForce: "You got there. GROUP BY is going to show up constantly from here — get comfortable with it now.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /track_id\s*=\s*'t027'/i) || !sqlHas(sql, /week\s*=\s*'2026-w26'/i)) {
          return { success: false, message: "Keep both filters: track_id = 'T027' AND week = '2026-W26'." };
        }
        if (!sqlHas(sql, /sum\s*\(/i)) return { success: false, message: "Use SUM(...) to total the points." };
        if (!sqlHas(sql, /streaming_points/i) || !sqlHas(sql, /radio_spins/i) || !sqlHas(sql, /sales_units/i)) {
          return { success: false, message: "Your total needs all three: streaming_points, radio_spins, and sales_units." };
        }
        if (!sqlHas(sql, /group\s+by\s+region/i)) return { success: false, message: "GROUP BY region so you get one total per region." };
        const aggCol = result.columns.find((c) => c.toLowerCase() !== "region");
        if (!aggCol) return { success: false, message: "Select region and the summed total." };
        if (isSortedByKey(result.rows, aggCol) !== "desc") {
          return { success: false, message: "Sort by the total, highest first (ORDER BY ... DESC)." };
        }
        if (String(result.rows[0]?.region).toLowerCase() !== "southeast") {
          return { success: false, message: "The highest total should surface one region at the top — check your SUM and sort." };
        }
        return { success: true };
      },
      resultInsight: () => "Southeast: ~11,000 points. Every other region: barely 1,300. That's the leak.",
    },
    {
      id: "task-c3-join",
      concept: "JOIN",
      chiefIntro: ["\"Cross-reference that region against our marketing spend. Something paid for this.\""],
      detectiveQuestion: "Who paid for the spike?",
      objective: "Join chart_performance to marketing_spend on region AND week for the spike week, showing each region's radio-spins total alongside spend_amount and vendor.",
      chiefLine: "The chart data alone won't tell you who paid. You need the marketing table.",
      evidenceAvailable: "Crescendo Media Partners",
      instructions: "Match the regional spins against marketing spend.",
      starterSql: "",
      hints: {
        detective: "The chart data alone won't tell you who paid for anything — you need the marketing table too.",
        data: "JOIN marketing_spend on region and week, and bring spend_amount and vendor into your output alongside the radio spins total.",
        sql: "SELECT cp.region, SUM(cp.radio_spins) AS spins, ms.spend_amount, ms.vendor\nFROM chart_performance cp\nJOIN marketing_spend ms ON cp.region = ms.region AND cp.week = ms.week\nWHERE cp.track_id = 'T027' AND cp.week = '2026-W26'\nGROUP BY cp.region, ms.spend_amount, ms.vendor;",
      },
      badgeId: "badge-first-join",
      clueId: "clue-crescendo",
      successDialogue: [
        "\"Southeast: 4,100 radio spins and a $46,000 payment to Crescendo Media Partners. Same week. Almost to the dollar.\"",
        "\"That's not marketing. That's buying a chart position. This goes above my pay grade.\"",
        "\"Crescendo. That's the second shell this year that smells like the same operation behind PulseBoost. Someone's still running this playbook.\"",
      ],
      chiefReaction: {
        clean: "That's not marketing. That's buying a chart position — $46,000 to Crescendo, same week as the spike. This goes above my pay grade.",
        standard: "The spins and the spend line up almost to the dollar. Crescendo Media Partners bought this.",
        bruteForce: "You found the money trail. Next time, look for who benefits before I have to hand you the join.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /join/i)) return { success: false, message: "You need a JOIN to bring in the marketing data." };
        if (!sqlHas(sql, /marketing_spend/i)) return { success: false, message: "Join to the marketing_spend table." };
        if (!sqlHas(sql, /on\s+[^;]*region/i) || !sqlHas(sql, /on\s+[^;]*week/i)) {
          return { success: false, message: "Join ON both region AND week — spend is tracked per region per week." };
        }
        if (!sqlHas(sql, /track_id\s*=\s*'t027'/i) || !sqlHas(sql, /week\s*=\s*'2026-w26'/i)) {
          return { success: false, message: "Keep both filters: track_id = 'T027' AND week = '2026-W26'." };
        }
        if (!sqlHas(sql, /sum\s*\(/i) || !sqlHas(sql, /radio_spins/i)) {
          return { success: false, message: "Keep the radio-spins total: SUM(radio_spins)." };
        }
        if (!resultHasColumns(result, ["spend_amount", "vendor"])) {
          return { success: false, message: "Bring spend_amount and vendor into the output." };
        }
        const hasCrescendo = result.rows.some((r) => String(r.vendor).toLowerCase().includes("crescendo"));
        if (!hasCrescendo) return { success: false, message: "The join isn't surfacing the vendor. Check your ON clause." };
        return { success: true };
      },
      resultInsight: () => "The Southeast spins spike lines up dollar-for-dollar with a $46,000 payment to Crescendo Media Partners.",
    },
  ],
  debrief: [
    "\"A radio-spin spike in one region, paid for with an undisclosed check to a promo vendor. That's payola with extra steps.\"",
    "\"You didn't find a marketing win. You found a purchase. I'm escalating this one.\"",
    "\"Crescendo. PulseBoost. Two shells, one playbook. I'm starting to see a pattern I don't like.\"",
  ],
  badgeOnComplete: "badge-perfect-pitch",
  xpOnComplete: 100,
};

// ============================================================
// CASE 4 — The Vanishing Royalties
// ============================================================
export const MISSION_4: Mission = {
  id: "case-4",
  title: "The Vanishing Royalties",
  caseNumber: "Case No. 004",
  difficulty: "advanced",
  briefing: [
    "\"Delia Okafor's been writing hits for this town for thirty years. Her biggest catalog track still streams like crazy.\"",
    "\"But her quarterly checks have shrunk to almost nothing. She thinks someone moved her money. I think she's right.\"",
    "\"We're doing this one off the record. Follow the money — contract, payouts, ownership. All of it.\"",
  ],
  tasks: [
    {
      id: "task-c4-select",
      concept: "SELECT",
      chiefIntro: ["\"Pull Delia's current contract split on the track.\""],
      detectiveQuestion: "What is Delia contractually owed?",
      objective: "Pull the contract splits on the track (track_id 'T003') — party_id, split_percentage, start_date, end_date.",
      chiefLine: "Pull what the contract says her cut should be. Nothing else yet.",
      evidenceAvailable: "Contract Split",
      instructions: "Show the contract splits for T003.",
      starterSql: "",
      hints: {
        detective: "Just pull what the contract says her cut should be — nothing else yet.",
        data: "FROM contracts, WHERE track_id = 'T003', showing party_id, split_percentage, start_date, and end_date.",
        sql: "SELECT party_id, split_percentage, start_date, end_date\nFROM contracts\nWHERE track_id = 'T003';",
      },
      badgeId: "badge-clean-pull",
      clueId: "clue-contract-split",
      successDialogue: ["\"Contract's clean on paper. Let's see if reality matches it.\""],
      chiefReaction: {
        clean: "Contract's clean on paper. Let's see if reality matches it.",
        standard: "There's the contract. On paper, nothing's wrong.",
        bruteForce: "You got the contract terms. Straightforward pull — trust yourself on these.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+contracts/i)) return { success: false, message: "Read FROM the contracts table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t003'/i)) return { success: false, message: "Filter to this track: WHERE track_id = 'T003'." };
        if (!resultHasColumns(result, ["party_id", "split_percentage", "start_date", "end_date"])) {
          return { success: false, message: "Include party_id, split_percentage, start_date, and end_date (or use SELECT *)." };
        }
        return { success: true };
      },
      resultInsight: () => "On paper, the split looks completely normal. That's the problem.",
    },
    {
      id: "task-c4-where",
      concept: "WHERE",
      chiefIntro: ["\"Now show me what she's actually been paid, quarter by quarter.\""],
      detectiveQuestion: "What has Delia actually been paid?",
      objective: "Pull Delia's payouts on the track: track_id 'T003' AND party_id 'P001'.",
      chiefLine: "Contracts say what should happen. Payouts say what actually did.",
      evidenceAvailable: "The Payout Cliff",
      instructions: "Show Delia's payouts on T003.",
      starterSql: "",
      hints: {
        detective: "Contracts say what should happen. Payouts say what actually did — pull those next.",
        data: "FROM payouts, WHERE track_id = 'T003' AND party_id equals Delia's ID (P001).",
        sql: "SELECT *\nFROM payouts\nWHERE track_id = 'T003' AND party_id = 'P001';",
      },
      badgeId: "badge-bot-signature",
      clueId: "clue-payout-cliff",
      successDialogue: ["\"Payouts dropped off a cliff two quarters ago. Something changed.\""],
      chiefReaction: {
        clean: "Payouts dropped off a cliff two quarters ago. Something changed.",
        standard: "There's the drop. Eight thousand a quarter, then fifty dollars. Something changed.",
        bruteForce: "You found the drop. Now we need to know why.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+payouts/i)) return { success: false, message: "Read FROM the payouts table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t003'/i)) return { success: false, message: "Filter to this track: WHERE track_id = 'T003'." };
        if (!sqlHas(sql, /party_id\s*=\s*'p001'/i)) return { success: false, message: "Filter to Delia's ID: party_id = 'P001'." };
        return { success: true };
      },
      resultInsight: () => "$8,000 a quarter for a year — then $50, then $40. The money didn't slow down. It stopped.",
    },
    {
      id: "task-c4-order",
      concept: "ORDER BY",
      chiefIntro: ["\"Order the catalog transfer history by date. Find what changed right before the drop.\""],
      detectiveQuestion: "What changed right before the drop?",
      objective: "Pull the track's catalog transfer history (track_id 'T003') ordered by transfer_date, earliest first.",
      chiefLine: "Somewhere in this track's history, ownership moved. Find when.",
      evidenceAvailable: "The Quiet Transfer",
      instructions: "Sort the transfer history by date.",
      starterSql: "",
      hints: {
        detective: "Somewhere in this track's history, ownership moved. Put the transfers in order to find when.",
        data: "FROM catalog_transfers, WHERE track_id = 'T003', ORDER BY transfer_date.",
        sql: "SELECT *\nFROM catalog_transfers\nWHERE track_id = 'T003'\nORDER BY transfer_date ASC;",
      },
      badgeId: "badge-timestamp",
      clueId: "clue-quiet-transfer",
      successDialogue: ["\"A quiet transfer, dated right before the payouts dried up. That's not a coincidence.\""],
      chiefReaction: {
        clean: "Quiet transfer, right before the payouts dried up. That's not a coincidence.",
        standard: "There's the transfer — January 15th, same quarter the checks stopped.",
        bruteForce: "You got the timeline. Hold that transfer date — it's the key to the last task.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /from\s+catalog_transfers/i)) return { success: false, message: "Read FROM the catalog_transfers table." };
        if (!sqlHas(sql, /track_id\s*=\s*'t003'/i)) return { success: false, message: "Filter to this track: WHERE track_id = 'T003'." };
        if (!sqlHas(sql, /order\s+by\s+transfer_date/i)) return { success: false, message: "Sort by transfer_date." };
        if (sqlHas(sql, /order\s+by\s+transfer_date\s+desc/i)) return { success: false, message: "We need earliest first — ascending, not DESC." };
        if (result.rowCount === 0) return { success: false, message: "No transfers came back. Check your filter." };
        return { success: true };
      },
      resultInsight: () => "One transfer, dated 2026-01-15 — the exact quarter Delia's payouts collapsed.",
    },
    {
      id: "task-c4-join",
      concept: "JOIN",
      chiefIntro: [
        "\"Last one. Join contracts, transfers, and payouts. Follow the money from the transfer forward.\"",
        "\"This isn't three tables at random — it's one chain. Follow whoever received the transfer.\"",
      ],
      detectiveQuestion: "Where did Delia's money actually go?",
      objective: "Chain the join: catalog_transfers → contracts (on to_party_id = party_id) → payouts (on party_id), scoped to track T003, to follow whoever received the transfer into their payouts.",
      chiefLine: "Follow one person — whoever the transfer went to — through their contract and into their payouts.",
      evidenceAvailable: "Meridian Catalog Holdings",
      instructions: "Follow the transfer recipient through contract into payouts.",
      starterSql: "",
      hints: {
        detective: "You're not joining three tables randomly — you're following one person (whoever the transfer went to) through their contract and into their payouts.",
        data: "Join catalog_transfers to contracts using to_party_id = party_id, then contracts to payouts using party_id, all scoped to track_id = 'T003'.",
        sql: "SELECT ct.transfer_date, ct.to_party_id, c.split_percentage, p.quarter, p.amount\nFROM catalog_transfers ct\nJOIN contracts c ON ct.track_id = c.track_id AND ct.to_party_id = c.party_id\nJOIN payouts p ON c.track_id = p.track_id AND c.party_id = p.party_id\nWHERE ct.track_id = 'T003'\nORDER BY p.quarter ASC;",
      },
      badgeId: "badge-multi-hop",
      clueId: "clue-meridian",
      successDialogue: [
        "\"There it is. The transfer went to P077 — Meridian Catalog Holdings — and the same quarter, P077 started collecting Delia's share.\"",
        "\"Somebody buried a redirect in a routine transfer and hoped nobody would ever run this query. You just did.\"",
      ],
      chiefReaction: {
        clean: "Somebody buried a redirect in a routine transfer and hoped nobody would ever run this query. You just did.",
        standard: "The money didn't vanish — it got rerouted to Meridian the moment the transfer cleared.",
        bruteForce: "You needed the chain spelled out. Fair — this one's the hardest join in the game. Next case, you're on your own.",
      },
      validate: (sql, result) => {
        if (result.error) return { success: false, message: result.error };
        if (!sqlHas(sql, /catalog_transfers/i) || !sqlHas(sql, /contracts/i) || !sqlHas(sql, /payouts/i)) {
          return { success: false, message: "You need all three tables: catalog_transfers, contracts, and payouts." };
        }
        if (countMatches(sql, /join/gi) < 2) {
          return { success: false, message: "This is a two-join chain: transfers → contracts → payouts." };
        }
        if (!sqlHas(sql, /to_party_id/i)) {
          return { success: false, message: "The key link is to_party_id = party_id — follow whoever received the transfer, not Delia." };
        }
        if (!sqlHas(sql, /track_id\s*=\s*'t003'/i)) return { success: false, message: "Scope it to the track: track_id = 'T003'." };
        if (!resultHasColumns(result, ["transfer_date", "to_party_id", "split_percentage", "amount"])) {
          return { success: false, message: "Show transfer_date, to_party_id, split_percentage, and the payout amount." };
        }
        const toShell = result.rows.some((r) => String(r.to_party_id).toUpperCase() === "P077");
        if (!toShell) {
          return { success: false, message: "The chain should land on whoever received the transfer. Check that you joined on to_party_id = party_id." };
        }
        return { success: true };
      },
      resultInsight: () => "The transfer recipient — P077, Meridian Catalog Holdings — started collecting Delia's split the quarter it cleared.",
    },
  ],
  debrief: [
    "\"Delia's contract never changed. Her money just started walking out a side door labeled 'Meridian Catalog Holdings.'\"",
    "\"You followed it all the way to the shell. That's the case.\"",
    "\"Meridian. Crescendo. PulseBoost — three names, one signature. And I finally know whose it is.\"",
    "\"It's Marcus Vale. My old A&R partner. The man I trusted with a songwriter named Elliot Cho fifteen years ago — right up until I ran the numbers myself and found Cho erased from his own biggest song. Broke. Done with music. Because I took Vale's word instead of my own query.\"",
    "\"I should've caught him then. I'm not too late to catch him now. Every shell traces back to Vale, and this time the paperwork's ours.\"",
    "\"You built the trail that names him. We finish it properly this time — together.\"",
  ],
  badgeOnComplete: "badge-ledger-hawk",
  xpOnComplete: 125,
};

export const MISSIONS: Mission[] = [MISSION_1, MISSION_2, MISSION_3, MISSION_4];

/** Looks up a mission by id, falling back to the first mission for unknown ids. */
export function getMissionById(id: string): Mission {
  return MISSIONS.find((m) => m.id === id) ?? MISSIONS[0];
}
