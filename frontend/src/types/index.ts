export type Role = 'STUDENT' | 'ADMIN';
export type AccountStatus = 'ACTIVE' | 'SUSPENDED';

export type ItemStatus =
  | 'LOST'
  | 'AVAILABLE'
  | 'FOUND_MATCH'
  | 'CLAIMED'
  | 'HANDED_OVER'
  | 'RECOVERED'
  | 'CANCELLED'
  | 'REJECTED';

export type ClaimStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  registrationNumber?: string;
  department?: string;
  yearOfStudy?: number;
  phoneNumber?: string;
  accountStatus: AccountStatus;
  createdAt?: string;
}

export interface UserProfile extends User {
  totalLostReported: number;
  totalFoundReported: number;
  totalClaimsMade: number;
}

export interface Category {
  id: number;
  categoryName: string;
  description?: string;
  icon?: string;
}

export interface BaseItemEntity {
  id: number;
  itemCode: string;
  itemName: string;
  category: Category;
  description: string;
  location: string;
  imageUrl?: string;
  identifyingDetails?: string;
  reportedBy: User;
  status: ItemStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface LostItem extends BaseItemEntity {
  dateLost: string;
  timeLost?: string;
  contactPreference?: string;
}

export interface FoundItem extends BaseItemEntity {
  dateFound: string;
  timeFound?: string;
}

export interface Claim {
  id: number;
  claimCode: string;
  foundItem: FoundItem;
  claimedBy: User;
  claimDescription: string;
  identifyingDetails: string;
  claimStatus: ClaimStatus;
  reviewedBy?: User;
  adminRemarks?: string;
  submittedAt: string;
  reviewedAt?: string;
  completedAt?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalReported: number;
  lostItemsCount: number;
  foundItemsCount: number;
  pendingClaimsCount: number;
  recoveredItemsCount: number;
}

export interface AdminDashboardData {
  totalStudents: number;
  totalLostItems: number;
  totalFoundItems: number;
  pendingVerification: number;
  pendingClaims: number;
  approvedClaims: number;
  recoveredItems: number;
  activeReports: number;
  categoryDistribution: { category: string; count: number }[];
  monthlyTrends: { month: string; lost: number; found: number; recovered: number }[];
  claimStatusDistribution: { status: string; count: number }[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

