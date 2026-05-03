ALTER TABLE "campaigns" ADD COLUMN "location_label" varchar(160);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "gallery_images" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "impact_points" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "minimum_investment_amount" bigint;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "target_return_rate" integer;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "duration_months" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_currency" varchar(12) DEFAULT 'XAF' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp;