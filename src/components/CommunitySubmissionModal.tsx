import { CheckCircle2, ImagePlus, Loader2, ShieldCheck, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { OSUN_LGAS } from '../config/osunLgas';
import { submitCommunityUpdate } from '../lib/communityService';
import {
  BLUEPRINT_BOUNDS,
  checkClientRateLimit,
  processAndSanitizeImage,
  recordClientSubmission,
} from '../lib/validation';
import { COMMUNITY_CATEGORIES, type CommunityCategory } from '../types/civic';

interface CommunitySubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunitySubmissionModal({ isOpen, onClose }: CommunitySubmissionModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [attributionConsent, setAttributionConsent] = useState(true);
  const [lga, setLga] = useState('');
  const [communityDetail, setCommunityDetail] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('Community Updates');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');
  const [moderationConsent, setModerationConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [imageProcessing, setImageProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setContact('');
    setAttributionConsent(true);
    setLga('');
    setCommunityDetail('');
    setCategory('Community Updates');
    setTitle('');
    setDescription('');
    setImageUrl('');
    setImageName('');
    setModerationConsent(false);
    setHoneypot('');
    setErrorMessage(null);
    setSubmittedSuccess(false);
  };

  const handleClose = () => {
    if (submittedSuccess) {
      resetForm();
    }
    onClose();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    setImageProcessing(true);
    try {
      const processed = await processAndSanitizeImage(file);
      setImageUrl(processed);
      setImageName(file.name);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unable to attach image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setImageProcessing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Honeypot anti-spam trap
    if (honeypot.trim() !== '') {
      setErrorMessage('Submission could not be processed.');
      return;
    }

    const rateCheck = checkClientRateLimit('community');
    if (!rateCheck.allowed) {
      setErrorMessage(
        `Please wait about ${Math.ceil(rateCheck.retryAfterSeconds / 60)} minute(s) before submitting another update.`
      );
      return;
    }

    const combinedLocation = communityDetail.trim()
      ? `${communityDetail.trim()}, ${lga}`.slice(0, BLUEPRINT_BOUNDS.location.max)
      : lga;

    if (!lga) {
      setErrorMessage('Please select the Local Government Area in Osun State.');
      return;
    }

    setSubmitting(true);
    try {
      await submitCommunityUpdate({
        contributorName: name,
        contributorContact: contact,
        attributionConsent,
        location: combinedLocation,
        category,
        title,
        description,
        imageUrl,
        moderationConsent,
      });
      recordClientSubmission('community');
      setSubmittedSuccess(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'We could not submit your update right now. Please check your entries and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#291044]/65 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#291044]/15 shadow-2xl my-8 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#291044]/10 flex items-center justify-between gap-4 bg-[#F5F2F8]/60">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
              Citizen Contribution
            </p>
            <h2 id="submission-modal-title" className="text-xl font-bold text-[#291044]">
              Share a Community Update
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close submission form"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[#4B3D5C] hover:bg-[#291044]/8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#702A91]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#702A91]/10 text-[#702A91] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#291044]">Submission Received</h3>
            <p className="mt-3 text-base leading-relaxed text-[#4B3D5C] max-w-lg mx-auto">
              Thank you for contributing to your community. Your update has been received and will be reviewed before publication.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 text-sm font-semibold text-[#702A91] border border-[#702A91]/30 hover:bg-[#F5F2F8] rounded-lg transition-colors"
              >
                Submit Another Update
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] rounded-lg transition-colors"
              >
                Return to Community Feed
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <div className="p-4 rounded-xl bg-[#F5F2F8] border border-[#291044]/10 flex items-start gap-3 text-xs leading-relaxed text-[#4B3D5C]">
              <ShieldCheck className="w-4 h-4 text-[#702A91] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#291044]">Moderation &amp; Privacy Notice</p>
                <p className="mt-0.5">
                  All citizen submissions are reviewed by the Amoye AI moderation team before publication. Your email or phone number is kept strictly private and is never published publicly.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#DC2626]/30 text-sm text-[#991B1B]"
              >
                {errorMessage}
              </div>
            )}

            {/* Honeypot anti-spam trap */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="website_url">Website</label>
              <input
                id="website_url"
                name="website_url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sub-name" className="block text-sm font-semibold text-[#291044] mb-1.5">
                  Your Name <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="sub-name"
                  type="text"
                  required
                  minLength={BLUEPRINT_BOUNDS.contributor_name.min}
                  maxLength={BLUEPRINT_BOUNDS.contributor_name.max}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Adebayo Ogunleye"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                />
              </div>

              <div>
                <label htmlFor="sub-contact" className="block text-sm font-semibold text-[#291044] mb-1.5">
                  Email or Phone Number <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="sub-contact"
                  type="text"
                  required
                  minLength={BLUEPRINT_BOUNDS.contributor_contact.min}
                  maxLength={BLUEPRINT_BOUNDS.contributor_contact.max}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Kept private (for verification only)"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#4B3D5C] cursor-pointer">
              <input
                type="checkbox"
                checked={attributionConsent}
                onChange={(e) => setAttributionConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#702A91] rounded"
              />
              <span>
                Display my name publicly alongside this update if approved (uncheck to publish as <strong className="text-[#291044]">Anonymous Citizen</strong>).
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sub-lga" className="block text-sm font-semibold text-[#291044] mb-1.5">
                  Local Government Area <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  id="sub-lga"
                  required
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                >
                  <option value="">Select Osun State LGA</option>
                  {OSUN_LGAS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sub-category" className="block text-sm font-semibold text-[#291044] mb-1.5">
                  Update Category <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  id="sub-category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                >
                  {COMMUNITY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="sub-community" className="block text-sm font-semibold text-[#291044] mb-1.5">
                Town, Ward, or Specific Location <span className="text-xs font-normal text-[#6B5A7E]">(optional)</span>
              </label>
              <input
                id="sub-community"
                type="text"
                maxLength={40}
                value={communityDetail}
                onChange={(e) => setCommunityDetail(e.target.value)}
                placeholder="e.g. Oke-Fia, Modakeke, Ikirun Market"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
              />
            </div>

            <div>
              <label htmlFor="sub-title" className="block text-sm font-semibold text-[#291044] mb-1.5">
                Headline <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="sub-title"
                type="text"
                required
                minLength={BLUEPRINT_BOUNDS.title.min}
                maxLength={BLUEPRINT_BOUNDS.title.max}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Clear, factual summary of the update"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="sub-desc" className="block text-sm font-semibold text-[#291044]">
                  Description of the Update <span className="text-[#B91C1C]">*</span>
                </label>
                <span className="text-xs text-[#6B5A7E] tabular-nums">
                  {description.length}/{BLUEPRINT_BOUNDS.description.max}
                </span>
              </div>
              <textarea
                id="sub-desc"
                required
                rows={4}
                minLength={BLUEPRINT_BOUNDS.description.min}
                maxLength={BLUEPRINT_BOUNDS.description.max}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share clear details: what happened, where in the community it affects, dates or context, and why it matters."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
              />
            </div>

            {/* Optional Image Upload */}
            <div>
              <span className="block text-sm font-semibold text-[#291044] mb-1.5">
                Optional Image Attachment{' '}
                <span className="text-xs font-normal text-[#6B5A7E]">(JPG, PNG, WebP · max 5 MB)</span>
              </span>

              {!imageUrl ? (
                <label className="flex items-center justify-center gap-2.5 px-4 py-4 border border-dashed border-[#291044]/25 rounded-xl bg-[#F5F2F8]/50 hover:bg-[#F5F2F8] cursor-pointer transition-colors">
                  {imageProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#702A91]" />
                      <span className="text-sm text-[#4B3D5C]">Optimizing image safely...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4 text-[#702A91]" aria-hidden="true" />
                      <span className="text-sm font-medium text-[#291044]">
                        Attach a community photo
                      </span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={imageProcessing}
                    className="sr-only"
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between gap-4 p-3 border border-[#291044]/15 rounded-xl bg-[#F5F2F8]/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={imageUrl}
                      alt="Attached preview"
                      className="w-16 h-12 object-cover rounded-lg border border-[#291044]/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#291044] truncate">
                        {imageName || 'Community photo'}
                      </p>
                      <p className="text-xs text-[#6B5A7E]">Optimized and metadata-stripped</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setImageName('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mandatory Consent */}
            <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-[#291044]/15 bg-[#F5F2F8]/40 text-xs leading-relaxed text-[#291044] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={moderationConsent}
                onChange={(e) => setModerationConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#702A91] rounded"
              />
              <span>
                I confirm that this information is accurate to the best of my knowledge, contains no defamatory or harmful content, and I consent to editorial moderation before publication. <span className="text-[#B91C1C]">*</span>
              </span>
            </label>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-3 border-t border-[#291044]/10">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 text-sm font-semibold text-[#4B3D5C] hover:text-[#291044] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || imageProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] disabled:opacity-60 rounded-lg transition-colors"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{submitting ? 'Submitting...' : 'Submit for Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
