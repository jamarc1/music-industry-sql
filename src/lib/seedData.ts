import { TableSchema } from "@/types";

interface ColumnWithNarrative {
  name: string;
  type: string;
  narrative?: string;
}

// Timestamps and dates are stored as ISO-formatted VARCHAR strings. ISO 8601
// sorts correctly lexically, so ORDER BY behaves the same as a native DATE /
// TIMESTAMP would, but without any duckdb-wasm serialization surprises.
export const TABLE_SCHEMAS: (TableSchema & { columns: ColumnWithNarrative[] })[] = [
  // ===== CASE 1 — The Bot Stream Scandal =====
  {
    name: "streams",
    caseName: "Play Log",
    missionId: "case-1",
    taskIndex: 0,
    tagline: "Every registered stream of Neon Static, fan or otherwise.",
    description: "The raw play log for the track — one row per stream, with how long it actually played.",
    columns: [
      { name: "stream_id", type: "VARCHAR", narrative: "Unique identifier for each stream" },
      { name: "track_id", type: "VARCHAR", narrative: "Which track was streamed" },
      { name: "user_id", type: "VARCHAR", narrative: "Which account did the streaming" },
      { name: "played_at", type: "VARCHAR", narrative: "When the stream started" },
      { name: "duration_seconds", type: "INTEGER", narrative: "How many seconds it actually played" },
      { name: "device_type", type: "VARCHAR", narrative: "Mobile, desktop, etc." },
      { name: "ip_address", type: "VARCHAR", narrative: "Where the stream came from" },
      { name: "country", type: "VARCHAR", narrative: "Country the stream registered in" },
    ],
  },
  {
    name: "user_accounts",
    caseName: "Account Records",
    missionId: "case-1",
    taskIndex: 3,
    tagline: "Who owns the accounts behind the streams — and when they signed up.",
    description: "Signup records for every streaming account: creation date, signup IP, and email domain.",
    columns: [
      { name: "user_id", type: "VARCHAR", narrative: "The account this record belongs to" },
      { name: "account_created", type: "VARCHAR", narrative: "When the account was created" },
      { name: "signup_ip", type: "VARCHAR", narrative: "IP address used at signup" },
      { name: "email_domain", type: "VARCHAR", narrative: "The domain of the account's email" },
      { name: "country", type: "VARCHAR", narrative: "Registered country" },
    ],
  },

  // ===== CASE 2 — The Ghost Producer =====
  {
    name: "songwriter_credits",
    caseName: "Credit Sheet",
    missionId: "case-2",
    taskIndex: 0,
    tagline: "The label's official credited writers on Gravity.",
    description: "Who the paperwork says wrote the song, and what percentage each one is credited.",
    columns: [
      { name: "credit_id", type: "VARCHAR", narrative: "Unique identifier for each credit line" },
      { name: "track_id", type: "VARCHAR", narrative: "Which track the credit is for" },
      { name: "contributor_id", type: "VARCHAR", narrative: "Who is being credited" },
      { name: "role", type: "VARCHAR", narrative: "What they're credited as" },
      { name: "credit_percentage", type: "INTEGER", narrative: "Their share of the writing credit (percent)" },
    ],
  },
  {
    name: "studio_sessions",
    caseName: "Session Logs",
    missionId: "case-2",
    taskIndex: 1,
    tagline: "Who actually booked studio time on the track — and when.",
    description: "The studio's own booking record. It doesn't care about credit sheets — just who showed up.",
    columns: [
      { name: "session_id", type: "VARCHAR", narrative: "Unique identifier for each session" },
      { name: "track_id", type: "VARCHAR", narrative: "Which track the session was for" },
      { name: "contributor_id", type: "VARCHAR", narrative: "Who was in the room" },
      { name: "session_date", type: "VARCHAR", narrative: "When the session happened" },
      { name: "studio_location", type: "VARCHAR", narrative: "Where it was recorded" },
    ],
  },
  {
    name: "royalty_statements",
    caseName: "Royalty Statements",
    missionId: "case-2",
    taskIndex: 3,
    tagline: "Who actually got paid on Gravity, and how much.",
    description: "Quarterly royalty payouts by contributor. A missing name here means a missing check.",
    columns: [
      { name: "statement_id", type: "VARCHAR", narrative: "Unique identifier for each statement" },
      { name: "track_id", type: "VARCHAR", narrative: "Which track the payout is for" },
      { name: "contributor_id", type: "VARCHAR", narrative: "Who was paid" },
      { name: "quarter", type: "VARCHAR", narrative: "Which quarter the payout covers" },
      { name: "amount_paid", type: "INTEGER", narrative: "How much they were paid (USD)" },
    ],
  },

  // ===== CASE 3 — The Chart Rig =====
  {
    name: "chart_performance",
    caseName: "Chart Performance",
    missionId: "case-3",
    taskIndex: 0,
    tagline: "Wildfire's weekly chart points, broken out by region.",
    description: "Streaming points, radio spins, and sales units per region per week — the raw inputs to the chart.",
    columns: [
      { name: "track_id", type: "VARCHAR", narrative: "Which track this row is for" },
      { name: "region", type: "VARCHAR", narrative: "The chart region" },
      { name: "week", type: "VARCHAR", narrative: "Which chart week (e.g. 2026-W26)" },
      { name: "streaming_points", type: "INTEGER", narrative: "Points from streaming" },
      { name: "radio_spins", type: "INTEGER", narrative: "Points from radio airplay" },
      { name: "sales_units", type: "INTEGER", narrative: "Points from sales" },
    ],
  },
  {
    name: "marketing_spend",
    caseName: "Marketing Spend",
    missionId: "case-3",
    taskIndex: 3,
    tagline: "What Halcyon paid, to whom, by region and week.",
    description: "Promotional spend broken out by region, week, and vendor — including who got paid what.",
    columns: [
      { name: "region", type: "VARCHAR", narrative: "The region the spend targeted" },
      { name: "week", type: "VARCHAR", narrative: "Which week the spend covered" },
      { name: "vendor", type: "VARCHAR", narrative: "Who received the payment" },
      { name: "spend_amount", type: "INTEGER", narrative: "How much was paid (USD)" },
    ],
  },

  // ===== CASE 4 — The Vanishing Royalties =====
  {
    name: "contracts",
    caseName: "Contracts",
    missionId: "case-4",
    taskIndex: 0,
    tagline: "The contracted royalty splits on the track.",
    description: "Who is contractually owed what share of the track, and over what dates.",
    columns: [
      { name: "track_id", type: "VARCHAR", narrative: "Which track the contract covers" },
      { name: "party_id", type: "VARCHAR", narrative: "The party to the contract" },
      { name: "split_percentage", type: "INTEGER", narrative: "Their contracted share (percent)" },
      { name: "start_date", type: "VARCHAR", narrative: "When the contract took effect" },
      { name: "end_date", type: "VARCHAR", narrative: "When it ends (NULL = still active)" },
    ],
  },
  {
    name: "catalog_transfers",
    caseName: "Catalog Transfers",
    missionId: "case-4",
    taskIndex: 2,
    tagline: "Ownership changes in the track's history.",
    description: "A record of every time the track's catalog rights moved from one party to another.",
    columns: [
      { name: "transfer_id", type: "VARCHAR", narrative: "Unique identifier for each transfer" },
      { name: "track_id", type: "VARCHAR", narrative: "Which track was transferred" },
      { name: "from_party_id", type: "VARCHAR", narrative: "Who held the rights before" },
      { name: "to_party_id", type: "VARCHAR", narrative: "Who received the rights" },
      { name: "transfer_date", type: "VARCHAR", narrative: "When the transfer happened" },
    ],
  },
  {
    name: "payouts",
    caseName: "Payouts",
    missionId: "case-4",
    taskIndex: 1,
    tagline: "What each party was actually paid, quarter by quarter.",
    description: "The real money trail — quarterly payouts by party, whatever the contract says on paper.",
    columns: [
      { name: "payout_id", type: "VARCHAR", narrative: "Unique identifier for each payout" },
      { name: "track_id", type: "VARCHAR", narrative: "Which track the payout is for" },
      { name: "party_id", type: "VARCHAR", narrative: "Who received the payout" },
      { name: "quarter", type: "VARCHAR", narrative: "Which quarter it covers" },
      { name: "amount", type: "INTEGER", narrative: "How much was paid out (USD)" },
    ],
  },
];

// ===== CASE 1 — The Bot Stream Scandal =====
export const CREATE_TABLES_CASE1_SQL = `
CREATE TABLE streams (
  stream_id VARCHAR,
  track_id VARCHAR,
  user_id VARCHAR,
  played_at VARCHAR,
  duration_seconds INTEGER,
  device_type VARCHAR,
  ip_address VARCHAR,
  country VARCHAR
);

CREATE TABLE user_accounts (
  user_id VARCHAR,
  account_created VARCHAR,
  signup_ip VARCHAR,
  email_domain VARCHAR,
  country VARCHAR
);
`;

export const SEED_USER_ACCOUNTS_SQL = `
INSERT INTO user_accounts VALUES
  ('U001', '2024-11-02', '73.44.12.9', 'gmail.com', 'US'),
  ('U002', '2025-01-15', '24.108.55.3', 'yahoo.com', 'US'),
  ('U003', '2023-08-30', '82.132.19.4', 'icloud.com', 'UK'),
  ('U004', '2025-05-10', '199.201.64.8', 'gmail.com', 'CA'),
  ('U005', '2024-02-22', '71.192.3.15', 'outlook.com', 'US'),
  ('U101', '2026-06-18', '185.220.101.4', 'pulseboost-media.net', 'US'),
  ('U102', '2026-06-18', '185.220.101.4', 'pulseboost-media.net', 'US'),
  ('U103', '2026-06-18', '185.220.101.6', 'pulseboost-media.net', 'US'),
  ('U104', '2026-06-18', '185.220.101.6', 'pulseboost-media.net', 'US'),
  ('U105', '2026-06-18', '185.220.101.9', 'pulseboost-media.net', 'US'),
  ('U106', '2026-06-18', '185.220.101.9', 'pulseboost-media.net', 'US');
`;

export const SEED_STREAMS_SQL = `
INSERT INTO streams VALUES
  ('S001', 'T001', 'U001', '2026-06-18 14:22:00', 214, 'mobile',  '73.44.12.9',    'US'),
  ('S002', 'T001', 'U002', '2026-06-18 16:05:00', 201, 'desktop', '24.108.55.3',   'US'),
  ('S003', 'T001', 'U003', '2026-06-18 19:40:00', 227, 'mobile',  '82.132.19.4',   'UK'),
  ('S004', 'T001', 'U004', '2026-06-18 20:15:00', 198, 'mobile',  '199.201.64.8',  'CA'),
  ('S005', 'T001', 'U005', '2026-06-18 22:50:00', 205, 'desktop', '71.192.3.15',   'US'),
  ('S101', 'T001', 'U101', '2026-06-19 02:14:00', 8,  'mobile', '185.220.101.4', 'US'),
  ('S102', 'T001', 'U101', '2026-06-19 02:14:30', 6,  'mobile', '185.220.101.4', 'US'),
  ('S103', 'T001', 'U102', '2026-06-19 02:15:00', 9,  'mobile', '185.220.101.4', 'US'),
  ('S104', 'T001', 'U103', '2026-06-19 02:16:00', 7,  'mobile', '185.220.101.6', 'US'),
  ('S105', 'T001', 'U104', '2026-06-19 02:17:00', 5,  'mobile', '185.220.101.6', 'US'),
  ('S106', 'T001', 'U105', '2026-06-19 02:18:00', 10, 'mobile', '185.220.101.9', 'US'),
  ('S107', 'T001', 'U106', '2026-06-19 02:19:00', 6,  'mobile', '185.220.101.9', 'US');
`;

// ===== CASE 2 — The Ghost Producer =====
export const CREATE_TABLES_CASE2_SQL = `
CREATE TABLE songwriter_credits (
  credit_id VARCHAR,
  track_id VARCHAR,
  contributor_id VARCHAR,
  role VARCHAR,
  credit_percentage INTEGER
);

CREATE TABLE studio_sessions (
  session_id VARCHAR,
  track_id VARCHAR,
  contributor_id VARCHAR,
  session_date VARCHAR,
  studio_location VARCHAR
);

CREATE TABLE royalty_statements (
  statement_id VARCHAR,
  track_id VARCHAR,
  contributor_id VARCHAR,
  quarter VARCHAR,
  amount_paid INTEGER
);
`;

export const SEED_SONGWRITER_CREDITS_SQL = `
INSERT INTO songwriter_credits VALUES
  ('SC01', 'T014', 'nova_ferris', 'writer/artist', 100);
`;

export const SEED_STUDIO_SESSIONS_SQL = `
INSERT INTO studio_sessions VALUES
  ('SS01', 'T014', 'theo_marsh',  '2025-11-03', 'Echo Park Studios'),
  ('SS02', 'T014', 'theo_marsh',  '2025-11-10', 'Echo Park Studios'),
  ('SS03', 'T014', 'theo_marsh',  '2025-11-17', 'Echo Park Studios'),
  ('SS04', 'T014', 'nova_ferris', '2025-11-17', 'Echo Park Studios');
`;

export const SEED_ROYALTY_STATEMENTS_SQL = `
INSERT INTO royalty_statements VALUES
  ('RS01', 'T014', 'nova_ferris', '2026-Q1', 42000),
  ('RS02', 'T014', 'nova_ferris', '2026-Q2', 38500);
`;

// ===== CASE 3 — The Chart Rig =====
export const CREATE_TABLES_CASE3_SQL = `
CREATE TABLE chart_performance (
  track_id VARCHAR,
  region VARCHAR,
  week VARCHAR,
  streaming_points INTEGER,
  radio_spins INTEGER,
  sales_units INTEGER
);

CREATE TABLE marketing_spend (
  region VARCHAR,
  week VARCHAR,
  vendor VARCHAR,
  spend_amount INTEGER
);
`;

export const SEED_CHART_PERFORMANCE_SQL = `
INSERT INTO chart_performance VALUES
  ('T027', 'Northeast', '2026-W25', 820, 140, 210),
  ('T027', 'Southeast', '2026-W25', 780, 130, 195),
  ('T027', 'Midwest',   '2026-W25', 750, 120, 180),
  ('T027', 'West',      '2026-W25', 900, 150, 220),
  ('T027', 'South',     '2026-W25', 810, 135, 200),
  ('T027', 'Northeast', '2026-W26', 850,  145,  215),
  ('T027', 'Southeast', '2026-W26', 6700, 4100, 240),
  ('T027', 'Midwest',   '2026-W26', 770,  125,  185),
  ('T027', 'West',      '2026-W26', 920,  155,  225),
  ('T027', 'South',     '2026-W26', 830,  140,  205);
`;

export const SEED_MARKETING_SPEND_SQL = `
INSERT INTO marketing_spend VALUES
  ('Northeast', '2026-W26', 'Skyline Promo Group',      3200),
  ('Southeast', '2026-W26', 'Crescendo Media Partners', 46000),
  ('Midwest',   '2026-W26', 'Skyline Promo Group',      2800),
  ('West',      '2026-W26', 'Skyline Promo Group',      3500),
  ('South',     '2026-W26', 'Skyline Promo Group',      3100);
`;

// ===== CASE 4 — The Vanishing Royalties =====
export const CREATE_TABLES_CASE4_SQL = `
CREATE TABLE contracts (
  track_id VARCHAR,
  party_id VARCHAR,
  split_percentage INTEGER,
  start_date VARCHAR,
  end_date VARCHAR
);

CREATE TABLE catalog_transfers (
  transfer_id VARCHAR,
  track_id VARCHAR,
  from_party_id VARCHAR,
  to_party_id VARCHAR,
  transfer_date VARCHAR
);

CREATE TABLE payouts (
  payout_id VARCHAR,
  track_id VARCHAR,
  party_id VARCHAR,
  quarter VARCHAR,
  amount INTEGER
);
`;

export const SEED_CONTRACTS_SQL = `
INSERT INTO contracts VALUES
  ('T003', 'P001', 100, '2019-01-01', NULL),
  ('T003', 'P077', 100, '2026-01-15', NULL);
`;

export const SEED_CATALOG_TRANSFERS_SQL = `
INSERT INTO catalog_transfers VALUES
  ('CT01', 'T003', 'P001', 'P077', '2026-01-15');
`;

export const SEED_PAYOUTS_SQL = `
INSERT INTO payouts VALUES
  ('PO01', 'T003', 'P001', '2025-Q1', 8000),
  ('PO02', 'T003', 'P001', '2025-Q2', 8200),
  ('PO03', 'T003', 'P001', '2025-Q3', 8100),
  ('PO04', 'T003', 'P001', '2025-Q4', 8300),
  ('PO05', 'T003', 'P001', '2026-Q1', 50),
  ('PO06', 'T003', 'P077', '2026-Q1', 7950),
  ('PO07', 'T003', 'P001', '2026-Q2', 40),
  ('PO08', 'T003', 'P077', '2026-Q2', 8100);
`;
