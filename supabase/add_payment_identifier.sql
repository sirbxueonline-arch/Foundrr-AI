-- Add payment_identifier column to websites table
-- This column is used to store the user-provided verification info (Card Last 4 or M10 Number)

ALTER TABLE websites
ADD COLUMN payment_identifier TEXT;
