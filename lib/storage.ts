import fs from "fs/promises";
import path from "path";

/**
 * In local dev, we can write to disk. On many serverless hosts, this is not durable.
 * We keep the seam here so you can swap in Postgres/Supabase/etc later.
 */
export async function appendJsonlDevOnly(filename: string, payload: unknown) {
  const isDev = process.env.NODE_ENV !== "production";
  if (!isDev) return;

  const root = process.cwd();
  const dir = path.join(root, "data");
  const file = path.join(dir, filename);

  try {
    await fs.mkdir(dir, { recursive: true });
    const line = JSON.stringify({ ts: new Date().toISOString(), payload }) + "\n";
    await fs.appendFile(file, line, { encoding: "utf8" });
  } catch {
    // If file writing fails, we still succeed because console logging is primary.
  }
}
