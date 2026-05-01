ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "preferred_currency" varchar(12) DEFAULT 'XAF' NOT NULL;
