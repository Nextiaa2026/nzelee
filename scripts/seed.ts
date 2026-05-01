/**
 * Seeds a local admin user and a few demo campaigns (owned by that user).
 *
 * Requires DATABASE_URL. Optional: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME.
 *
 * Run: `bun run scripts/seed.ts` or `npm run db:seed`
 */
import { and, eq } from "drizzle-orm";

import { disconnectDb, db } from "../lib/db";
import {
  campaigns,
  paymentTransactions,
  pledges,
  rewardTiers,
  users,
} from "../lib/db/schema";
import { hashPassword } from "../lib/security/password";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@nexiaa.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Seed Admin";

const SEED_CAMPAIGNS = [
  {
    slug: "seed-solar-microgrid",
    title: "Community solar microgrid",
    summary: "Fund rooftop panels and battery storage for a rural co-op pilot.",
    description:
      "This seed campaign demonstrates a renewable energy raise: engineering studies, equipment, and installation milestones.",
    goalAmount: 5_000_000,
    raisedAmount: 1_250_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      {
        title: "Supporter",
        description: "Digital thank-you + updates",
        amount: 2_500,
      },
      { title: "Backer", description: "Name on donor wall", amount: 10_000 },
    ],
  },
  {
    slug: "seed-urban-food-lab",
    title: "Urban food lab expansion",
    summary: "Turn a vacant lot into hydroponic greens for local restaurants.",
    description:
      "Seed data for a food-system campaign: greenhouse build-out, staffing, and first-season distribution.",
    goalAmount: 2_500_000,
    raisedAmount: 0,
    status: "DRAFT" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Early bird", description: "First harvest box", amount: 5_000 },
    ],
  },
  {
    slug: "seed-coastal-cleanup",
    title: "Coastal cleanup & education fleet",
    summary:
      "Boats, gear, and school programs to remove plastic from shorelines.",
    description:
      "Environmental seed campaign with a clear goal and timeline for fleet maintenance and volunteer training.",
    goalAmount: 8_000_000,
    raisedAmount: 6_400_000,
    status: "FUNDED" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      {
        title: "Volunteer kit",
        description: "Reusable gloves + bag",
        amount: 1_000,
      },
      {
        title: "Patron",
        description: "Sponsor a school workshop",
        amount: 50_000,
      },
    ],
  },
  {
    slug: "seed-tech-education-hub",
    title: "Tech education hub for underserved communities",
    summary: "Build a coding bootcamp and makerspace in rural areas.",
    description:
      "Empowering the next generation with technology skills through hands-on learning and mentorship programs.",
    goalAmount: 3_500_000,
    raisedAmount: 2_100_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Supporter", description: "Monthly newsletter", amount: 1_000 },
      {
        title: "Sponsor",
        description: "Name on building plaque",
        amount: 25_000,
      },
    ],
  },
  {
    slug: "seed-clean-water-initiative",
    title: "Clean water wells for 50 villages",
    summary:
      "Drill wells and install filtration systems in water-scarce regions.",
    description:
      "Providing sustainable access to clean drinking water through community-managed well systems.",
    goalAmount: 6_000_000,
    raisedAmount: 4_500_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      {
        title: "Water drop",
        description: "Certificate of impact",
        amount: 5_000,
      },
      { title: "Well sponsor", description: "Name a well", amount: 100_000 },
    ],
  },
  {
    slug: "seed-renewable-transport",
    title: "Electric bus fleet for city transit",
    summary: "Replace diesel buses with electric vehicles to reduce emissions.",
    description:
      "Modernizing public transportation with zero-emission electric buses and charging infrastructure.",
    goalAmount: 12_000_000,
    raisedAmount: 8_400_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Rider", description: "Free monthly pass", amount: 2_000 },
      {
        title: "Fleet sponsor",
        description: "Bus naming rights",
        amount: 500_000,
      },
    ],
  },
  {
    slug: "seed-affordable-housing",
    title: "Affordable housing co-op development",
    summary: "Build 100 units of sustainable, affordable housing.",
    description:
      "Creating community-owned housing with solar panels, gardens, and shared amenities.",
    goalAmount: 15_000_000,
    raisedAmount: 15_000_000,
    status: "FUNDED" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      { title: "Supporter", description: "Project updates", amount: 10_000 },
      {
        title: "Founding member",
        description: "Priority housing access",
        amount: 250_000,
      },
    ],
  },
  {
    slug: "seed-local-brewery",
    title: "Community-owned craft brewery",
    summary: "Launch a cooperative brewery using local ingredients.",
    description:
      "Building a sustainable brewery that sources from local farms and shares profits with the community.",
    goalAmount: 1_800_000,
    raisedAmount: 900_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Taster", description: "Founding member mug", amount: 500 },
      { title: "Brewer", description: "Name a beer", amount: 10_000 },
    ],
  },
  {
    slug: "seed-arts-center",
    title: "Community arts and performance center",
    summary: "Renovate historic building into a multi-use arts venue.",
    description:
      "Transforming a landmark building into a hub for theater, music, visual arts, and community events.",
    goalAmount: 4_200_000,
    raisedAmount: 3_150_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      { title: "Patron", description: "Season tickets", amount: 5_000 },
      { title: "Benefactor", description: "Named seat", amount: 50_000 },
    ],
  },
  {
    slug: "seed-mobile-health-clinic",
    title: "Mobile health clinics for remote areas",
    summary: "Deploy medical vans to underserved rural communities.",
    description:
      "Bringing healthcare directly to people who lack access through fully-equipped mobile clinics.",
    goalAmount: 5_500_000,
    raisedAmount: 4_125_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Supporter", description: "Impact report", amount: 2_500 },
      {
        title: "Clinic sponsor",
        description: "Van naming rights",
        amount: 200_000,
      },
    ],
  },
  {
    slug: "seed-recycling-facility",
    title: "Advanced recycling and composting facility",
    summary: "Build a zero-waste processing center for the region.",
    description:
      "State-of-the-art facility to process recyclables and organic waste, creating jobs and reducing landfill use.",
    goalAmount: 9_000_000,
    raisedAmount: 6_300_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      { title: "Green supporter", description: "Facility tour", amount: 1_000 },
      {
        title: "Sustainability partner",
        description: "Corporate recognition",
        amount: 100_000,
      },
    ],
  },
  {
    slug: "seed-youth-sports-complex",
    title: "Youth sports and recreation complex",
    summary: "Build fields, courts, and facilities for youth athletics.",
    description:
      "Creating a comprehensive sports complex with soccer fields, basketball courts, and training facilities.",
    goalAmount: 7_500_000,
    raisedAmount: 5_625_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Fan", description: "Season pass", amount: 1_500 },
      { title: "Field sponsor", description: "Name a field", amount: 150_000 },
    ],
  },
  {
    slug: "seed-local-food-market",
    title: "Year-round farmers market pavilion",
    summary: "Covered market space for local farmers and artisans.",
    description:
      "Building a permanent structure to host farmers markets, food vendors, and community events year-round.",
    goalAmount: 2_200_000,
    raisedAmount: 1_760_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      {
        title: "Market supporter",
        description: "Vendor discounts",
        amount: 500,
      },
      {
        title: "Stall sponsor",
        description: "Named vendor space",
        amount: 25_000,
      },
    ],
  },
  {
    slug: "seed-wildlife-sanctuary",
    title: "Wildlife rehabilitation and sanctuary",
    summary:
      "Rescue and rehabilitate injured wildlife with education programs.",
    description:
      "Creating a sanctuary for injured animals with veterinary care, rehabilitation, and public education.",
    goalAmount: 3_800_000,
    raisedAmount: 2_850_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      {
        title: "Friend of wildlife",
        description: "Adoption certificate",
        amount: 2_000,
      },
      {
        title: "Habitat sponsor",
        description: "Name an enclosure",
        amount: 75_000,
      },
    ],
  },
  {
    slug: "seed-community-radio",
    title: "Community radio station launch",
    summary: "Start a non-profit radio station for local voices.",
    description:
      "Building a community-owned radio station to broadcast local news, music, and cultural programming.",
    goalAmount: 800_000,
    raisedAmount: 640_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Listener", description: "Station swag", amount: 250 },
      {
        title: "Show sponsor",
        description: "Program naming rights",
        amount: 10_000,
      },
    ],
  },
  {
    slug: "seed-bike-share-program",
    title: "City-wide bike share program",
    summary: "Launch a public bicycle sharing system with 500 bikes.",
    description:
      "Implementing a sustainable transportation option with bike stations throughout the city.",
    goalAmount: 2_500_000,
    raisedAmount: 1_875_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Rider", description: "Annual membership", amount: 500 },
      {
        title: "Station sponsor",
        description: "Name a bike station",
        amount: 50_000,
      },
    ],
  },
  {
    slug: "seed-makerspace-lab",
    title: "Community makerspace and fab lab",
    summary: "Equip a workshop with 3D printers, tools, and equipment.",
    description:
      "Creating a shared workspace for makers, inventors, and entrepreneurs with professional-grade equipment.",
    goalAmount: 1_500_000,
    raisedAmount: 1_125_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Maker", description: "Monthly membership", amount: 1_000 },
      { title: "Tool sponsor", description: "Name equipment", amount: 20_000 },
    ],
  },
  {
    slug: "seed-senior-center",
    title: "Senior community and wellness center",
    summary:
      "Build a center for senior activities, health, and social programs.",
    description:
      "Creating a vibrant space for seniors with fitness classes, social activities, and health services.",
    goalAmount: 4_500_000,
    raisedAmount: 3_375_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      {
        title: "Supporter",
        description: "Newsletter subscription",
        amount: 1_000,
      },
      { title: "Room sponsor", description: "Name a room", amount: 100_000 },
    ],
  },
  {
    slug: "seed-urban-garden-network",
    title: "Urban community garden network",
    summary: "Establish 20 community gardens across the city.",
    description:
      "Transforming vacant lots into productive community gardens with education and food distribution programs.",
    goalAmount: 1_200_000,
    raisedAmount: 960_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: false,
    tiers: [
      { title: "Gardener", description: "Plot access", amount: 500 },
      { title: "Garden sponsor", description: "Name a garden", amount: 15_000 },
    ],
  },
  {
    slug: "seed-music-school",
    title: "Free music school for youth",
    summary: "Provide free music education and instruments to children.",
    description:
      "Offering comprehensive music education with instruments, lessons, and performance opportunities for underserved youth.",
    goalAmount: 2_800_000,
    raisedAmount: 2_100_000,
    status: "LIVE" as const,
    currency: "USD",
    isFeatured: true,
    tiers: [
      { title: "Music lover", description: "Concert tickets", amount: 1_000 },
      {
        title: "Instrument sponsor",
        description: "Provide instruments",
        amount: 25_000,
      },
    ],
  },
] as const;

const DEFAULT_GALLERY = [
  "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  "https://res.cloudinary.com/demo/image/upload/v1312461204/park.jpg",
  "https://res.cloudinary.com/demo/image/upload/v1312461204/landscape.jpg",
] as const;

function structuredCampaignFields(
  c: (typeof SEED_CAMPAIGNS)[number],
  index: number,
) {
  const minAmount = Math.max(50_000, Math.round(c.goalAmount * 0.02));
  const durationMonths = 12 + (index % 4) * 6;
  const targetReturnRate = 8 + (index % 7);
  const impactPoints = [
    `Create local impact through ${c.title.toLowerCase()}.`,
    "Deploy funding in verified milestones with transparent reporting.",
  ];
  const galleryImages = DEFAULT_GALLERY.map((url, i) => ({
    url,
    alt: `${c.title} gallery image ${i + 1}`,
  }));
  const documents = [
    { name: "Investment Memo", url: "https://example.com/docs/investment-memo.pdf" },
    { name: "Financial Projections", url: "https://example.com/docs/projections.pdf" },
  ];
  return {
    locationLabel: "Nakuru County, Kenya",
    isVerified: c.status !== "DRAFT",
    minimumInvestmentAmount: minAmount,
    targetReturnRate,
    durationMonths,
    impactPoints,
    galleryImages,
    documents,
  };
}

const SEED_INVESTORS = [
  { name: "Amelia Carter", email: "amelia@nexiaa.local" },
  { name: "Marcus Lin", email: "marcus@nexiaa.local" },
  { name: "Sofia Almeida", email: "sofia@nexiaa.local" },
  { name: "Daniel Park", email: "daniel@nexiaa.local" },
  { name: "Priya Raman", email: "priya@nexiaa.local" },
  { name: "Jonas Becker", email: "jonas@nexiaa.local" },
  { name: "Hannah Cole", email: "hannah@nexiaa.local" },
  { name: "Yuki Tanaka", email: "yuki@nexiaa.local" },
] as const;

async function ensureAdminUser(): Promise<string> {
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  if (existing) {
    if (existing.role !== "ADMIN") {
      await db
        .update(users)
        .set({ role: "ADMIN", updatedAt: new Date() })
        .where(eq(users.id, existing.id));
    }
    console.log(
      `Admin user already exists: ${ADMIN_EMAIL} (id: ${existing.id})`,
    );
    return existing.id;
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD);
  const [inserted] = await db
    .insert(users)
    .values({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "ADMIN",
      emailVerified: new Date(),
      onboardingCompletedAt: new Date(),
    })
    .returning({ id: users.id });

  if (!inserted) {
    throw new Error("Failed to insert admin user");
  }

  console.log(`Created admin user: ${ADMIN_EMAIL} (password: env or default)`);
  return inserted.id;
}

async function seedCampaigns(creatorId: string) {
  for (const [index, c] of SEED_CAMPAIGNS.entries()) {
    const extra = structuredCampaignFields(c, index);
    const [existing] = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(eq(campaigns.slug, c.slug))
      .limit(1);

    if (existing) {
      await db
        .update(campaigns)
        .set({
          creatorId,
          title: c.title,
          summary: c.summary,
          description: c.description,
          goalAmount: c.goalAmount,
          raisedAmount: c.raisedAmount,
          currency: c.currency,
          status: c.status,
          isFeatured: c.isFeatured,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
          ...extra,
        })
        .where(eq(campaigns.id, existing.id));

      await db.delete(rewardTiers).where(eq(rewardTiers.campaignId, existing.id));
      if (c.tiers.length > 0) {
        await db.insert(rewardTiers).values(
          c.tiers.map((t) => ({
            campaignId: existing.id,
            title: t.title,
            description: t.description,
            amount: t.amount,
          })),
        );
      }
      console.log(`Campaign refreshed: ${c.title} (${c.slug})`);
      continue;
    }

    const [campaign] = await db
      .insert(campaigns)
      .values({
        creatorId,
        title: c.title,
        slug: c.slug,
        summary: c.summary,
        description: c.description,
        goalAmount: c.goalAmount,
        raisedAmount: c.raisedAmount,
        currency: c.currency,
        status: c.status,
        isFeatured: c.isFeatured,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        ...extra,
      })
      .returning({ id: campaigns.id });

    if (!campaign) {
      throw new Error(`Failed to insert campaign ${c.slug}`);
    }

    if (c.tiers.length > 0) {
      await db.insert(rewardTiers).values(
        c.tiers.map((t) => ({
          campaignId: campaign.id,
          title: t.title,
          description: t.description,
          amount: t.amount,
        })),
      );
    }

    console.log(`Created campaign: ${c.title} (${c.slug})`);
  }
}

async function ensureInvestorUsers() {
  const ids = new Map<string, string>();
  for (const investor of SEED_INVESTORS) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, investor.email))
      .limit(1);
    if (existing) {
      ids.set(investor.email, existing.id);
      continue;
    }

    const passwordHash = await hashPassword("ChangeMe123!");
    const [inserted] = await db
      .insert(users)
      .values({
        name: investor.name,
        email: investor.email,
        passwordHash,
        role: "USER",
        emailVerified: new Date(),
        onboardingCompletedAt: new Date(),
      })
      .returning({ id: users.id });

    if (!inserted)
      throw new Error(`Failed to create investor ${investor.email}`);
    ids.set(investor.email, inserted.id);
  }
  return ids;
}

async function seedInvestorPledges(investorIds: Map<string, string>) {
  const liveCampaigns = await db
    .select({
      id: campaigns.id,
      title: campaigns.title,
      creatorId: campaigns.creatorId,
    })
    .from(campaigns)
    .where(eq(campaigns.status, "LIVE"));

  if (!liveCampaigns.length) return;

  const amounts = [
    220_000, 185_000, 160_000, 130_000, 100_000, 80_000, 60_000, 45_000,
  ];

  for (let i = 0; i < SEED_INVESTORS.length; i += 1) {
    const investor = SEED_INVESTORS[i];
    const backerId = investorIds.get(investor.email);
    const campaign = liveCampaigns[i % liveCampaigns.length];
    if (!backerId || !campaign) continue;

    const amount = amounts[i] ?? 50_000;
    const [existing] = await db
      .select({ id: pledges.id })
      .from(pledges)
      .where(
        and(
          eq(pledges.backerId, backerId),
          eq(pledges.campaignId, campaign.id),
          eq(pledges.amount, amount),
        ),
      )
      .limit(1);

    if (existing) continue;

    const [pledge] = await db
      .insert(pledges)
      .values({
        campaignId: campaign.id,
        backerId,
        amount,
        status: "PAID",
      })
      .returning({ id: pledges.id });
    if (!pledge) continue;

    await db.insert(paymentTransactions).values({
      campaignId: campaign.id,
      pledgeId: pledge.id,
      payerUserId: backerId,
      payeeUserId: campaign.creatorId,
      type: "PLEDGE_CAPTURE",
      status: "SUCCEEDED",
      amount,
      currency: "USD",
      provider: "seed",
      idempotencyKey: `seed-${campaign.id}-${backerId}-${amount}`,
      description: "Seeded investor pledge capture",
    });
  }
}

async function main() {
  const adminId = await ensureAdminUser();
  await seedCampaigns(adminId);
  const investorIds = await ensureInvestorUsers();
  await seedInvestorPledges(investorIds);
  console.log("Seed completed.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => disconnectDb());
