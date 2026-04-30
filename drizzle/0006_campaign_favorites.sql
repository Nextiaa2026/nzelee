CREATE TABLE "campaign_favorites" (
	"user_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "campaign_favorites_user_id_campaign_id_pk" PRIMARY KEY("user_id","campaign_id")
);
--> statement-breakpoint
ALTER TABLE "campaign_favorites" ADD CONSTRAINT "campaign_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_favorites" ADD CONSTRAINT "campaign_favorites_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "campaign_favorites_user_id_idx" ON "campaign_favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "campaign_favorites_campaign_id_idx" ON "campaign_favorites" USING btree ("campaign_id");