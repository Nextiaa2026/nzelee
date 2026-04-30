DROP TABLE IF EXISTS "investment_transactions" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "distribution_allocations" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "property_distributions" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "redemption_requests" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "redemption_windows" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "subscription_orders" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "investor_positions" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "property_offerings" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "properties" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "allowed_countries" CASCADE;--> statement-breakpoint
DROP TYPE IF EXISTS "public"."investment_transaction_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."investment_transaction_type";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."offering_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."property_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."property_type";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."redemption_request_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."redemption_window_status";--> statement-breakpoint
DROP TYPE IF EXISTS "public"."subscription_order_status";
