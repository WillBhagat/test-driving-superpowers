-- Messages table for storing user submissions
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for potential future queries
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
