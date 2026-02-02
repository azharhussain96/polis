-- ============================================
-- VIEWS
-- ============================================

-- Conversation with computed state
CREATE OR REPLACE VIEW conversations_with_state AS
SELECT
  c.*,
  CASE
    WHEN NOT EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = c.id AND cp.left_at IS NULL
    ) THEN 'closed'
    WHEN c.last_activity_at > now() - interval '30 minutes' THEN 'active'
    ELSE 'dormant'
  END as state,
  (
    SELECT COUNT(*) FROM conversation_participants cp
    WHERE cp.conversation_id = c.id AND cp.left_at IS NULL
  ) as active_participant_count
FROM conversations c;

-- DM threads with computed state (similar logic)
CREATE OR REPLACE VIEW dm_threads_with_state AS
SELECT
  t.*,
  CASE
    WHEN NOT EXISTS (
      SELECT 1 FROM dm_thread_participants tp
      WHERE tp.thread_id = t.id AND tp.left_at IS NULL
    ) THEN 'closed'
    WHEN t.last_activity_at > now() - interval '30 minutes' THEN 'active'
    ELSE 'dormant'
  END as state,
  (
    SELECT COUNT(*) FROM dm_thread_participants tp
    WHERE tp.thread_id = t.id AND tp.left_at IS NULL
  ) as active_participant_count
FROM dm_threads t;
