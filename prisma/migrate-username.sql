-- Run once if upgrading an existing database (Supabase SQL editor or prisma db execute)
-- Step 1: Add column (skip if prisma db push already added it)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;

-- Step 2: Backfill (adjust admin email if needed)
UPDATE users SET username = 'admin' WHERE email = 'admin@amadergolpo.com' AND username IS NULL;
UPDATE users SET username = 'user_' || LEFT(id, 8) WHERE username IS NULL;

-- Step 3: Enforce uniqueness and NOT NULL (after all rows have username)
-- ALTER TABLE users ALTER COLUMN username SET NOT NULL;
