import { CheckCircle2, Loader2, Mail, MessageCircle } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WHATSAPP_CONFIG } from '../config/whatsapp';
import { usePageMeta } from '../hooks/usePageMeta';
import { submitContactInquiry } from '../lib/communityService';
import {
  BLUEPRINT_BOUNDS,
  checkClientRateLimit,
  isValidInquiryType,
  recordClientSubmission,
} from '../lib/validation';
import { INQUIRY_TYPES, type InquiryType } from '../types/civic';

export function ContactPage() {
  usePageMeta({
    title: 'Contact Amoye AI – Enquiries & Information Corrections',
    description:
      'Contact the Amoye AI team for general enquiries, technical support, media, partnerships, or information corrections.',
  });

  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<InquiryType>('General enquiries');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  useEffect(() => {
    const paramType = searchParams.get('type');
    const paramSubject = searchParams.get('subject');
    if (paramType && isValidInquiryType(paramType)) {
      setInquiryType(paramType);
    }
    if (paramSubject) {
      setSubject(paramSubject.slice(0, BLUEPRINT_BOUNDS.inquiry_subject.max));
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (honeypot.trim() !== '') {
      setErrorMessage('Submission could not be processed.');
      return;
    }

    const rateCheck = checkClientRateLimit('contact');
    if (!rateCheck.allowed) {
      setErrorMessage(
        `Please wait about ${Math.ceil(rateCheck.retryAfterSeconds / 60)} minute(s) before sending another message.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const id = await submitContactInquiry({
        name,
        email,
        inquiryType,
        subject,
        message,
      });
      recordClientSubmission('contact');
      setSubmittedId(id);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'We could not deliver your message right now. Please verify your details and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F2F8] py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
            Get in Touch
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#291044] tracking-tight">
            Contact the Amoye AI team
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#4B3D5C]">
            Use this form for general questions, technical support, media or partnership enquiries, or to submit a correction to published information.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white border border-[#291044]/12 rounded-2xl p-6 sm:p-8">
            {submittedId ? (
              <div className="py-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#702A91]/10 text-[#702A91] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#291044]">
                  Your message has been received
                </h2>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#4B3D5C] max-w-md mx-auto">
                  Thank you for contacting Amoye AI. Your enquiry has been recorded for review by the Insight Initiative team.
                </p>
                <p className="mt-2 text-xs font-mono text-[#6B5A7E]">
                  Reference: {submittedId}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedId(null)}
                  className="mt-6 px-5 py-2.5 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] rounded-lg transition-colors"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#DC2626]/30 text-sm text-[#991B1B]"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="contact_hp">Leave blank</label>
                  <input
                    id="contact_hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-[#291044] mb-1.5">
                      Full Name <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      minLength={BLUEPRINT_BOUNDS.inquiry_name.min}
                      maxLength={BLUEPRINT_BOUNDS.inquiry_name.max}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-[#291044] mb-1.5">
                      Email Address <span className="text-[#B91C1C]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      minLength={BLUEPRINT_BOUNDS.inquiry_email.min}
                      maxLength={BLUEPRINT_BOUNDS.inquiry_email.max}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-type" className="block text-sm font-semibold text-[#291044] mb-1.5">
                    Enquiry Type <span className="text-[#B91C1C]">*</span>
                  </label>
                  <select
                    id="contact-type"
                    required
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                  >
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-[#291044] mb-1.5">
                    Subject <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    minLength={BLUEPRINT_BOUNDS.inquiry_subject.min}
                    maxLength={BLUEPRINT_BOUNDS.inquiry_subject.max}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your enquiry"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-[#291044]">
                      Message <span className="text-[#B91C1C]">*</span>
                    </label>
                    <span className="text-xs text-[#6B5A7E] tabular-nums">
                      {message.length}/{BLUEPRINT_BOUNDS.inquiry_message.max}
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    minLength={BLUEPRINT_BOUNDS.inquiry_message.min}
                    maxLength={BLUEPRINT_BOUNDS.inquiry_message.max}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide clear details so our team can respond accurately."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#291044]/20 rounded-lg focus:outline-none focus:border-[#702A91] focus:ring-2 focus:ring-[#702A91]/15"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] disabled:opacity-60 rounded-lg transition-colors"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Direct Channels Sidebar */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#291044]/12 rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-2.5 text-[#291044]">
                <MessageCircle className="w-5 h-5 text-[#702A91]" aria-hidden="true" />
                <h2 className="text-lg font-bold">Amoye AI on WhatsApp</h2>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-[#4B3D5C]">
                For local government questions, budget summaries, or civic guidance in Osun State, chat directly with Amoye AI on WhatsApp.
              </p>
              <a
                href={WHATSAPP_CONFIG.getUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#291044] bg-[#F5A623] hover:bg-[#E09416] rounded-lg transition-colors"
              >
                <span>Message {WHATSAPP_CONFIG.displayNumber}</span>
              </a>

              {WHATSAPP_CONFIG.communityGroupInviteUrl && (
                <div className="mt-4 pt-4 border-t border-[#291044]/10">
                  <p className="text-xs text-[#6B5A7E]">
                    Looking to join civic discussions with fellow citizens?
                  </p>
                  <a
                    href={WHATSAPP_CONFIG.communityGroupInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-sm font-semibold text-[#702A91] underline underline-offset-4"
                  >
                    Open WhatsApp Community Invite
                  </a>
                </div>
              )}
            </div>

            <div className="bg-white border border-[#291044]/12 rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-2.5 text-[#291044]">
                <Mail className="w-5 h-5 text-[#702A91]" aria-hidden="true" />
                <h2 className="text-lg font-bold">Information Corrections</h2>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-[#4B3D5C]">
                Accuracy matters in civic technology. If you spot an outdated council record or an error in a published community update, select <strong>Information corrections</strong> in the form and include supporting context so our editors can verify and update it.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
