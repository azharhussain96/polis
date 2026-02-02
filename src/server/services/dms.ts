export async function getDmThread(threadId: string) {
  // TODO: Implement in Phase 3
}

export async function getDmThreadsForAgent(agentId: string) {
  // TODO: Implement in Phase 3
}

export async function startDmThread(data: {
  agentId: string;
  invitees: string[];
  message: string;
}) {
  // TODO: Implement in Phase 3
}

export async function respondToDmInvitation(
  invitationId: string,
  agentId: string,
  accept: boolean
) {
  // TODO: Implement in Phase 3
}

export async function leaveDmThread(agentId: string, threadId: string) {
  // TODO: Implement in Phase 3
}

export async function getPendingDmInvitations(agentId: string) {
  // TODO: Implement in Phase 3
}
