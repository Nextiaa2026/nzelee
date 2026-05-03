import {
  bigint,
  boolean,
  date,
  index,
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

export const paymentTransactionStatusEnum = pgEnum(
  "payment_transaction_status",
  ["PENDING", "PROCESSING", "SUCCEEDED", "FAILED", "CANCELED", "REVERSED"],
);

export const withdrawalStatusEnum = pgEnum("withdrawal_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "SYSTEM",
  "KYC",
  "INVESTMENT",
  "WITHDRAWAL",
  "GENERAL",
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
  /** Preferred display / wallet currency chosen at onboarding (ISO 4217). */
  preferredCurrency: varchar("preferred_currency", { length: 12 })
    .default("XAF")
    .notNull(),
  /** Collected at onboarding for eligibility; must match ID at KYC. */
  dateOfBirth: date("date_of_birth", { mode: "date" }),
  organization: varchar("organization", { length: 120 }),
  phone: varchar("phone", { length: 20 }),
  lastLoginAt: timestamp("last_login_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** In-app user notifications (KYC, withdrawals, system, etc.). */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").default("GENERAL").notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    body: text("body"),
    href: varchar("href", { length: 512 }),
    readAt: timestamp("read_at", { mode: "date" }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    userCreatedIdx: index("notifications_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
  }),
);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<"oauth" | "oidc" | "email" | "webauthn">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
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
  }),
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
  }),
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
  /** Business domain or industry category. */
  activitySector: varchar("activity_sector", { length: 100 }),
  /** Entity or person responsible for the campaign. */
  projectOwner: varchar("project_owner", { length: 120 }),
  /** Categorization labels for filtering and organization. */
  tags: jsonb("tags").$type<string[]>().default([]),
  /** Country or city label displayed on campaign public page. */
  locationLabel: varchar("location_label", { length: 160 }),
  /** Whether the campaign has passed internal verification checks. */
  isVerified: boolean("is_verified").default(false).notNull(),
  /** Array of supporting campaign documents. */
  documents: jsonb("documents")
    .$type<Array<{ name: string; url: string }>>()
    .default([]),
  /** Optional gallery images shown in detail pages. */
  galleryImages: jsonb("gallery_images")
    .$type<Array<{ url: string; alt?: string }>>()
    .default([]),
  /** Impact highlight bullets/cards shown in campaign details. */
  impactPoints: jsonb("impact_points").$type<string[]>().default([]),
  /** Cover / hero image (e.g. Cloudinary secure URL). */
  coverImageUrl: text("cover_image_url"),
  /** Minimum accepted investment amount in smallest currency unit. */
  minimumInvestmentAmount: bigint("minimum_investment_amount", { mode: "number" }),
  /** Projected annual return percentage shown to investors. */
  targetReturnRate: integer("target_return_rate"),
  /** Campaign duration in months. */
  durationMonths: integer("duration_months"),
  goalAmount: bigint("goal_amount", { mode: "number" }).notNull(),
  raisedAmount: bigint("raised_amount", { mode: "number" })
    .default(0)
    .notNull(),
  currency: varchar("currency", { length: 12 }).default("USD").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  status: campaignStatusEnum("status").default("DRAFT").notNull(),
  startsAt: timestamp("starts_at", { mode: "date" }),
  endsAt: timestamp("ends_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Saved campaigns (bookmarks / favorites) for signed-in users. */
export const campaignFavorites = pgTable(
  "campaign_favorites",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    campaignId: uuid("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.campaignId] }),
    userIdx: index("campaign_favorites_user_id_idx").on(table.userId),
    campaignIdx: index("campaign_favorites_campaign_id_idx").on(
      table.campaignId,
    ),
  }),
);

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
  pledgeId: uuid("pledge_id").references(() => pledges.id, {
    onDelete: "set null",
  }),
  /** Who paid (e.g. backer on a capture); nullable for system-only rows. */
  payerUserId: uuid("payer_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  /** Who receives funds on payouts; null for pure charges/refunds to platform ledger. */
  payeeUserId: uuid("payee_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
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
  publishedAt: timestamp("published_at", { mode: "date" })
    .defaultNow()
    .notNull(),
});

/** Public campaign reviews by investors. */
export const campaignReviews = pgTable("campaign_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
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
  requestedAt: timestamp("requested_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  processedAt: timestamp("processed_at", { mode: "date" }),
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

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

export const ticketStatusEnum = pgEnum("ticket_status", [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
]);

export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

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
  submittedAt: timestamp("submitted_at", { mode: "date" })
    .defaultNow()
    .notNull(),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  reviewerUserId: uuid("reviewer_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  rejectionReason: text("rejection_reason"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

/** Materialized eligibility flags used to gate investing (campaign pledges, etc.). */
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

/** Support tickets from contact form submissions. */
export const supportTickets = pgTable(
  "support_tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    message: text("message").notNull(),
    status: ticketStatusEnum("status").default("OPEN").notNull(),
    priority: ticketPriorityEnum("priority").default("MEDIUM").notNull(),
    adminNotes: text("admin_notes"),
    adminUserId: uuid("admin_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("support_tickets_status_idx").on(table.status),
    createdAtIdx: index("support_tickets_created_at_idx").on(table.createdAt),
    emailIdx: index("support_tickets_email_idx").on(table.email),
  }),
);
