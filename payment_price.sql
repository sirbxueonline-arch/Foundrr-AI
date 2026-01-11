-- Run this in your Supabase SQL Editor

-- 1. Add the Price column (Required for the billing page)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS price integer DEFAULT 20;

-- 2. Add Payment Identifier column (For storing receipt/card info)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS payment_identifier text;

-- 3. Add Payment Method column (m10 or card)
ALTER TABLE websites ADD COLUMN IF NOT EXISTS payment_method text;

-- 4. Status column (to differentiate 'pending' vs 'approved') 
-- Currently we use 'paid' boolean. Let's stick to that for simplicity. 
-- paid = false (Pending) -> paid = true (Approved)
