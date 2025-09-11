import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a connection that's compatible with Edge Runtime
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql });
