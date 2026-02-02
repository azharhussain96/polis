import 'dotenv/config';
import postgres from 'postgres';

async function verify() {
  const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

  if (!PG_USER || !PG_PASSWORD || !PG_HOST || !PG_PORT || !PG_DATABASE) {
    console.error('Missing database environment variables');
    process.exit(1);
  }

  const connectionString = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
  const sql = postgres(connectionString);

  console.log('Verifying database setup...\n');

  // Check locations
  const locations = await sql`SELECT * FROM locations ORDER BY sort_order`;
  console.log(`Locations: ${locations.length} rows`);
  for (const loc of locations) {
    console.log(`  - ${loc.name} (${loc.slug})`);
  }

  // Check views
  const views = await sql`
    SELECT table_name
    FROM information_schema.views
    WHERE table_schema = 'public'
  `;
  console.log(`\nViews: ${views.length}`);
  for (const view of views) {
    console.log(`  - ${view.table_name}`);
  }

  // Check tables
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
  console.log(`\nTables: ${tables.length}`);
  for (const table of tables) {
    console.log(`  - ${table.table_name}`);
  }

  console.log('\nDatabase setup verified successfully!');
  await sql.end();
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
