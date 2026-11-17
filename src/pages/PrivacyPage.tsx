import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy – Amoye AI',
    description:
      'Read how Amoye AI handles community update submissions, private contact details, moderation, and citizen privacy across Osun State.',
  });

  return (
    <div className="bg-white py-14 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
          Privacy &amp; Data Protection
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#291044] tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-[#6B5A7E]">
          Effective Date: November 2026 · Amoye AI (#OsunOpenLG) by Insight Initiative
        </p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-[#382A49] border-t border-[#291044]/10 pt-8">
          <section>
            <h2 className="text-xl font-bold text-[#291044]">1. Our Commitment to Citizen Privacy</h2>
            <p className="mt-2.5">
              Amoye AI is a public-interest civic technology platform developed by Insight Initiative and supported by the Nigerian Youth Futures Fund (NYFF) through LEAP Africa. We collect only the minimum information necessary to operate our moderated community hub and respond to user enquiries responsibly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#291044]">2. Information You Provide</h2>
            <ul className="mt-2.5 list-disc pl-5 space-y-2">
              <li>
                <strong>Community Update Submissions:</strong> When you submit a community update, we collect your name, email address or phone number, Local Government Area/location, category, headline, description, and any optional image you choose to attach.
              </li>
              <li>
                <strong>Contact Form Enquiries:</strong> When you contact us for general, technical, media, partnership, or information correction matters, we collect your name, email address, enquiry category, subject, and message.
              </li>
              <li>
                <strong>WhatsApp Conversations:</strong> Interactions with Amoye AI on WhatsApp occur via Meta&rsquo;s WhatsApp platform and are also subject to WhatsApp&rsquo;s privacy policies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#291044]">3. Separation of Public Updates and Private Contact Details</h2>
            <p className="mt-2.5">
              Your email address or phone number submitted on the Community form is stored in a restricted moderation collection accessible only to authorised Amoye AI administrators. It is <strong>never published publicly</strong> on the Community feed or exposed to ordinary visitors.
            </p>
            <p className="mt-2.5">
              Contributors may also choose whether their name is displayed publicly alongside an approved update or published as &ldquo;Anonymous Citizen&rdquo;.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#291044]">4. Moderation Before Publication</h2>
            <p className="mt-2.5">
              Every citizen submission enters a pending review queue. Authorised administrators review submissions for accuracy, relevance, safety, and compliance with community standards before approving them for public display. Uploaded images are automatically resized and stripped of embedded file metadata (EXIF) prior to storage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#291044]">5. Data Retention, Corrections, and Removal Requests</h2>
            <p className="mt-2.5">
              We retain approved community updates and moderation records only as long as needed to support civic transparency and platform integrity. You may request a correction, unpublishing, or deletion of information you submitted at any time via our{' '}
              <Link to="/contact?type=Information+corrections" className="font-semibold text-[#702A91] underline underline-offset-4">
                Contact &amp; Information Corrections form
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
