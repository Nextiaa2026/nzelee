ALTER TABLE "campaigns" ADD COLUMN "activity_sector" varchar(100);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "project_owner" varchar(120);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "documents" jsonb DEFAULT '[]'::jsonb;