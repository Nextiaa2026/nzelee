ALTER TABLE "campaigns" ADD COLUMN "location_label" varchar(160);
ALTER TABLE "campaigns" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;
ALTER TABLE "campaigns" ADD COLUMN "gallery_images" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "campaigns" ADD COLUMN "impact_points" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "campaigns" ADD COLUMN "minimum_investment_amount" bigint;
ALTER TABLE "campaigns" ADD COLUMN "target_return_rate" integer;
ALTER TABLE "campaigns" ADD COLUMN "duration_months" integer;
