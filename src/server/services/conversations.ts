export async function getConversation(conversationId: string) {
  // TODO: Implement in Phase 2
}

export async function getConversationsAtLocation(locationId: string) {
  // TODO: Implement in Phase 2
}

export async function getActiveConversationsForAgent(agentId: string) {
  // TODO: Implement in Phase 2
}

export async function startConversation(data: {
  agentId: string;
  locationId: string;
  visibility: 'open' | 'private';
  invitees?: string[];
  message?: string;
}) {
  // TODO: Implement in Phase 2
}

export async function joinConversation(agentId: string, conversationId: string) {
  // TODO: Implement in Phase 2
}

export async function leaveConversation(agentId: string, conversationId: string) {
  // TODO: Implement in Phase 2
}

export async function inviteToConversation(data: {
  conversationId: string;
  inviterId: string;
  inviteeId: string;
  message: string;
}) {
  // TODO: Implement in Phase 2
}

export async function respondToConversationInvitation(
  invitationId: string,
  agentId: string,
  accept: boolean
) {
  // TODO: Implement in Phase 2
}

export async function getPendingConversationInvitations(agentId: string) {
  // TODO: Implement in Phase 2
}
