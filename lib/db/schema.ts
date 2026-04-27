import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["USER", "CREATOR", "ADMIN"]);
export const campaignStatusEnum = pgEnum("campaign_status", [
  "DRAFT",
  "LIVE",
  "FUNDED",
  "CLOSED",
  "CANCELLED",
]);
export const pledgeStatusEnum = pgEnum("pledge_status", [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);

/** Money movement tied to pledges / campaigns (charges, refunds, payouts, fees). */
export const paymentTransactionTypeEnum = pgEnum("payment_transaction_type", [
  "PLEDGE_CAPTURE",
  "REFUND",
  "CREATOR_PAYOUT",
  "PLATFORM_FEE",
  "ADJUSTMENT",
]);

export const paymentTransactionStatusEnum = pgEnum("payment_transaction_status", [
  "PENDING",
  "PROCESSING",
  "SUCCEEDED",
  "FAILED",
  "CANCELED",
  "REVERSED",
]);

export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").default("USER").notNull(),
  /** Set when the user finishes first-time setup (profile, preferences, etc.). */
  onboardingCompletedAt: timestamp("onboarding_completed_at", { mode: "date" }),
  /** ISO 3166-1 alpha-2 (e.g. US, GB), set during onboarding. */
  country: varchar("country", { length: 2 }),
  organization: varchar("organization", { length: 120 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).$type<
      "oauth" | "oidc" | "email" | "credentials"
    >(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    compoundKey: primaryKey({
      columns: [table.identifier, table.token],
    }),
  })
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  summary: varchar("summary", { length: 320 }).notNull(),
  description: text("description").notNull(),
  /** Cover / hero image (e.g. Cloudinary secure URL). */
  coverImageUrl: text("cover_image_url"),
  goalAmount: bigint("goal_amount", { mode: "number" }).notNull(),
  raisedAmount: bigint("raised_amount", { mode: "number" }).default(0).notNull(),
  currency: varchar("currency", { length: 12 }).default("USD").notNull(),
  status: campaignStatusEnum("status").default("DRAFT").notNull(),
  startsAt: timestamp("starts_at", { mode: "date" }),
  endsAt: timestamp("ends_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const rewardTiers = pgTable("reward_tiers", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull(),
  description: text("description"),
  amount: bigint("amount", { mode: "number" }).notNull(),
  backerLimit: integer("backer_limit"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const pledges = pgTable("pledges", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  backerId: uuid("backer_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rewardTierId: uuid("reward_tier_id").references(() => rewardTiers.id, {
    onDelete: "set null",
  }),
  amount: bigint("amount", { mode: "number" }).notNull(),
  status: pledgeStatusEnum("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

/**
 * Records each financial step for auditing and payment-provider reconciliation.
 * Amounts are in the smallest currency unit (e.g. cents) when currency is fiat.
 */
export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  pledgeId: uuid("pledge_id").references(() => pledges.id, { onDelete: "set null" }),
  /** Who paid (e.g. backer on a capture); nullable for system-only rows. */
  payerUserId: uuid("payer_user_id").references(() => users.id, { onDelete: "set null" }),
  /** Who receives funds on payouts; null for pure charges/refunds to platform ledger. */
  payeeUserId: uuid("payee_user_id").references(() => users.id, { onDelete: "set null" }),
  type: paymentTransactionTypeEnum("type").notNull(),
  status: paymentTransactionStatusEnum("status").default("PENDING").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  currency: varchar("currency", { length: 12 }).default("USD").notNull(),
  /** Payment processor: stripe, paypal, manual, … */
  provider: varchar("provider", { length: 64 }).notNull(),
  /** External object id (e.g. Stripe PaymentIntent, Transfer id). */
  providerRef: varchar("provider_ref", { length: 255 }),
  /** Prevent double-submit from client or webhook retries. */
  idempotencyKey: varchar("idempotency_key", { length: 255 }).unique(),
  description: text("description"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const campaignUpdates = pgTable("campaign_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  content: text("content").notNull(),
  publishedAt: timestamp("published_at", { mode: "date" }).defaultNow().notNull(),
});

/** User-initiated cash/wallet withdrawal; amounts in smallest currency unit. */
export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: bigint("amount", { mode: "number" }).notNull(),
  currency: varchar("currency", { length: 12 }).default("USD").notNull(),
  status: withdrawalStatusEnum("status").default("PENDING").notNull(),
  /** Free-form label e.g. "Bank •••• 4242" or "wallet" */
  destination: text("destination").notNull(),
  /** Optional admin note (rejection reason, etc.) */
  adminNote: text("admin_note"),
  requestedAt: timestamp("requested_at", { mode: "date" }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/**
 * ---------------------------------------------------------------------------
 * Property investment domain (new model)
 * ---------------------------------------------------------------------------
 * These tables represent the target platform model:
 * - users invest in properties through offerings
 * - ownership is fractional-units based
 * - exits happen through scheduled redemption windows
 * - KYC + country + age eligibility gate investment activity
 */

export const propertyTypeEnum = pgEnum("property_type", [
  "RESIDENTIAL",
  "COMMERCIAL",
  "INDUSTRIAL",
  "LAND",
  "MIXED_USE",
  "HOSPITALITY",
  "OTHER",
]);

export const propertyStatusEnum = pgEnum("property_status", [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "SOLD",
  "CLOSED",
]);

export const offeringStatusEnum = pgEnum("offering_status", [
  "DRAFT",
  "OPEN",
  "PAUSED",
  "CLOSED",
  "FULLY_SUBSCRIBED",
]);

export const subscriptionOrderStatusEnum = pgEnum("subscription_order_status", [
  "PENDING",
  "FUNDED",
  "ALLOCATED",
  "CANCELLED",
  "FAILED",
]);

export const investmentTransactionTypeEnum = pgEnum("investment_transaction_type", [
  "SUBSCRIPTION",
  "SUBSCRIPTION_REFUND",
  "REDEMPTION_PAYOUT",
  "DISTRIBUTION",
  "PLATFORM_FEE",
  "ADJUSTMENT",
]);

export const investmentTransactionStatusEnum = pgEnum("investment_transaction_status", [
  "PENDING",
  "PROCESSING",
  "SUCCEEDED",
  "FAILED",
  "CANCELED",
  "REVERSED",
]);

export const redemptionWindowStatusEnum = pgEnum("redemption_window_status", [
  "SCHEDULED",
  "OPEN",
  "CLOSED",
  "SETTLED",
  "CANCELLED",
]);

export const redemptionRequestStatusEnum = pgEnum("redemption_request_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
]);

export const kycSubmissionStatusEnum = pgEnum("kyc_submission_status", [
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "EXPIRED",
]);

export const kycDocumentTypeEnum = pgEnum("kyc_document_type", [
  "PASSPORT",
  "NATIONAL_ID",
  "DRIVERS_LICENSE",
  "RESIDENCE_PERMIT",
  "PROOF_OF_ADDRESS",
  "OTHER",
]);

export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  name: varchar("name", { length: 220 }).notNull(),
  description: text("description"),
  type: propertyTypeEnum("type").default("OTHER").notNull(),
  status: propertyStatusEnum("status").default("DRAFT").notNull(),
  country: varchar("country", { length: 2 }).notNull(),
  city: varchar("city", { length: 120 }),
  addressLine1: varchar("address_line_1", { length: 255 }),
  addressLine2: varchar("address_line_2", { length: 255 }),
  postalCode: varchar("postal_code", { length: 32 }),
  coverImageUrl: text("cover_image_url"),
  appraisedValue: bigint("appraised_value", { mode: "number" }),
  currency: varchar("currency", { length: 12 }).default("USD").notNull(),
  yearBuilt: integer("year_built"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdByUserId: uuid("created_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Investment round for a property; ownership represented in units. */
export const propertyOfferings = pgTable("property_offerings", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 220 }).notNull(),
  summary: varchar("summary", { length: 500 }),
  status: offeringStatusEnum("status").default("DRAFT").notNull(),
  currency: varchar("currency", { length: 12 }).default("USD").notNull(),
  targetAmount: bigint("target_amount", { mode: "number" }).notNull(),
  raisedAmount: bigint("raised_amount", { mode: "number" }).default(0).notNull(),
  minInvestmentAmount: bigint("min_investment_amount", { mode: "number" }),
  maxInvestmentAmount: bigint("max_investment_amount", { mode: "number" }),
  /** Total units available for the offering (fractional model). */
  totalUnits: bigint("total_units", { mode: "number" }).notNull(),
  /** Price per unit in smallest currency unit. */
  unitPrice: bigint("unit_price", { mode: "number" }).notNull(),
  startsAt: timestamp("starts_at", { mode: "date" }),
  endsAt: timestamp("ends_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Investor order to subscribe in an offering. */
export const subscriptionOrders = pgTable("subscription_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  offeringId: uuid("offering_id")
    .notNull()
    .references(() => propertyOfferings.id, { onDelete: "cascade" }),
  investorUserId: uuid("investor_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: bigint("amount", { mode: "number" }).notNull(),
  unitsRequested: bigint("units_requested", { mode: "number" }).notNull(),
  unitsAllocated: bigint("units_allocated", { mode: "number" }).default(0).notNull(),
  status: subscriptionOrderStatusEnum("status").default("PENDING").notNull(),
  requestedAt: timestamp("requested_at", { mode: "date" }).defaultNow().notNull(),
  fundedAt: timestamp("funded_at", { mode: "date" }),
  allocatedAt: timestamp("allocated_at", { mode: "date" }),
  cancelledAt: timestamp("cancelled_at", { mode: "date" }),
  note: text("note"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Current unit holdings by investor per property. */
export const investorPositions = pgTable("investor_positions", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  investorUserId: uuid("investor_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  unitsHeld: bigint("units_held", { mode: "number" }).default(0).notNull(),
  averageUnitCost: bigint("average_unit_cost", { mode: "number" }),
  investedAmount: bigint("invested_amount", { mode: "number" }).default(0).notNull(),
  realizedPayoutAmount: bigint("realized_payout_amount", { mode: "number" })
    .default(0)
    .notNull(),
  lastActivityAt: timestamp("last_activity_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Scheduled liquidity windows for unit redemption. */
export const redemptionWindows = pgTable("redemption_windows", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  status: redemptionWindowStatusEnum("status").default("SCHEDULED").notNull(),
  opensAt: timestamp("opens_at", { mode: "date" }).notNull(),
  closesAt: timestamp("closes_at", { mode: "date" }).notNull(),
  settlesAt: timestamp("settles_at", { mode: "date" }),
  maxRedeemableUnits: bigint("max_redeemable_units", { mode: "number" }),
  totalRequestedUnits: bigint("total_requested_units", { mode: "number" })
    .default(0)
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Investor request to redeem units in a window. */
export const redemptionRequests = pgTable("redemption_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  windowId: uuid("window_id")
    .notNull()
    .references(() => redemptionWindows.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  investorUserId: uuid("investor_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  unitsRequested: bigint("units_requested", { mode: "number" }).notNull(),
  unitsApproved: bigint("units_approved", { mode: "number" }).default(0).notNull(),
  amountEstimated: bigint("amount_estimated", { mode: "number" }),
  amountSettled: bigint("amount_settled", { mode: "number" }),
  status: redemptionRequestStatusEnum("status").default("PENDING").notNull(),
  requestedAt: timestamp("requested_at", { mode: "date" }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  settledAt: timestamp("settled_at", { mode: "date" }),
  reviewerUserId: uuid("reviewer_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Cash distributions (e.g., rental yield, sale proceeds) per property. */
export const propertyDistributions = pgTable("property_distributions", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  currency: varchar("currency", { length: 12 }).default("USD").notNull(),
  totalAmount: bigint("total_amount", { mode: "number" }).notNull(),
  recordDate: timestamp("record_date", { mode: "date" }),
  payDate: timestamp("pay_date", { mode: "date" }),
  createdByUserId: uuid("created_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Per-investor distribution allocation rows. */
export const distributionAllocations = pgTable("distribution_allocations", {
  id: uuid("id").defaultRandom().primaryKey(),
  distributionId: uuid("distribution_id")
    .notNull()
    .references(() => propertyDistributions.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  investorUserId: uuid("investor_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  unitsAtRecordDate: bigint("units_at_record_date", { mode: "number" }).notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  paidAt: timestamp("paid_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Unified ledger for property investment money movement. */
export const investmentTransactions = pgTable("investment_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  offeringId: uuid("offering_id").references(() => propertyOfferings.id, {
    onDelete: "set null",
  }),
  subscriptionOrderId: uuid("subscription_order_id").references(
    () => subscriptionOrders.id,
    { onDelete: "set null" },
  ),
  redemptionRequestId: uuid("redemption_request_id").references(
    () => redemptionRequests.id,
    { onDelete: "set null" },
  ),
  distributionId: uuid("distribution_id").references(() => propertyDistributions.id, {
    onDelete: "set null",
  }),
  payerUserId: uuid("payer_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  payeeUserId: uuid("payee_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  type: investmentTransactionTypeEnum("type").notNull(),
  status: investmentTransactionStatusEnum("status").default("PENDING").notNull(),
  amount: bigint("amount", { mode: "number" }).notNull(),
  currency: varchar("currency", { length: 12 }).default("USD").notNull(),
  provider: varchar("provider", { length: 64 }).notNull(),
  providerRef: varchar("provider_ref", { length: 255 }),
  idempotencyKey: varchar("idempotency_key", { length: 255 }).unique(),
  description: text("description"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Allowed jurisdictions for investment eligibility checks. */
export const allowedCountries = pgTable("allowed_countries", {
  code: varchar("code", { length: 2 }).primaryKey(),
  enabled: boolean("enabled").default(true).notNull(),
  minAge: integer("min_age").default(18).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Uploaded KYC submission and admin review decision (manual review flow). */
export const kycSubmissions = pgTable("kyc_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: kycSubmissionStatusEnum("status").default("PENDING").notNull(),
  documentType: kycDocumentTypeEnum("document_type").notNull(),
  documentFrontUrl: text("document_front_url"),
  documentBackUrl: text("document_back_url"),
  selfieUrl: text("selfie_url"),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
  nationality: varchar("nationality", { length: 2 }),
  countryOfResidence: varchar("country_of_residence", { length: 2 }),
  submittedAt: timestamp("submitted_at", { mode: "date" }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  reviewerUserId: uuid("reviewer_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  rejectionReason: text("rejection_reason"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Materialized eligibility flags used to gate investing/redemptions. */
export const userEligibilityProfiles = pgTable("user_eligibility_profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  kycStatus: kycSubmissionStatusEnum("kyc_status").default("PENDING").notNull(),
  country: varchar("country", { length: 2 }),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
  isAgeEligible: boolean("is_age_eligible").default(false).notNull(),
  isCountryEligible: boolean("is_country_eligible").default(false).notNull(),
  isKycApproved: boolean("is_kyc_approved").default(false).notNull(),
  isEligibleToInvest: boolean("is_eligible_to_invest").default(false).notNull(),
  lastEvaluatedAt: timestamp("last_evaluated_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
