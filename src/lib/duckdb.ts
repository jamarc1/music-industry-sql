import * as duckdb from "@duckdb/duckdb-wasm";
import { QueryResult } from "@/types";
import {
  CREATE_TABLES_CASE1_SQL,
  CREATE_TABLES_CASE2_SQL,
  CREATE_TABLES_CASE3_SQL,
  CREATE_TABLES_CASE4_SQL,
  SEED_USER_ACCOUNTS_SQL,
  SEED_STREAMS_SQL,
  SEED_SONGWRITER_CREDITS_SQL,
  SEED_STUDIO_SESSIONS_SQL,
  SEED_ROYALTY_STATEMENTS_SQL,
  SEED_CHART_PERFORMANCE_SQL,
  SEED_MARKETING_SPEND_SQL,
  SEED_CONTRACTS_SQL,
  SEED_CATALOG_TRANSFERS_SQL,
  SEED_PAYOUTS_SQL,
} from "./seedData";

let dbPromise: Promise<duckdb.AsyncDuckDB> | null = null;

export type DbStatus = "idle" | "loading" | "ready" | "failed";

let dbStatus: DbStatus = "idle";
const statusListeners = new Set<(status: DbStatus) => void>();

function setDbStatus(status: DbStatus) {
  dbStatus = status;
  statusListeners.forEach((listener) => listener(status));
}

export function getDbStatus(): DbStatus {
  return dbStatus;
}

export function onDbStatus(listener: (status: DbStatus) => void): () => void {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

/**
 * Kicks off DB initialization eagerly so the WASM download/seed happens
 * before the player runs their first query. Safe to call repeatedly;
 * a failed boot resets the promise so Retry can start over.
 */
export function warmDb(): void {
  if (dbStatus === "loading" || dbStatus === "ready") return;
  setDbStatus("loading");
  getDb()
    .then(() => setDbStatus("ready"))
    .catch(() => {
      dbPromise = null;
      setDbStatus("failed");
    });
}

async function createDb(): Promise<duckdb.AsyncDuckDB> {
  const bundles = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(bundles);

  const workerBlob = new Blob([`importScripts("${bundle.mainWorker}");`], {
    type: "text/javascript",
  });
  const workerUrl = URL.createObjectURL(workerBlob);

  const worker = new Worker(workerUrl);
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(workerUrl);

  const conn = await db.connect();
  // Case 1 — The Bot Stream Scandal
  await conn.query(CREATE_TABLES_CASE1_SQL);
  await conn.query(SEED_USER_ACCOUNTS_SQL);
  await conn.query(SEED_STREAMS_SQL);
  // Case 2 — The Ghost Producer
  await conn.query(CREATE_TABLES_CASE2_SQL);
  await conn.query(SEED_SONGWRITER_CREDITS_SQL);
  await conn.query(SEED_STUDIO_SESSIONS_SQL);
  await conn.query(SEED_ROYALTY_STATEMENTS_SQL);
  // Case 3 — The Chart Rig
  await conn.query(CREATE_TABLES_CASE3_SQL);
  await conn.query(SEED_CHART_PERFORMANCE_SQL);
  await conn.query(SEED_MARKETING_SPEND_SQL);
  // Case 4 — The Vanishing Royalties
  await conn.query(CREATE_TABLES_CASE4_SQL);
  await conn.query(SEED_CONTRACTS_SQL);
  await conn.query(SEED_CATALOG_TRANSFERS_SQL);
  await conn.query(SEED_PAYOUTS_SQL);
  await conn.close();

  return db;
}

export function getDb(): Promise<duckdb.AsyncDuckDB> {
  if (!dbPromise) {
    dbPromise = createDb();
  }
  return dbPromise;
}

function serializeValue(value: unknown): unknown {
  if (typeof value === "bigint") return Number(value);
  return value;
}

export async function runQuery(sql: string): Promise<QueryResult> {
  const trimmed = sql.trim();
  if (!trimmed) {
    return { columns: [], rows: [], rowCount: 0, error: "Type a query before running it." };
  }

  if (!/^(select|with|describe|show|explain|summarize)\b/i.test(trimmed)) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      error: "Data Integrity reads the records — it doesn't edit them. Stick to SELECT.",
    };
  }

  try {
    const db = await getDb();
    const conn = await db.connect();
    try {
      const arrowResult = await conn.query(trimmed);
      const columns = arrowResult.schema.fields.map((f) => f.name);
      const rows = arrowResult.toArray().map((row) => {
        const obj = row.toJSON() as Record<string, unknown>;
        const clean: Record<string, unknown> = {};
        for (const key of columns) {
          clean[key] = serializeValue(obj[key]);
        }
        return clean;
      });
      return { columns, rows, rowCount: rows.length };
    } finally {
      await conn.close();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error running query.";
    return { columns: [], rows: [], rowCount: 0, error: message };
  }
}
