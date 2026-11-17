# Amoye AI Firestore Security Specification

## 1. Data Invariants

1. **Moderation Gate**: Every public submission to `community_updates` MUST enter with `status == 'pending'`, `published_at == null`, and `reviewed_by == null`. Public visitors can NEVER create an update with `status == 'approved'` or modify/delete any update.
2. **Public Read Isolation**: Public visitors can ONLY read (`get` or `list`) documents in `community_updates` where `resource.data.status == 'approved'`. Queries attempting to list `pending`, `rejected`, or `unpublished` items without admin authentication MUST be rejected by Firestore rules.
3. **PII Isolation (Split Collection)**: Sensitive contributor contact information (`contributor_contact`, real name) is stored exclusively in `community_submission_contacts/{updateId}` and is NEVER readable by non-admin visitors.
4. **Atomic Submission Pairing**: Creating `community_submission_contacts/{updateId}` requires `existsAfter(/databases/$(database)/documents/community_updates/$(updateId))` so contact records cannot be orphaned without a matching submission.
5. **Contact Inquiry Privacy**: `contact_inquiries` allows public `create` with `status == 'new'` and strictly restricts `read`, `update`, and `delete` to verified administrators.
6. **Verified Admin Authentication**: Admin privileges require `request.auth != null`, `request.auth.token.email_verified == true`, and either presence in `/admins/$(request.auth.uid)` or matching the bootstrapped verified admin email.
7. **Temporal Integrity & Strict Allowlists**: All `created_at` and `updated_at` fields must equal `request.time`; `created_at` is immutable after creation; shadow/ghost fields are rejected via `keys().hasOnly(...)` and `affectedKeys().hasOnly(...)`.

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Self-Approval Bypass**: Unauthenticated create on `community_updates` with `status: "approved"`. Expected: `PERMISSION_DENIED`.
2. **Unapproved List Scrape**: Unauthenticated `list` on `community_updates` without `where("status", "==", "approved")`. Expected: `PERMISSION_DENIED`.
3. **Pending Document Peek**: Unauthenticated `get` on `community_updates/{pendingId}` where `status == "pending"`. Expected: `PERMISSION_DENIED`.
4. **PII Leak Attempt**: Unauthenticated or non-admin `get`/`list` on `community_submission_contacts` or `contact_inquiries`. Expected: `PERMISSION_DENIED`.
5. **Shadow / Ghost Field Injection**: Public create on `community_updates` injecting `isVerified: true` or `admin_override: true`. Expected: `PERMISSION_DENIED`.
6. **Public Update Tampering**: Unauthenticated or non-admin `update` or `delete` on `community_updates/{id}`. Expected: `PERMISSION_DENIED`.
7. **Unverified Admin Email Spoof**: Signed-in user with matching email but `email_verified: false` attempting admin `list` or `update`. Expected: `PERMISSION_DENIED`.
8. **ID Poisoning**: Document creation with oversized (>128 chars) or invalid-character document ID (`../admin`). Expected: `PERMISSION_DENIED`.
9. **Resource Exhaustion / Payload Oversize**: `description` > 2500 chars or `image_url` > 450000 chars or invalid SVG/HTML `data:image/svg+xml` payload. Expected: `PERMISSION_DENIED`.
10. **Client Timestamp Forgery**: Create on `community_updates` with backdated `created_at` instead of `request.time`. Expected: `PERMISSION_DENIED`.
11. **Privilege Escalation**: Non-admin user attempting to write their own UID to `/admins/{uid}`. Expected: `PERMISSION_DENIED`.
12. **Orphaned Contact Record**: Creating `community_submission_contacts/{id}` without atomically creating `community_updates/{id}` in the same batch. Expected: `PERMISSION_DENIED`.
