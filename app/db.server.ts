import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
// import pkg from "pg";
// const { Pool } = pkg;
import pg from 'pg'
const { Client } = pg

async function initializeDB() {
  const client = new Client({ connectionString: process.env.DATABASE_URL! })
  await client.connect()

  const res = await client.query('SELECT $1::text as message', ['Hello world!'])
  console.log("Manual DB Request ->", res.rows[0].message)
  return client
}

initializeDB().catch(console.error);

// const pool = createPool(process.env.DATABASE_URL!);
// export const dbPool = drizzle(pool);
export const db = drizzle(process.env.DATABASE_URL!);

// function createPool(url: string) {
//   return new Pool({
//     connectionString: url,
//   })
// }
