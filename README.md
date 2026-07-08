# The A&R Files

A narrative, music-industry **SQL learning game**. You're the new Data Analyst on the Business Intelligence team at **Halcyon Records**, working cases for Chief Reyes, Head of Data Integrity. Each case teaches SQL by making you actually query the label's data to expose what's really going on.

Adapted from the *Data Detective* core architecture (Next.js + DuckDB-WASM + Zustand).

## The cases

| # | Title | SQL taught | The reveal |
|---|-------|------------|------------|
| 1 | The Bot Stream Scandal | `SELECT` → `WHERE` → `ORDER BY` → `JOIN` | Streaming fraud traced to a shell marketing firm |
| 2 | The Ghost Producer | 3-table `LEFT JOIN` | An uncredited producer erased from the royalties |
| 3 | The Chart Rig | `GROUP BY` / `SUM` + `JOIN` | Regional chart manipulation tied to marketing spend |
| 4 | The Vanishing Royalties | Multi-hop `JOIN` across ownership history | Royalties quietly rerouted after a catalog transfer |

A quiet through-line runs across all four cases and pays off in Case 4.

## How it works

- Queries run entirely in the browser against **DuckDB-WASM** — no backend, seeded with fictional data built to produce each reveal.
- **Functional validation**: your query is checked for the right tables, clauses, and conditions — not exact text. Aliases, casing, column order, and explicit `ASC` are all ignored.
- **Progressive hints** (concept → structure → worked query), **XP** (full for a clean solve, reduced when hints are used), and **badges** — including *No Notes* for clearing all four cases hint-free.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router, Turbopack)
- [DuckDB-WASM](https://github.com/duckdb/duckdb-wasm) for in-browser SQL
- [Zustand](https://github.com/pmndrs/zustand) (persisted to `localStorage`) for game state
- [Framer Motion](https://www.framer.com/motion/) + Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Then open the app (default port `3003`: `npm run dev -- -p 3003`).

## Project layout

```
src/
  lib/
    missions.ts    # the 4 cases: tasks, hints, dialogue, validation
    seedData.ts    # table schemas + DuckDB seed data
    duckdb.ts      # in-browser DB boot + query runner
    badges.ts      # badge catalog
    clues.ts       # clue catalog
    dialogue.ts    # Chief Reyes filler/reflection lines
  store/gameStore.ts  # XP, badges, progression (Zustand + persist)
  components/         # game shell, SQL editor, dialogue, results grid, etc.
```
