import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.ts";

let _db = null;
let _schema = schema;

// Lazy database initialization
export function getDb() {
  if (_db) return _db;

  const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

  if (!TURSO_DATABASE_URL) {
    throw new Error("Please define the TURSO_DATABASE_URL environment variable");
  }

  if (!TURSO_AUTH_TOKEN) {
    throw new Error("Please define the TURSO_AUTH_TOKEN environment variable");
  }

  // Create Turso client
  const client = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  // Create Drizzle instance
  _db = drizzle(client, { schema });
  return _db;
}

// Export for backward compatibility
export const db = new Proxy({}, {
  get(target, prop) {
    return getDb()[prop];
  }
});

// Export schema for use in routes
export { _schema as schema };
