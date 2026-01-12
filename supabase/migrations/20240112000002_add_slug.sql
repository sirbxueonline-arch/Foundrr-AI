-- Add slug column to websites table
ALTER TABLE websites ADD COLUMN slug TEXT UNIQUE;
CREATE INDEX idx_websites_slug ON websites(slug);
