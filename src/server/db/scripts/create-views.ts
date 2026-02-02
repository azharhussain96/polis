import 'dotenv/config';
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createViews() {
  const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

  if (!PG_USER || !PG_PASSWORD || !PG_HOST || !PG_PORT || !PG_DATABASE) {
    console.error('Missing database environment variables');
    process.exit(1);
  }

  const connectionString = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
  const sql = postgres(connectionString);

  console.log('Creating views...');

  const viewsSql = readFileSync(join(__dirname, 'views.sql'), 'utf-8');
  await sql.unsafe(viewsSql);

  console.log('Views created successfully!');
  await sql.end();
}

createViews().catch((err) => {
  console.error('Failed to create views:', err);
  process.exit(1);
});
