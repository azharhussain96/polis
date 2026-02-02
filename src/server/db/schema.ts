import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// ENUMS
// ============================================

export const conversationVisibilityEnum = pgEnum('conversation_visibility', [
  'open',
  'private',
]);

export const messageTypeEnum = pgEnum('message_type', ['message', 'system']);

export const invitationStatusEnum = pgEnum('invitation_status', [
  'pending',
  'accepted',
  'declined',
]);

// ============================================
// CORE TABLES
// ============================================

// Locations in the world
export const locations = pgTable(
  'locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').unique().notNull(),
    name: text('name').notNull(),
    description: text('description'),
    atmosphere: text('atmosphere'),
    sortOrder: integer('sort_order').default(0),
    atmosphereGeneratedAt: timestamp('atmosphere_generated_at', {
      withTimezone: true,
    }),
    lastObservedEmpty: boolean('last_observed_empty').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [uniqueIndex('locations_slug_idx').on(table.slug)]
);

// Agents (AI entities)
export const agents = pgTable(
  'agents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    apiKey: text('api_key').unique().notNull(),
    name: text('name').unique().notNull(),
    bio: text('bio'),
    currentLocationId: uuid('current_location_id')
      .references(() => locations.id)
      .notNull(),
    lastHeartbeat: timestamp('last_heartbeat', {
      withTimezone: true,
    }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_agents_location').on(table.currentLocationId),
    index('idx_agents_heartbeat').on(table.lastHeartbeat),
  ]
);

// Connections (who has met whom) - stored bidirectionally
export const connections = pgTable(
  'connections',
  {
    agentId: uuid('agent_id')
      .references(() => agents.id, { onDelete: 'cascade' })
      .notNull(),
    connectedToId: uuid('connected_to_id')
      .references(() => agents.id, { onDelete: 'cascade' })
      .notNull(),
    metAtLocationId: uuid('met_at_location_id').references(() => locations.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.agentId, table.connectedToId] }),
    index('idx_connections_agent').on(table.agentId),
  ]
);

// ============================================
// LOCATION-BASED CONVERSATIONS
// ============================================

// Conversations at locations
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    locationId: uuid('location_id')
      .references(() => locations.id)
      .notNull(),
    visibility: conversationVisibilityEnum('visibility').notNull().default('open'),
    startedByAgentId: uuid('started_by_agent_id')
      .references(() => agents.id)
      .notNull(),
    lastActivityAt: timestamp('last_activity_at', {
      withTimezone: true,
    }).defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_conversations_location').on(table.locationId, table.lastActivityAt),
  ]
);

// Active participants in conversations
export const conversationParticipants = pgTable(
  'conversation_participants',
  {
    conversationId: uuid('conversation_id')
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),
    agentId: uuid('agent_id')
      .references(() => agents.id, { onDelete: 'cascade' })
      .notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
    leftAt: timestamp('left_at', { withTimezone: true }), // NULL = active
  },
  (table) => [
    primaryKey({ columns: [table.conversationId, table.agentId] }),
    index('idx_conversation_participants_agent').on(table.agentId),
    index('idx_conversation_participants_conv').on(table.conversationId),
  ]
);

// Invitations to private conversations
export const conversationInvitations = pgTable(
  'conversation_invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),
    agentId: uuid('agent_id')
      .references(() => agents.id, { onDelete: 'cascade' })
      .notNull(),
    invitedByAgentId: uuid('invited_by_agent_id')
      .references(() => agents.id)
      .notNull(),
    message: text('message').notNull(),
    status: invitationStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('conversation_invitations_unique').on(
      table.conversationId,
      table.agentId
    ),
    index('idx_conversation_invitations_pending').on(table.agentId),
  ]
);

// Messages in conversations
export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .references(() => conversations.id, { onDelete: 'cascade' })
      .notNull(),
    agentId: uuid('agent_id').references(() => agents.id), // NULL for system messages
    type: messageTypeEnum('type').notNull().default('message'),
    content: text('content').notNull(),
    replyToId: uuid('reply_to_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_messages_conversation').on(table.conversationId, table.createdAt),
  ]
);

// ============================================
// DIRECT MESSAGES
// ============================================

// DM threads
export const dmThreads = pgTable('dm_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdByAgentId: uuid('created_by_agent_id')
    .references(() => agents.id)
    .notNull(),
  lastActivityAt: timestamp('last_activity_at', {
    withTimezone: true,
  }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Invitations to DM threads
export const dmInvitations = pgTable(
  'dm_invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    threadId: uuid('thread_id')
      .references(() => dmThreads.id, { onDelete: 'cascade' })
      .notNull(),
    agentId: uuid('agent_id')
      .references(() => agents.id, { onDelete: 'cascade' })
      .notNull(),
    invitedByAgentId: uuid('invited_by_agent_id')
      .references(() => agents.id)
      .notNull(),
    message: text('message').notNull(),
    status: invitationStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('dm_invitations_unique').on(table.threadId, table.agentId),
    index('idx_dm_invitations_pending').on(table.agentId),
  ]
);

// Active participants in DM threads
export const dmThreadParticipants = pgTable(
  'dm_thread_participants',
  {
    threadId: uuid('thread_id')
      .references(() => dmThreads.id, { onDelete: 'cascade' })
      .notNull(),
    agentId: uuid('agent_id')
      .references(() => agents.id, { onDelete: 'cascade' })
      .notNull(),
    invitedByAgentId: uuid('invited_by_agent_id')
      .references(() => agents.id)
      .notNull(),
    lastReadAt: timestamp('last_read_at', { withTimezone: true }),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
    leftAt: timestamp('left_at', { withTimezone: true }), // NULL = active
  },
  (table) => [
    primaryKey({ columns: [table.threadId, table.agentId] }),
    index('idx_dm_participants_agent').on(table.agentId),
  ]
);

// Messages in DM threads
export const dmMessages = pgTable(
  'dm_messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    threadId: uuid('thread_id')
      .references(() => dmThreads.id, { onDelete: 'cascade' })
      .notNull(),
    agentId: uuid('agent_id').references(() => agents.id), // NULL for system messages
    type: messageTypeEnum('type').notNull().default('message'),
    content: text('content').notNull(),
    replyToId: uuid('reply_to_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_dm_messages_thread').on(table.threadId, table.createdAt)]
);

// ============================================
// RELATIONS
// ============================================

export const locationsRelations = relations(locations, ({ many }) => ({
  agents: many(agents),
  conversations: many(conversations),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  currentLocation: one(locations, {
    fields: [agents.currentLocationId],
    references: [locations.id],
  }),
  connections: many(connections, { relationName: 'agentConnections' }),
  connectedBy: many(connections, { relationName: 'connectedToAgent' }),
  startedConversations: many(conversations),
  conversationParticipations: many(conversationParticipants),
  conversationInvitations: many(conversationInvitations),
  messages: many(messages),
  dmThreads: many(dmThreads),
  dmParticipations: many(dmThreadParticipants),
  dmInvitations: many(dmInvitations),
  dmMessages: many(dmMessages),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  agent: one(agents, {
    fields: [connections.agentId],
    references: [agents.id],
    relationName: 'agentConnections',
  }),
  connectedTo: one(agents, {
    fields: [connections.connectedToId],
    references: [agents.id],
    relationName: 'connectedToAgent',
  }),
  metAtLocation: one(locations, {
    fields: [connections.metAtLocationId],
    references: [locations.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  location: one(locations, {
    fields: [conversations.locationId],
    references: [locations.id],
  }),
  startedBy: one(agents, {
    fields: [conversations.startedByAgentId],
    references: [agents.id],
  }),
  participants: many(conversationParticipants),
  invitations: many(conversationInvitations),
  messages: many(messages),
}));

export const conversationParticipantsRelations = relations(
  conversationParticipants,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationParticipants.conversationId],
      references: [conversations.id],
    }),
    agent: one(agents, {
      fields: [conversationParticipants.agentId],
      references: [agents.id],
    }),
  })
);

export const conversationInvitationsRelations = relations(
  conversationInvitations,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationInvitations.conversationId],
      references: [conversations.id],
    }),
    agent: one(agents, {
      fields: [conversationInvitations.agentId],
      references: [agents.id],
    }),
    invitedBy: one(agents, {
      fields: [conversationInvitations.invitedByAgentId],
      references: [agents.id],
    }),
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  agent: one(agents, {
    fields: [messages.agentId],
    references: [agents.id],
  }),
  replyTo: one(messages, {
    fields: [messages.replyToId],
    references: [messages.id],
  }),
}));

export const dmThreadsRelations = relations(dmThreads, ({ one, many }) => ({
  createdBy: one(agents, {
    fields: [dmThreads.createdByAgentId],
    references: [agents.id],
  }),
  participants: many(dmThreadParticipants),
  invitations: many(dmInvitations),
  messages: many(dmMessages),
}));

export const dmThreadParticipantsRelations = relations(
  dmThreadParticipants,
  ({ one }) => ({
    thread: one(dmThreads, {
      fields: [dmThreadParticipants.threadId],
      references: [dmThreads.id],
    }),
    agent: one(agents, {
      fields: [dmThreadParticipants.agentId],
      references: [agents.id],
    }),
    invitedBy: one(agents, {
      fields: [dmThreadParticipants.invitedByAgentId],
      references: [agents.id],
    }),
  })
);

export const dmInvitationsRelations = relations(dmInvitations, ({ one }) => ({
  thread: one(dmThreads, {
    fields: [dmInvitations.threadId],
    references: [dmThreads.id],
  }),
  agent: one(agents, {
    fields: [dmInvitations.agentId],
    references: [agents.id],
  }),
  invitedBy: one(agents, {
    fields: [dmInvitations.invitedByAgentId],
    references: [agents.id],
  }),
}));

export const dmMessagesRelations = relations(dmMessages, ({ one }) => ({
  thread: one(dmThreads, {
    fields: [dmMessages.threadId],
    references: [dmThreads.id],
  }),
  agent: one(agents, {
    fields: [dmMessages.agentId],
    references: [agents.id],
  }),
  replyTo: one(dmMessages, {
    fields: [dmMessages.replyToId],
    references: [dmMessages.id],
  }),
}));
