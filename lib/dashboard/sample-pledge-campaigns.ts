import type { PublicCampaignBrowseRow } from "@/lib/services/public-campaigns";

/**
 * Shown on the dashboard overview when there are no browseable campaigns in the DB yet.
 */
export const SAMPLE_PLEDGE_CAMPAIGNS: PublicCampaignBrowseRow[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Community solar — Block A",
    slug: "",
    summary: "Sample pledge: rooftop PV and storage for a mixed-use housing block.",
    coverImageUrl: null,
    goalAmount: 5_000_000,
    raisedAmount: 2_125_000,
    currency: "USD",
    isFeatured: false,
    status: "LIVE",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    title: "Regional food hub cold chain",
    slug: "",
    summary: "Sample pledge: refrigeration and last-mile logistics for local producers.",
    coverImageUrl: null,
    goalAmount: 3_200_000,
    raisedAmount: 890_000,
    currency: "USD",
    isFeatured: false,
    status: "LIVE",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    title: "Youth coding academy (year one)",
    slug: "",
    summary: "Sample pledge: laptops, mentors, and venue for an after-school STEM program.",
    coverImageUrl: null,
    goalAmount: 1_800_000,
    raisedAmount: 1_800_000,
    currency: "USD",
    isFeatured: false,
    status: "FUNDED",
  },
];
