import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunityUpdateCard } from '../components/CommunityUpdateCard';
import { UpdateDetailModal } from '../components/UpdateDetailModal';
import { WHATSAPP_CONFIG } from '../config/whatsapp';
import { usePageMeta } from '../hooks/usePageMeta';
import { subscribeApprovedUpdates } from '../lib/communityService';
import type { CommunityUpdate } from '../types/civic';

const CAPABILITIES = [
  {
    number: '01.',
    title: 'Ask Questions',
    description:
      'Get clear information about local government leadership, public budgets, administration, and civic governance in Osun State.',
    actionLabel: 'Ask a governance question',
    href: WHATSAPP_CONFIG.getUrl('localGovernment'),
    external: true,
  },
  {
    number: '02.',
    title: 'Stay Informed',
    description:
      'Discover verified updates, public-interest notices, and developments happening across communities and local government areas.',
    actionLabel: 'Browse community updates',
    href: '/community',
    external: false,
  },
  {
    number: '03.',
    title: 'Make Your Voice Heard',
    description:
      'Share local developments, submit community reports for moderation, and participate constructively in civic conversations.',
    actionLabel: 'Share a community update',
    href: '/community',
    external: false,
  },
] as const;

const STEPS = [
  {
    step: '01',
    title: 'Connect with Amoye on WhatsApp',
    description:
      'Open a direct WhatsApp chat with Amoye AI using our official number—no new apps to download or accounts to register.',
  },
  {
    step: '02',
    title: 'Ask questions or explore community updates',
    description:
      'Ask about local government administration and budgets on WhatsApp, or browse moderated citizen updates on the Community hub.',
  },
  {
    step: '03',
    title: 'Stay informed and participate',
    description:
      'Follow developments in your area, share verified local updates for review, and contribute to open local governance.',
  },
] as const;

export function HomePage() {
  usePageMeta({
    title: 'Amoye AI – Local Governance & Community Voice in Osun State',
    description:
      'Meet Amoye AI (#OsunOpenLG): ask local government questions on WhatsApp, explore moderated community updates, and make your voice heard across Osun State.',
  });

  const [approvedUpdates, setApprovedUpdates] = useState<CommunityUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<CommunityUpdate | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeApprovedUpdates(
      (updates) => {
        setApprovedUpdates(updates.slice(0, 3));
        setLoadingUpdates(false);
      },
      () => {
        setLoadingUpdates(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#291044] text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle at 75% 30%, rgba(214, 106, 185, 0.28), transparent 48%), radial-gradient(circle at 15% 80%, rgba(112, 42, 145, 0.45), transparent 52%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F5A623]">
                #OsunOpenLG · Civic Technology for Osun State
              </p>

              <h1
                className="mt-4 font-extrabold tracking-tight leading-[1.06] text-white text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.85rem)' }}
              >
                YOUR COMMUNITY.
                <br />
                YOUR GOVERNMENT.
                <br />
                YOUR VOICE.
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#E7DEF2] max-w-xl">
                Meet Amoye AI, your gateway to understanding local government, staying informed about your community and making your voice heard in Osun State.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={WHATSAPP_CONFIG.getUrl('general')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-[#291044] bg-[#F5A623] hover:bg-[#E09416] rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Chat with Amoye on WhatsApp</span>
                </a>

                <Link
                  to="/community"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-semibold text-white border border-white/30 hover:bg-white/10 rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Explore the Community</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#1D0B31] shadow-2xl max-w-md mx-auto lg:max-w-none">
                <img
                  src={`${import.meta.env.BASE_URL}assets/aistudio/image_05ce9a2b.png`}
                  alt="Amoye AI Chatbot official civic technology artwork featuring #OsunOpenLG"
                  className="w-full aspect-square object-cover"
                />
                <figcaption className="px-4 py-3 bg-[#1D0B31]/95 border-t border-white/10 flex items-center justify-between text-xs text-[#D8CBE8]">
                  <span>Amoye AI · #OsunOpenLG</span>
                  <span>WhatsApp: {WHATSAPP_CONFIG.displayNumber}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* What is Amoye? */}
      <section className="bg-white border-b border-[#291044]/10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
                What Is Amoye?
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#291044] leading-tight text-balance">
                Closing the gap between local councils and citizens
              </h2>
            </div>

            <div className="lg:col-span-8 max-w-2xl">
              <p className="text-base sm:text-lg leading-relaxed text-[#382A49]">
                Amoye AI makes local government information easier to access through WhatsApp while creating opportunities for citizens to participate in conversations about governance and community development.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[#57486B]">
                Built for everyday residents across Osun State, the initiative combines accessible WhatsApp messaging with a moderated community hub so public information is easier to find, verify, and discuss.
              </p>
              <div className="mt-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#702A91] hover:text-[#291044] transition-colors"
                >
                  <span>Read more about the initiative</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Can You Do With Amoye? */}
      <section className="py-16 lg:py-20 bg-[#F5F2F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
              What You Can Do
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#291044] text-balance">
              Practical civic tools built for everyday access
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.number}
                className="bg-white border border-[#291044]/12 rounded-xl p-7 flex flex-col justify-between"
              >
                <div>
                  <span className="text-sm font-mono font-medium text-[#702A91]">
                    {cap.number}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-[#291044]">
                    {cap.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4B3D5C]">
                    {cap.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#291044]/8">
                  {cap.external ? (
                    <a
                      href={cap.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#702A91] hover:text-[#291044] transition-colors"
                    >
                      <span>{cap.actionLabel}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      to={cap.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#702A91] hover:text-[#291044] transition-colors"
                    >
                      <span>{cap.actionLabel}</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-[#291044]/10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
                How It Works
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#291044] text-balance">
                Three simple steps to engage
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#702A91] hover:text-[#291044] transition-colors shrink-0"
            >
              <span>See sample questions &amp; walkthrough</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((item) => (
              <div key={item.step} className="pt-5 border-t-2 border-[#702A91]">
                <p className="text-xs font-mono font-medium text-[#702A91]">
                  Step {item.step}
                </p>
                <h3 className="mt-2 text-lg font-bold text-[#291044]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#4B3D5C]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="py-16 lg:py-20 bg-[#F5F2F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
                Amoye Community Hub
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#291044] tracking-tight text-balance">
                YOUR COMMUNITY HAS A VOICE. LET IT BE HEARD.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[#4B3D5C]">
                Amoye provides an opportunity for citizens to share relevant community information, highlight local developments, and stay connected with what is happening around them across Osun State.
              </p>
            </div>

            <Link
              to="/community"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore Community</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10">
            {loadingUpdates ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((slot) => (
                  <div
                    key={slot}
                    className="h-56 rounded-xl bg-white border border-[#291044]/10 p-6 animate-pulse"
                  />
                ))}
              </div>
            ) : approvedUpdates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvedUpdates.map((update) => (
                  <CommunityUpdateCard
                    key={update.id}
                    update={update}
                    onSelect={setSelectedUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#291044]/12 rounded-xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#702A91]">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>Moderated Public Feed</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-[#291044]">
                    Approved community updates appear here
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4B3D5C]">
                    No approved updates have been published yet. Citizens across Osun State can submit local updates, announcements, or civic reports for moderation review.
                  </p>
                </div>
                <Link
                  to="/community"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#702A91] border border-[#702A91]/30 hover:bg-[#F5F2F8] rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Visit Community Hub</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Institutional Credibility */}
      <section className="bg-white border-t border-[#291044]/10 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
              Institutional Support &amp; Partnership
            </p>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[#291044]">
              Backed by youth civic leadership in Nigeria
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#291044]/12 border border-[#291044]/12 rounded-xl overflow-hidden">
            <div className="bg-white p-6">
              <p className="text-xs font-medium text-[#6B5A7E]">Developed by</p>
              <p className="mt-1.5 text-base font-bold text-[#291044]">Insight Initiative</p>
            </div>
            <div className="bg-white p-6">
              <p className="text-xs font-medium text-[#6B5A7E]">Supported by</p>
              <p className="mt-1.5 text-base font-bold text-[#291044]">
                Nigerian Youth Futures Fund (NYFF)
              </p>
            </div>
            <div className="bg-white p-6">
              <p className="text-xs font-medium text-[#6B5A7E]">Through</p>
              <p className="mt-1.5 text-base font-bold text-[#291044]">LEAP Africa</p>
            </div>
            <div className="bg-white p-6">
              <p className="text-xs font-medium text-[#6B5A7E]">Civic Initiative</p>
              <p className="mt-1.5 text-base font-bold text-[#702A91]">#OsunOpenLG</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#291044] text-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#A8BCEB]">
            Your Community Matters · Your Questions Matter · Your Voice Matters
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-balance">
            BETTER INFORMED. MORE CONNECTED. MORE ENGAGED.
          </h2>
          <p className="mt-4 text-base text-[#E2D8EE] max-w-xl mx-auto">
            Start a conversation with Amoye AI on WhatsApp or contribute a verified update from your community in Osun State.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_CONFIG.getUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-bold text-[#291044] bg-[#F5A623] hover:bg-[#E09416] rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Start Chatting with Amoye</span>
            </a>
          </div>
        </div>
      </section>

      <UpdateDetailModal
        update={selectedUpdate}
        onClose={() => setSelectedUpdate(null)}
      />
    </div>
  );
}
