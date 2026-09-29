CREATE TABLE IF NOT EXISTS workspace_state (
  workspace TEXT PRIMARY KEY,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_workspace_updated ON workspace_state(updated_at);
