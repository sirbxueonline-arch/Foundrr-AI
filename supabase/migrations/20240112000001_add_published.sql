-- Add is_published column to websites table
ALTER TABLE websites ADD COLUMN is_published BOOLEAN DEFAULT FALSE;
