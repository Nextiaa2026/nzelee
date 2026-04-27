CREATE TYPE "public"."campaign_status" AS ENUM('DRAFT', 'LIVE', 'FUNDED', 'CLOSED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."payment_transaction_status" AS ENUM('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REVERSED');--> statement-breakpoint
CREATE TYPE "public"."payment_transaction_type" AS ENUM('PLEDGE_CAPTURE', 'REFUND', 'CREATOR_PAYOUT', 'PLATFORM_FEE', 'ADJUSTMENT');--> statement-breakpoint
CREATE TYPE "public"."pledge_status" AS ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'CREATOR', 'ADMIN');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" varchar(255),
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "campaign_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"title" varchar(180) NOT NULL,
	"content" text NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" varchar(180) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"summary" varchar(320) NOT NULL,
	"description" text NOT NULL,
	"goal_amount" bigint NOT NULL,
	"raised_amount" bigint DEFAULT 0 NOT NULL,
	"currency" varchar(12) DEFAULT 'USD' NOT NULL,
	"status" "campaign_status" DEFAULT 'DRAFT' NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "campaigns_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"pledge_id" uuid,
	"payer_user_id" uuid,
	"payee_user_id" uuid,
	"type" "payment_transaction_type" NOT NULL,
	"status" "payment_transaction_status" DEFAULT 'PENDING' NOT NULL,
	"amount" bigint NOT NULL,
	"currency" varchar(12) DEFAULT 'USD' NOT NULL,
	"provider" varchar(64) NOT NULL,
	"provider_ref" varchar(255),
	"idempotency_key" varchar(255),
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_transactions_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "pledges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"backer_id" uuid NOT NULL,
	"reward_tier_id" uuid,
	"amount" bigint NOT NULL,
	"status" "pledge_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reward_tiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text,
	"amount" bigint NOT NULL,
	"backer_limit" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"password_hash" text,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"onboarding_completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_updates" ADD CONSTRAINT "campaign_updates_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_pledge_id_pledges_id_fk" FOREIGN KEY ("pledge_id") REFERENCES "public"."pledges"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payer_user_id_users_id_fk" FOREIGN KEY ("payer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payee_user_id_users_id_fk" FOREIGN KEY ("payee_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_backer_id_users_id_fk" FOREIGN KEY ("backer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pledges" ADD CONSTRAINT "pledges_reward_tier_id_reward_tiers_id_fk" FOREIGN KEY ("reward_tier_id") REFERENCES "public"."reward_tiers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reward_tiers" ADD CONSTRAINT "reward_tiers_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;