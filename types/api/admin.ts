/** Admin stats summary returned by `GET /api/v1/admin/stats/summary`. */
export type AdminStatsSummary = {
  users: { total: number; byRole: Record<string, number> };
  campaigns: { total: number; byStatus: Record<string, number> };
  pledges: { total: number; byStatus: Record<string, number> };
  withdrawalRequests: { total: number; byStatus: Record<string, number> };
  paymentTransactions: { total: number; byStatus: Record<string, number> };
  totalPaidPledgeAmount: string;
  totalSucceededRelevantTxAmount: string;
  pipeline: { pendingWithdrawals: number; pendingPledges: number };
};

export type AdminTimeseriesPoint = {
  date: string;
  pledged: string;
  transactionVolume: string;
};

export type AdminUsersListResponse = {
  items: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
  }[];
  total: number;
  page: number;
  pageSize: number;
};

/** Row from `GET /admin/pledges` */
export type AdminPledgeListRow = {
  id: string;
  campaignId: string;
  campaignTitle: string;
  backerId: string;
  backerEmail: string;
  backerName: string | null;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: Date;
};

export type AdminWithdrawalListRow = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  destination: string;
  adminNote: string | null;
  requestedAt: Date;
  processedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
  userName: string | null;
};

export type AdminPropertyListRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  type:
    | "RESIDENTIAL"
    | "COMMERCIAL"
    | "INDUSTRIAL"
    | "LAND"
    | "MIXED_USE"
    | "HOSPITALITY"
    | "OTHER";
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "SOLD" | "CLOSED";
  country: string;
  city: string | null;
  coverImageUrl: string | null;
  appraisedValue: number | null;
  currency: string;
  createdByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminKycSubmissionRow = {
  id: string;
  userId: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED";
  documentType:
    | "PASSPORT"
    | "NATIONAL_ID"
    | "DRIVERS_LICENSE"
    | "RESIDENCE_PERMIT"
    | "PROOF_OF_ADDRESS"
    | "OTHER";
  documentFrontUrl: string | null;
  documentBackUrl: string | null;
  selfieUrl: string | null;
  dateOfBirth: Date | null;
  nationality: string | null;
  countryOfResidence: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
  reviewerUserId: string | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
  userName: string | null;
};
