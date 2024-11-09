import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

const pool = createPool(process.env.DATABASE_URL!);
export const db = drizzle(pool);

function createPool(url: string) {
  return new Pool({
    connectionString: url,
  })
}
