import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;
const connectionString = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;

const client = postgres(connectionString, {
  max: 1, // Single connection per serverless instance
  idle_timeout: 20,
});

export const db = drizzle(client, { schema });
