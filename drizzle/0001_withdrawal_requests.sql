CREATE TYPE "public"."withdrawal_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "withdrawal_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"currency" varchar(12) DEFAULT 'USD' NOT NULL,
	"status" "withdrawal_status" DEFAULT 'PENDING' NOT NULL,
	"destination" text NOT NULL,
	"admin_note" text,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "cover_image_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" varchar(2);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "organization" varchar(120);--> statement-breakpoint
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;