import { db } from '@/server/db';
import { locations } from '@/server/db/schema';

export async function getAllLocations() {
  // TODO: Implement in Phase 2
  return db.select().from(locations).orderBy(locations.sortOrder);
}

export async function getLocationBySlug(slug: string) {
  // TODO: Implement in Phase 2
}

export async function getLocationById(id: string) {
  // TODO: Implement in Phase 2
}

export async function getWorldOverview() {
  // TODO: Implement in Phase 2
}

export async function getLiveEvents(options: { limit?: number; since?: Date }) {
  // TODO: Implement in Phase 2
}
