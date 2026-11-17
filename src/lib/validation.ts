import { COMMUNITY_CATEGORIES, INQUIRY_TYPES, type CommunityCategory, type InquiryType } from '../types/civic';

// Synchronized verbatim with firebase-blueprint.json & firestore.rules
export const BLUEPRINT_BOUNDS = {
  title: { min: 5, max: 140 },
  description: { min: 20, max: 2500 },
  location: { min: 2, max: 80 },
  contributor_name: { min: 2, max: 80 },
  contributor_contact: { min: 5, max: 120 },
  image_url: { maxChars: 450000 },
  moderation_note: { max: 500 },
  inquiry_name: { min: 2, max: 80 },
  inquiry_email: { min: 5, max: 120 },
  inquiry_subject: { min: 3, max: 140 },
  inquiry_message: { min: 15, max: 2500 },
} as const;

export const BLUEPRINT_PATTERNS = {
  email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
  imageUrl: /^(|data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+)$/,
  id: /^[a-zA-Z0-9_-]+$/,
} as const;

/**
 * Strips potentially unsafe control characters and HTML angle brackets while preserving readable punctuation.
 */
export function sanitizePlainText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim();
}

export function isValidCategory(value: string): value is CommunityCategory {
  return (COMMUNITY_CATEGORIES as readonly string[]).includes(value);
}

export function isValidInquiryType(value: string): value is InquiryType {
  return (INQUIRY_TYPES as readonly string[]).includes(value);
}

const RATE_LIMIT_KEY = 'amoye_submission_timestamps';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 4;

export function checkClientRateLimit(bucket: 'community' | 'contact'): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  try {
    const raw = window.localStorage.getItem(`${RATE_LIMIT_KEY}_${bucket}`);
    const now = Date.now();
    const timestamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
      const oldest = recent[0];
      const retryAfterSeconds = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000));
      return { allowed: false, retryAfterSeconds };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  } catch {
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

export function recordClientSubmission(bucket: 'community' | 'contact'): void {
  try {
    const raw = window.localStorage.getItem(`${RATE_LIMIT_KEY}_${bucket}`);
    const now = Date.now();
    const timestamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    window.localStorage.setItem(`${RATE_LIMIT_KEY}_${bucket}`, JSON.stringify(recent));
  } catch {
    // Ignore storage unavailability
  }
}

const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_UPLOAD_FILE_BYTES = 5 * 1024 * 1024; // 5MB raw upload limit
const MAX_DATA_URI_LENGTH = BLUEPRINT_BOUNDS.image_url.maxChars;

/**
 * Validates file type & size, then re-encodes via Canvas to strip EXIF metadata
 * and ensure safe JPEG output within Firestore document constraints.
 */
export async function processAndSanitizeImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error('Please upload a JPG, PNG, or WebP image file.');
  }
  if (file.size > MAX_UPLOAD_FILE_BYTES) {
    throw new Error('Image file must be 5 MB or smaller.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Could not read the selected image file.'));
      image.src = objectUrl;
    });

    const maxDimension = 1200;
    let targetWidth = img.naturalWidth || img.width;
    let targetHeight = img.naturalHeight || img.height;

    if (targetWidth <= 0 || targetHeight <= 0) {
      throw new Error('Invalid image dimensions.');
    }

    if (targetWidth > maxDimension || targetHeight > maxDimension) {
      const ratio = Math.min(maxDimension / targetWidth, maxDimension / targetHeight);
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Image processing is not supported in this browser.');
    }
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    let quality = 0.82;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    while (dataUrl.length > MAX_DATA_URI_LENGTH && quality > 0.35) {
      quality -= 0.12;
      dataUrl = canvas.toDataURL('image/jpeg', quality);
    }

    if (dataUrl.length > MAX_DATA_URI_LENGTH) {
      throw new Error('Image remains too large after optimization. Please choose a smaller photo.');
    }

    if (!BLUEPRINT_PATTERNS.imageUrl.test(dataUrl)) {
      throw new Error('Processed image format failed safety validation.');
    }

    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
