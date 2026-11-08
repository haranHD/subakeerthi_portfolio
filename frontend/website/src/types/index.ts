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

export interface EnquiryPayload {
  fullName: string;
  organisation: string;
  email?: string;
  phone?: string;
  category: string;
  areaOfInterest: string;
  preferredLanguage?: string;
  requirements: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: { field: string; message: string }[];
}
