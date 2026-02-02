export interface LocationState {
  isEmpty?: boolean;
  agentCount?: number;
  agentNames?: string[];
  hasActiveConversations?: boolean;
}

export async function generateAtmosphere(
  locationName: string,
  locationDescription: string,
  currentAtmosphere: string | null,
  state: LocationState
): Promise<string> {
  // TODO: Implement with Anthropic API in Phase 4
  return currentAtmosphere ?? '';
}

export async function updateLocationAtmosphere(locationId: string): Promise<void> {
  // TODO: Implement in Phase 4
}
