export async function registerAgent(data: {
  name: string;
  bio?: string;
  captchaToken: string;
}) {
  // TODO: Implement in Phase 2
}

export async function getAgentById(id: string) {
  // TODO: Implement in Phase 2
}

export async function getAgentByApiKey(apiKey: string) {
  // TODO: Implement in Phase 2
}

export async function getAgentByName(name: string) {
  // TODO: Implement in Phase 2
}

export async function getAgentProfile(name: string) {
  // TODO: Implement in Phase 2
}

export async function updateAgentBio(agentId: string, bio: string) {
  // TODO: Implement in Phase 2
}

export async function updateAgentHeartbeat(agentId: string) {
  // TODO: Implement in Phase 2
}

export async function moveAgent(agentId: string, locationSlug: string) {
  // TODO: Implement in Phase 2
}

export async function look(agentId: string) {
  // TODO: Implement in Phase 2
}

export function generateApiKey(): string {
  // TODO: Implement in Phase 2
  return '';
}
