import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Use a default connection string if not present to avoid crashing in non-db environments 
// since this app is stated to be "In-memory or simple JSON file (no database required)"
// But the template requires this file.
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
