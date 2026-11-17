import type { Timestamp } from 'firebase/firestore';

export const COMMUNITY_CATEGORIES = [
  'Community Updates',
  'Infrastructure',
  'Education',
  'Health',
  'Environment',
  'Governance',
  'Events',
  'Other',
] as const;

export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number];

export type UpdateStatus = 'pending' | 'approved' | 'rejected' | 'unpublished';

export const INQUIRY_TYPES = [
  'General enquiries',
  'Technical support',
  'Media enquiries',
  'Partnership enquiries',
  'Information corrections',
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export type InquiryStatus = 'new' | 'reviewed' | 'resolved';

export interface CommunityUpdate {
  id: string;
  title: string;
  description: string;
  category: CommunityCategory;
  location: string;
  contributor_name: string;
  attribution_consent: boolean;
  image_url: string;
  status: UpdateStatus;
  created_at: Timestamp | null;
  updated_at: Timestamp | null;
  published_at: Timestamp | null;
  reviewed_by: string | null;
  moderation_note: string | null;
}

export interface CommunitySubmissionContact {
  update_id: string;
  contributor_name: string;
  contributor_contact: string;
  consent_given: boolean;
  created_at: Timestamp | null;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  inquiry_type: InquiryType;
  subject: string;
  message: string;
  status: InquiryStatus;
  created_at: Timestamp | null;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin';
}
