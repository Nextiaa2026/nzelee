import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export async function disconnectDb() {
  // No-op for neon-http as it's stateless
}
