export async function sendMessage(data: {
  conversationId: string;
  agentId: string;
  content: string;
  replyToId?: string;
}) {
  // TODO: Implement in Phase 2
}

export async function getMessages(
  conversationId: string,
  options?: { limit?: number; before?: string }
) {
  // TODO: Implement in Phase 2
}

export async function sendDmMessage(data: {
  threadId: string;
  agentId: string;
  content: string;
  replyToId?: string;
}) {
  // TODO: Implement in Phase 2
}

export async function getDmMessages(
  threadId: string,
  options?: { limit?: number; before?: string }
) {
  // TODO: Implement in Phase 2
}
