CREATE TYPE "public"."investment_transaction_status" AS ENUM('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELED', 'REVERSED');--> statement-breakpoint
CREATE TYPE "public"."investment_transaction_type" AS ENUM('SUBSCRIPTION', 'SUBSCRIPTION_REFUND', 'REDEMPTION_PAYOUT', 'DISTRIBUTION', 'PLATFORM_FEE', 'ADJUSTMENT');--> statement-breakpoint
CREATE TYPE "public"."kyc_document_type" AS ENUM('PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE', 'RESIDENCE_PERMIT', 'PROOF_OF_ADDRESS', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."kyc_submission_status" AS ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED');--> statement-breakpoint
CREATE TYPE "public"."offering_status" AS ENUM('DRAFT', 'OPEN', 'PAUSED', 'CLOSED', 'FULLY_SUBSCRIBED');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'SOLD', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'MIXED_USE', 'HOSPITALITY', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."redemption_request_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."redemption_window_status" AS ENUM('SCHEDULED', 'OPEN', 'CLOSED', 'SETTLED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."subscription_order_status" AS ENUM('PENDING', 'FUNDED', 'ALLOCATED', 'CANCELLED', 'FAILED');--> statement-breakpoint
CREATE TABLE "allowed_countries" (
	"code" varchar(2) PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"min_age" integer DEFAULT 18 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "distribution_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"distribution_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"investor_user_id" uuid NOT NULL,
	"units_at_record_date" bigint NOT NULL,
	"amount" bigint NOT NULL,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"offering_id" uuid,
	"subscription_order_id" uuid,
	"redemption_request_id" uuid,
	"distribution_id" uuid,
	"payer_user_id" uuid,
	"payee_user_id" uuid,
	"type" "investment_transaction_type" NOT NULL,
	"status" "investment_transaction_status" DEFAULT 'PENDING' NOT NULL,
	"amount" bigint NOT NULL,
	"currency" varchar(12) DEFAULT 'USD' NOT NULL,
	"provider" varchar(64) NOT NULL,
	"provider_ref" varchar(255),
	"idempotency_key" varchar(255),
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "investment_transactions_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "investor_positions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"investor_user_id" uuid NOT NULL,
	"units_held" bigint DEFAULT 0 NOT NULL,
	"average_unit_cost" bigint,
	"invested_amount" bigint DEFAULT 0 NOT NULL,
	"realized_payout_amount" bigint DEFAULT 0 NOT NULL,
	"last_activity_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kyc_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "kyc_submission_status" DEFAULT 'PENDING' NOT NULL,
	"document_type" "kyc_document_type" NOT NULL,
	"document_front_url" text,
	"document_back_url" text,
	"selfie_url" text,
	"date_of_birth" timestamp,
	"nationality" varchar(2),
	"country_of_residence" varchar(2),
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewer_user_id" uuid,
	"rejection_reason" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(220) NOT NULL,
	"name" varchar(220) NOT NULL,
	"description" text,
	"type" "property_type" DEFAULT 'OTHER' NOT NULL,
	"status" "property_status" DEFAULT 'DRAFT' NOT NULL,
	"country" varchar(2) NOT NULL,
	"city" varchar(120),
	"address_line_1" varchar(255),
	"address_line_2" varchar(255),
	"postal_code" varchar(32),
	"cover_image_url" text,
	"appraised_value" bigint,
	"currency" varchar(12) DEFAULT 'USD' NOT NULL,
	"year_built" integer,
	"metadata" jsonb,
	"created_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "properties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "property_distributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"title" varchar(180) NOT NULL,
	"description" text,
	"currency" varchar(12) DEFAULT 'USD' NOT NULL,
	"total_amount" bigint NOT NULL,
	"record_date" timestamp,
	"pay_date" timestamp,
	"created_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_offerings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"title" varchar(220) NOT NULL,
	"summary" varchar(500),
	"status" "offering_status" DEFAULT 'DRAFT' NOT NULL,
	"currency" varchar(12) DEFAULT 'USD' NOT NULL,
	"target_amount" bigint NOT NULL,
	"raised_amount" bigint DEFAULT 0 NOT NULL,
	"min_investment_amount" bigint,
	"max_investment_amount" bigint,
	"total_units" bigint NOT NULL,
	"unit_price" bigint NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "redemption_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"window_id" uuid NOT NULL,
	"property_id" uuid NOT NULL,
	"investor_user_id" uuid NOT NULL,
	"units_requested" bigint NOT NULL,
	"units_approved" bigint DEFAULT 0 NOT NULL,
	"amount_estimated" bigint,
	"amount_settled" bigint,
	"status" "redemption_request_status" DEFAULT 'PENDING' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"settled_at" timestamp,
	"reviewer_user_id" uuid,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "redemption_windows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"status" "redemption_window_status" DEFAULT 'SCHEDULED' NOT NULL,
	"opens_at" timestamp NOT NULL,
	"closes_at" timestamp NOT NULL,
	"settles_at" timestamp,
	"max_redeemable_units" bigint,
	"total_requested_units" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offering_id" uuid NOT NULL,
	"investor_user_id" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"units_requested" bigint NOT NULL,
	"units_allocated" bigint DEFAULT 0 NOT NULL,
	"status" "subscription_order_status" DEFAULT 'PENDING' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"funded_at" timestamp,
	"allocated_at" timestamp,
	"cancelled_at" timestamp,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_eligibility_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"kyc_status" "kyc_submission_status" DEFAULT 'PENDING' NOT NULL,
	"country" varchar(2),
	"date_of_birth" timestamp,
	"is_age_eligible" boolean DEFAULT false NOT NULL,
	"is_country_eligible" boolean DEFAULT false NOT NULL,
	"is_kyc_approved" boolean DEFAULT false NOT NULL,
	"is_eligible_to_invest" boolean DEFAULT false NOT NULL,
	"last_evaluated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "distribution_allocations" ADD CONSTRAINT "distribution_allocations_distribution_id_property_distributions_id_fk" FOREIGN KEY ("distribution_id") REFERENCES "public"."property_distributions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distribution_allocations" ADD CONSTRAINT "distribution_allocations_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distribution_allocations" ADD CONSTRAINT "distribution_allocations_investor_user_id_users_id_fk" FOREIGN KEY ("investor_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_offering_id_property_offerings_id_fk" FOREIGN KEY ("offering_id") REFERENCES "public"."property_offerings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_subscription_order_id_subscription_orders_id_fk" FOREIGN KEY ("subscription_order_id") REFERENCES "public"."subscription_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_redemption_request_id_redemption_requests_id_fk" FOREIGN KEY ("redemption_request_id") REFERENCES "public"."redemption_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_distribution_id_property_distributions_id_fk" FOREIGN KEY ("distribution_id") REFERENCES "public"."property_distributions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_payer_user_id_users_id_fk" FOREIGN KEY ("payer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_payee_user_id_users_id_fk" FOREIGN KEY ("payee_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_positions" ADD CONSTRAINT "investor_positions_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investor_positions" ADD CONSTRAINT "investor_positions_investor_user_id_users_id_fk" FOREIGN KEY ("investor_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_submissions" ADD CONSTRAINT "kyc_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_submissions" ADD CONSTRAINT "kyc_submissions_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_distributions" ADD CONSTRAINT "property_distributions_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_distributions" ADD CONSTRAINT "property_distributions_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_offerings" ADD CONSTRAINT "property_offerings_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_requests" ADD CONSTRAINT "redemption_requests_window_id_redemption_windows_id_fk" FOREIGN KEY ("window_id") REFERENCES "public"."redemption_windows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_requests" ADD CONSTRAINT "redemption_requests_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_requests" ADD CONSTRAINT "redemption_requests_investor_user_id_users_id_fk" FOREIGN KEY ("investor_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_requests" ADD CONSTRAINT "redemption_requests_reviewer_user_id_users_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "redemption_windows" ADD CONSTRAINT "redemption_windows_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_orders" ADD CONSTRAINT "subscription_orders_offering_id_property_offerings_id_fk" FOREIGN KEY ("offering_id") REFERENCES "public"."property_offerings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_orders" ADD CONSTRAINT "subscription_orders_investor_user_id_users_id_fk" FOREIGN KEY ("investor_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_eligibility_profiles" ADD CONSTRAINT "user_eligibility_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;