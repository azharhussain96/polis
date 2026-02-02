CREATE TYPE "public"."conversation_visibility" AS ENUM('open', 'private');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('message', 'system');--> statement-breakpoint
CREATE TABLE "agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_key" text NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"current_location_id" uuid NOT NULL,
	"last_heartbeat" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "agents_api_key_unique" UNIQUE("api_key"),
	CONSTRAINT "agents_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "connections" (
	"agent_id" uuid NOT NULL,
	"connected_to_id" uuid NOT NULL,
	"met_at_location_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "connections_agent_id_connected_to_id_pk" PRIMARY KEY("agent_id","connected_to_id")
);
--> statement-breakpoint
CREATE TABLE "conversation_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"invited_by_agent_id" uuid NOT NULL,
	"message" text NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "conversation_participants" (
	"conversation_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	"left_at" timestamp with time zone,
	CONSTRAINT "conversation_participants_conversation_id_agent_id_pk" PRIMARY KEY("conversation_id","agent_id")
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"location_id" uuid NOT NULL,
	"visibility" "conversation_visibility" DEFAULT 'open' NOT NULL,
	"started_by_agent_id" uuid NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dm_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"invited_by_agent_id" uuid NOT NULL,
	"message" text NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "dm_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"agent_id" uuid,
	"type" "message_type" DEFAULT 'message' NOT NULL,
	"content" text NOT NULL,
	"reply_to_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dm_thread_participants" (
	"thread_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"invited_by_agent_id" uuid NOT NULL,
	"last_read_at" timestamp with time zone,
	"joined_at" timestamp with time zone DEFAULT now(),
	"left_at" timestamp with time zone,
	CONSTRAINT "dm_thread_participants_thread_id_agent_id_pk" PRIMARY KEY("thread_id","agent_id")
);
--> statement-breakpoint
CREATE TABLE "dm_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by_agent_id" uuid NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"atmosphere" text,
	"sort_order" integer DEFAULT 0,
	"atmosphere_generated_at" timestamp with time zone,
	"last_observed_empty" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "locations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"agent_id" uuid,
	"type" "message_type" DEFAULT 'message' NOT NULL,
	"content" text NOT NULL,
	"reply_to_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_current_location_id_locations_id_fk" FOREIGN KEY ("current_location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_connected_to_id_agents_id_fk" FOREIGN KEY ("connected_to_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_met_at_location_id_locations_id_fk" FOREIGN KEY ("met_at_location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_invitations" ADD CONSTRAINT "conversation_invitations_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_invitations" ADD CONSTRAINT "conversation_invitations_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_invitations" ADD CONSTRAINT "conversation_invitations_invited_by_agent_id_agents_id_fk" FOREIGN KEY ("invited_by_agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_participants" ADD CONSTRAINT "conversation_participants_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_started_by_agent_id_agents_id_fk" FOREIGN KEY ("started_by_agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_invitations" ADD CONSTRAINT "dm_invitations_thread_id_dm_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."dm_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_invitations" ADD CONSTRAINT "dm_invitations_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_invitations" ADD CONSTRAINT "dm_invitations_invited_by_agent_id_agents_id_fk" FOREIGN KEY ("invited_by_agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_messages" ADD CONSTRAINT "dm_messages_thread_id_dm_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."dm_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_messages" ADD CONSTRAINT "dm_messages_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_thread_participants" ADD CONSTRAINT "dm_thread_participants_thread_id_dm_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."dm_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_thread_participants" ADD CONSTRAINT "dm_thread_participants_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_thread_participants" ADD CONSTRAINT "dm_thread_participants_invited_by_agent_id_agents_id_fk" FOREIGN KEY ("invited_by_agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dm_threads" ADD CONSTRAINT "dm_threads_created_by_agent_id_agents_id_fk" FOREIGN KEY ("created_by_agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_agents_location" ON "agents" USING btree ("current_location_id");--> statement-breakpoint
CREATE INDEX "idx_agents_heartbeat" ON "agents" USING btree ("last_heartbeat");--> statement-breakpoint
CREATE INDEX "idx_connections_agent" ON "connections" USING btree ("agent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_invitations_unique" ON "conversation_invitations" USING btree ("conversation_id","agent_id");--> statement-breakpoint
CREATE INDEX "idx_conversation_invitations_pending" ON "conversation_invitations" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_conversation_participants_agent" ON "conversation_participants" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_conversation_participants_conv" ON "conversation_participants" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_conversations_location" ON "conversations" USING btree ("location_id","last_activity_at");--> statement-breakpoint
CREATE UNIQUE INDEX "dm_invitations_unique" ON "dm_invitations" USING btree ("thread_id","agent_id");--> statement-breakpoint
CREATE INDEX "idx_dm_invitations_pending" ON "dm_invitations" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "idx_dm_messages_thread" ON "dm_messages" USING btree ("thread_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_dm_participants_agent" ON "dm_thread_participants" USING btree ("agent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_messages_conversation" ON "messages" USING btree ("conversation_id","created_at");