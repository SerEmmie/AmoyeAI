import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  COMMUNITY_CATEGORIES,
  type CommunityCategory,
  type CommunitySubmissionContact,
  type CommunityUpdate,
  type ContactInquiry,
  type InquiryStatus,
  type InquiryType,
  type UpdateStatus,
} from '../types/civic';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  BLUEPRINT_BOUNDS,
  BLUEPRINT_PATTERNS,
  isValidCategory,
  isValidInquiryType,
  sanitizePlainText,
} from './validation';

const UPDATES_COLLECTION = 'community_updates';
const CONTACTS_COLLECTION = 'community_submission_contacts';
const INQUIRIES_COLLECTION = 'contact_inquiries';
const ADMINS_COLLECTION = 'admins';
const BOOTSTRAPPED_ADMIN_EMAIL = 'EmmybikeCEO@gmail.com';

function toMillis(ts: CommunityUpdate['created_at']): number {
  if (!ts) return 0;
  return typeof ts.toMillis === 'function' ? ts.toMillis() : 0;
}

function mapUpdateDoc(id: string, data: Record<string, unknown>): CommunityUpdate {
  const category =
    typeof data.category === 'string' && isValidCategory(data.category)
      ? data.category
      : COMMUNITY_CATEGORIES[0];

  const status: UpdateStatus =
    data.status === 'approved' ||
    data.status === 'rejected' ||
    data.status === 'unpublished'
      ? data.status
      : 'pending';

  return {
    id,
    title: typeof data.title === 'string' ? data.title : '',
    description: typeof data.description === 'string' ? data.description : '',
    category,
    location: typeof data.location === 'string' ? data.location : '',
    contributor_name:
      typeof data.contributor_name === 'string' ? data.contributor_name : 'Anonymous Citizen',
    attribution_consent: Boolean(data.attribution_consent),
    image_url: typeof data.image_url === 'string' ? data.image_url : '',
    status,
    created_at: (data.created_at as CommunityUpdate['created_at']) ?? null,
    updated_at: (data.updated_at as CommunityUpdate['updated_at']) ?? null,
    published_at: (data.published_at as CommunityUpdate['published_at']) ?? null,
    reviewed_by: typeof data.reviewed_by === 'string' ? data.reviewed_by : null,
    moderation_note: typeof data.moderation_note === 'string' ? data.moderation_note : null,
  };
}

export async function fetchApprovedUpdates(): Promise<CommunityUpdate[]> {
  try {
    const q = query(
      collection(db, UPDATES_COLLECTION),
      where('status', '==', 'approved')
    );
    const snap = await getDocs(q);
    return snap.docs
      .map((d) => mapUpdateDoc(d.id, d.data() as Record<string, unknown>))
      .sort((a, b) => toMillis(b.published_at ?? b.created_at) - toMillis(a.published_at ?? a.created_at));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, UPDATES_COLLECTION);
  }
}

export function subscribeApprovedUpdates(
  onData: (updates: CommunityUpdate[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, UPDATES_COLLECTION),
    where('status', '==', 'approved')
  );
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs
        .map((d) => mapUpdateDoc(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => toMillis(b.published_at ?? b.created_at) - toMillis(a.published_at ?? a.created_at));
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, UPDATES_COLLECTION);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export interface SubmitCommunityUpdateInput {
  contributorName: string;
  contributorContact: string;
  attributionConsent: boolean;
  location: string;
  category: CommunityCategory;
  title: string;
  description: string;
  imageUrl: string;
  moderationConsent: boolean;
}

export async function submitCommunityUpdate(input: SubmitCommunityUpdateInput): Promise<string> {
  const realName = sanitizePlainText(input.contributorName).slice(0, BLUEPRINT_BOUNDS.contributor_name.max);
  const contact = sanitizePlainText(input.contributorContact).slice(0, BLUEPRINT_BOUNDS.contributor_contact.max);
  const location = sanitizePlainText(input.location).slice(0, BLUEPRINT_BOUNDS.location.max);
  const title = sanitizePlainText(input.title).slice(0, BLUEPRINT_BOUNDS.title.max);
  const description = sanitizePlainText(input.description).slice(0, BLUEPRINT_BOUNDS.description.max);
  const imageUrl = input.imageUrl.trim();

  if (realName.length < BLUEPRINT_BOUNDS.contributor_name.min) {
    throw new Error('Please enter your name (at least 2 characters).');
  }
  if (contact.length < BLUEPRINT_BOUNDS.contributor_contact.min) {
    throw new Error('Please enter a valid email address or phone number.');
  }
  if (location.length < BLUEPRINT_BOUNDS.location.min) {
    throw new Error('Please select or enter a Local Government Area or community.');
  }
  if (!isValidCategory(input.category)) {
    throw new Error('Please select a valid update category.');
  }
  if (title.length < BLUEPRINT_BOUNDS.title.min) {
    throw new Error('Headline must be at least 5 characters long.');
  }
  if (description.length < BLUEPRINT_BOUNDS.description.min) {
    throw new Error('Please provide a more detailed description (at least 20 characters).');
  }
  if (imageUrl.length > BLUEPRINT_BOUNDS.image_url.maxChars || !BLUEPRINT_PATTERNS.imageUrl.test(imageUrl)) {
    throw new Error('Attached image failed validation.');
  }
  if (!input.moderationConsent) {
    throw new Error('You must consent to moderation review before submitting.');
  }

  const updateRef = doc(collection(db, UPDATES_COLLECTION));
  const contactRef = doc(db, CONTACTS_COLLECTION, updateRef.id);

  const publicContributorName = input.attributionConsent ? realName : 'Anonymous Citizen';

  const batch = writeBatch(db);
  batch.set(updateRef, {
    title,
    description,
    category: input.category,
    location,
    contributor_name: publicContributorName,
    attribution_consent: Boolean(input.attributionConsent),
    image_url: imageUrl,
    status: 'pending',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    published_at: null,
    reviewed_by: null,
    moderation_note: null,
  });

  batch.set(contactRef, {
    update_id: updateRef.id,
    contributor_name: realName,
    contributor_contact: contact,
    consent_given: true,
    created_at: serverTimestamp(),
  });

  try {
    await batch.commit();
    return updateRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${UPDATES_COLLECTION}/${updateRef.id}`);
  }
}

export interface SubmitContactInquiryInput {
  name: string;
  email: string;
  inquiryType: InquiryType;
  subject: string;
  message: string;
}

export async function submitContactInquiry(input: SubmitContactInquiryInput): Promise<string> {
  const name = sanitizePlainText(input.name).slice(0, BLUEPRINT_BOUNDS.inquiry_name.max);
  const email = sanitizePlainText(input.email).slice(0, BLUEPRINT_BOUNDS.inquiry_email.max);
  const subject = sanitizePlainText(input.subject).slice(0, BLUEPRINT_BOUNDS.inquiry_subject.max);
  const message = sanitizePlainText(input.message).slice(0, BLUEPRINT_BOUNDS.inquiry_message.max);

  if (name.length < BLUEPRINT_BOUNDS.inquiry_name.min) {
    throw new Error('Please enter your name (at least 2 characters).');
  }
  if (!BLUEPRINT_PATTERNS.email.test(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!isValidInquiryType(input.inquiryType)) {
    throw new Error('Please choose a valid enquiry type.');
  }
  if (subject.length < BLUEPRINT_BOUNDS.inquiry_subject.min) {
    throw new Error('Please enter a subject (at least 3 characters).');
  }
  if (message.length < BLUEPRINT_BOUNDS.inquiry_message.min) {
    throw new Error('Please enter a message of at least 15 characters.');
  }

  const inquiryRef = doc(collection(db, INQUIRIES_COLLECTION));
  try {
    await setDoc(inquiryRef, {
      name,
      email,
      inquiry_type: input.inquiryType,
      subject,
      message,
      status: 'new',
      created_at: serverTimestamp(),
    });
    return inquiryRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${INQUIRIES_COLLECTION}/${inquiryRef.id}`);
  }
}

// --- Admin Services ---

export async function checkIsAdmin(uid: string, email: string | null, emailVerified: boolean): Promise<boolean> {
  if (!emailVerified) return false;
  if (email === BOOTSTRAPPED_ADMIN_EMAIL) return true;
  try {
    const adminSnap = await getDoc(doc(db, ADMINS_COLLECTION, uid));
    return adminSnap.exists();
  } catch {
    return false;
  }
}

export function subscribeAllUpdatesForAdmin(
  onData: (updates: CommunityUpdate[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, UPDATES_COLLECTION),
    (snap) => {
      const list = snap.docs
        .map((d) => mapUpdateDoc(d.id, d.data() as Record<string, unknown>))
        .sort((a, b) => toMillis(b.created_at) - toMillis(a.created_at));
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, UPDATES_COLLECTION);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function fetchSubmissionContactForAdmin(
  updateId: string
): Promise<CommunitySubmissionContact | null> {
  const path = `${CONTACTS_COLLECTION}/${updateId}`;
  try {
    const snap = await getDoc(doc(db, CONTACTS_COLLECTION, updateId));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    return {
      update_id: typeof data.update_id === 'string' ? data.update_id : updateId,
      contributor_name: typeof data.contributor_name === 'string' ? data.contributor_name : '',
      contributor_contact: typeof data.contributor_contact === 'string' ? data.contributor_contact : '',
      consent_given: Boolean(data.consent_given),
      created_at: (data.created_at as CommunitySubmissionContact['created_at']) ?? null,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function moderateUpdateStatus(
  updateId: string,
  nextStatus: UpdateStatus,
  reviewerIdentifier: string,
  moderationNote?: string
): Promise<void> {
  const path = `${UPDATES_COLLECTION}/${updateId}`;
  const note = moderationNote ? sanitizePlainText(moderationNote).slice(0, BLUEPRINT_BOUNDS.moderation_note.max) : null;
  try {
    await updateDoc(doc(db, UPDATES_COLLECTION, updateId), {
      status: nextStatus,
      reviewed_by: reviewerIdentifier.slice(0, 128),
      updated_at: serverTimestamp(),
      ...(nextStatus === 'approved' ? { published_at: serverTimestamp() } : {}),
      ...(note !== null ? { moderation_note: note } : {}),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export interface EditCommunityUpdateInput {
  title: string;
  description: string;
  category: CommunityCategory;
  location: string;
  contributor_name: string;
  moderation_note: string;
}

export async function editCommunityUpdate(
  updateId: string,
  input: EditCommunityUpdateInput,
  reviewerIdentifier: string
): Promise<void> {
  const path = `${UPDATES_COLLECTION}/${updateId}`;
  const title = sanitizePlainText(input.title).slice(0, BLUEPRINT_BOUNDS.title.max);
  const description = sanitizePlainText(input.description).slice(0, BLUEPRINT_BOUNDS.description.max);
  const location = sanitizePlainText(input.location).slice(0, BLUEPRINT_BOUNDS.location.max);
  const contributorName = sanitizePlainText(input.contributor_name).slice(0, BLUEPRINT_BOUNDS.contributor_name.max);
  const moderationNote = sanitizePlainText(input.moderation_note).slice(0, BLUEPRINT_BOUNDS.moderation_note.max);

  if (title.length < BLUEPRINT_BOUNDS.title.min) {
    throw new Error('Headline must be at least 5 characters.');
  }
  if (description.length < BLUEPRINT_BOUNDS.description.min) {
    throw new Error('Description must be at least 20 characters.');
  }
  if (!isValidCategory(input.category)) {
    throw new Error('Invalid category.');
  }

  try {
    await updateDoc(doc(db, UPDATES_COLLECTION, updateId), {
      title,
      description,
      category: input.category,
      location,
      contributor_name: contributorName,
      moderation_note: moderationNote || null,
      reviewed_by: reviewerIdentifier.slice(0, 128),
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteCommunityUpdate(updateId: string): Promise<void> {
  const batch = writeBatch(db);
  batch.delete(doc(db, UPDATES_COLLECTION, updateId));
  batch.delete(doc(db, CONTACTS_COLLECTION, updateId));
  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${UPDATES_COLLECTION}/${updateId}`);
  }
}

export function subscribeContactInquiriesForAdmin(
  onData: (inquiries: ContactInquiry[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, INQUIRIES_COLLECTION),
    (snap) => {
      const list: ContactInquiry[] = snap.docs
        .map((d) => {
          const data = d.data() as Record<string, unknown>;
          const status: InquiryStatus =
            data.status === 'reviewed' || data.status === 'resolved' ? data.status : 'new';
          return {
            id: d.id,
            name: typeof data.name === 'string' ? data.name : '',
            email: typeof data.email === 'string' ? data.email : '',
            inquiry_type:
              typeof data.inquiry_type === 'string' && isValidInquiryType(data.inquiry_type)
                ? data.inquiry_type
                : 'General enquiries',
            subject: typeof data.subject === 'string' ? data.subject : '',
            message: typeof data.message === 'string' ? data.message : '',
            status,
            created_at: (data.created_at as ContactInquiry['created_at']) ?? null,
          };
        })
        .sort((a, b) => toMillis(b.created_at) - toMillis(a.created_at));
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, INQUIRIES_COLLECTION);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: InquiryStatus
): Promise<void> {
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    await updateDoc(doc(db, INQUIRIES_COLLECTION, inquiryId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
