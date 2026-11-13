export interface User {
  id: string;
  email: string;
  role: string;
}

export interface DashboardMetrics {
  totalEnquiries: number;
  newEnquiries: number;
  pendingEnquiries: number;
  respondedEnquiries: number;
  totalServices: number;
  totalProgrammes: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentEnquiries: Enquiry[];
  recentLogs: AuditLog[];
}

export interface Profile {
  id: string;
  fullName: string;
  headline: string;
  biography: string;
  location: string;
  phone: string;
  email: string;
  portraitUrl?: string;
  heroPills?: string[];
  values?: { title: string; description: string }[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  tag: string;
  category: string;
  description: string;
  audience: string;
  icon: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface Programme {
  id: string;
  title: string;
  slug: string;
  category: string;
  intendedAudience: string;
  purpose: string;
  description: string;
  highlights: string[];
  duration?: string;
  bannerUrl?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface Credential {
  id: string;
  credentialType: 'EDUCATION' | 'ACCREDITATION';
  institution: string;
  qualification: string;
  period: string;
  status: string;
  details: string;
  issuingBody?: string;
  statutoryDomain?: string;
  certificateUrl?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface AudienceGroup {
  id: string;
  title: string;
  badge: string;
  icon: string;
  description: string;
  actionText: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface Enquiry {
  id: string;
  fullName: string;
  organisation: string;
  email?: string;
  phone?: string;
  category: string;
  areaOfInterest: string;
  requirements: string;
  status: 'NEW' | 'PENDING' | 'RESPONDED' | 'ARCHIVED';
  ipHash?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  originalName: string;
  title?: string | null;
  description?: string | null;
  location?: string | null;
  eventDate?: string | null;
  mimeType: string;
  size: number;
  storageUrl: string;
  assetType: string;
  createdAt: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  adminUserId?: string;
  adminUser?: { email: string; role?: string };
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}
