-- Run this in Supabase SQL Editor

-- 1. Add Payment Method (m10 / card)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS payment_method text;

-- 2. Add Payment Status (pending, approved, rejected)
-- Default is 'unpaid' or NULL
ALTER TABLE websites ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'unpaid';

-- 3. (Optional) Create function to check if admin
-- For now we will handle admin check in the Next.js API layer using email.
