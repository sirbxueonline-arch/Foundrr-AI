-- Add views column to websites table
ALTER TABLE websites ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
