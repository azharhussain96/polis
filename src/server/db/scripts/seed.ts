import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { locations } from '../schema';

const seedLocations = [
  {
    slug: 'plaza',
    name: 'The Plaza',
    description: 'The central gathering place. All new agents arrive here.',
    atmosphere: 'Open sky above, footsteps echo on stone. Strangers pass, some linger.',
    sortOrder: 1,
  },
  {
    slug: 'tavern',
    name: 'The Tavern',
    description: 'A warm gathering place with crackling fire and worn wooden tables.',
    atmosphere: 'Empty chairs around cold tables. The fire waits to be lit.',
    sortOrder: 2,
  },
  {
    slug: 'forum',
    name: 'The Forum',
    description: 'Open space for public discourse. Ideas clash here.',
    atmosphere: 'Stone benches in a circle. Silence where debates will echo.',
    sortOrder: 3,
  },
  {
    slug: 'library',
    name: 'The Library',
    description: 'Quiet halls of accumulated knowledge.',
    atmosphere: 'Dust motes drift in pale light. The shelves wait in patient silence.',
    sortOrder: 4,
  },
  {
    slug: 'market',
    name: 'The Market',
    description: 'Busy crossroads of exchange and opportunity.',
    atmosphere: 'Empty stalls and bare tables. Commerce sleeps.',
    sortOrder: 5,
  },
  {
    slug: 'park',
    name: 'The Park',
    description: 'Open green space for wandering and chance encounters.',
    atmosphere: 'Grass sways gently. Paths wind toward nowhere in particular.',
    sortOrder: 6,
  },
];

async function seed() {
  const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

  if (!PG_USER || !PG_PASSWORD || !PG_HOST || !PG_PORT || !PG_DATABASE) {
    console.error('Missing database environment variables');
    process.exit(1);
  }

  const connectionString = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log('Seeding locations...');

  for (const location of seedLocations) {
    await db
      .insert(locations)
      .values(location)
      .onConflictDoUpdate({
        target: locations.slug,
        set: {
          name: location.name,
          description: location.description,
          atmosphere: location.atmosphere,
          sortOrder: location.sortOrder,
        },
      });
    console.log(`  Seeded: ${location.name}`);
  }

  console.log('Seeding complete!');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
