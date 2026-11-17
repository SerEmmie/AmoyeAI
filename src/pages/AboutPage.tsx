import { ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WHATSAPP_CONFIG } from '../config/whatsapp';
import { usePageMeta } from '../hooks/usePageMeta';

export function AboutPage() {
  usePageMeta({
    title: 'About Amoye AI – #OsunOpenLG & Insight Initiative',
    description:
      'Learn how Amoye AI bridges the local government information gap in Osun State through WhatsApp, #OsunOpenLG, Insight Initiative, NYFF, and LEAP Africa.',
  });

  return (
    <div className="bg-white">
      {/* Editorial Header */}
      <section className="bg-[#291044] text-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F5A623]">
              About the Initiative · #OsunOpenLG
            </p>
            <h1
              className="mt-3 font-extrabold tracking-tight leading-tight text-white text-balance"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.25rem)' }}
            >
              Making local governance understandable and accessible to every citizen
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#E2D8EE]">
              Amoye AI is a civic technology and citizen engagement initiative built to bridge the information gap between local government councils and citizens across Osun State, Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Storytelling Layout */}
      <section className="py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Narrative Column */}
            <article className="lg:col-span-8 max-w-2xl space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-[#291044]">
                  The information gap at the grassroots
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#382A49]">
                  Local government is the tier of government closest to everyday life—shaping primary healthcare centres, local roads, markets, sanitation, and primary education. Yet for many citizens across Osun State, finding accurate, timely information about local government leadership, council budgets, public projects, and civic responsibilities remains difficult.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#382A49]">
                  Public documents are often fragmented, hard to locate online, or written in dense administrative language. At the same time, citizens rarely have an accessible channel to share verified updates about what is happening in their own communities.
                </p>
              </div>

              <div className="pt-8 border-t border-[#291044]/10">
                <h2 className="text-2xl font-bold text-[#291044]">
                  Our mission and the role of AI &amp; WhatsApp
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#382A49]">
                  Amoye AI meets citizens where they already communicate every day: WhatsApp. Rather than requiring residents to navigate complicated portals or download heavy applications, Amoye uses conversational AI on WhatsApp to answer governance questions in plain, everyday language.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#382A49]">
                  Paired with the Amoye Community hub on the web, citizens can both seek civic answers and contribute moderated local updates—building a shared, trustworthy record of community developments, public-interest reports, and civic activities.
                </p>
              </div>

              <div className="pt-8 border-t border-[#291044]/10">
                <h2 className="text-2xl font-bold text-[#291044]">
                  Connection to #OsunOpenLG
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#382A49]">
                  Amoye AI is anchored in the <strong className="text-[#291044]">#OsunOpenLG</strong> initiative, which advocates for open, transparent, and participatory local governance across Osun State. By lowering the barrier to civic knowledge and encouraging constructive public participation, Amoye supports stronger accountability between councils and the communities they serve.
                </p>
              </div>

              <div className="pt-8 border-t border-[#291044]/10">
                <h2 className="text-2xl font-bold text-[#291044]">
                  Insight Initiative, NYFF, and LEAP Africa
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[#382A49]">
                  Amoye AI is developed by <strong className="text-[#291044]">Insight Initiative</strong>, a civic-focused organisation committed to strengthening democratic participation and public accountability through practical technology and citizen education.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#382A49]">
                  The initiative is supported by the <strong className="text-[#291044]">Nigerian Youth Futures Fund (NYFF)</strong> through <strong className="text-[#291044]">LEAP Africa</strong>, empowering young Nigerians to design and deliver community-centred solutions for transparency and public good.
                </p>
              </div>
            </article>

            {/* Editorial Margin Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-xl bg-[#F5F2F8] border border-[#291044]/12">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
                  Initiative Overview
                </p>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="pb-3 border-b border-[#291044]/10">
                    <dt className="text-xs text-[#6B5A7E]">Product</dt>
                    <dd className="mt-0.5 font-semibold text-[#291044]">Amoye AI</dd>
                  </div>
                  <div className="pb-3 border-b border-[#291044]/10">
                    <dt className="text-xs text-[#6B5A7E]">Civic Campaign</dt>
                    <dd className="mt-0.5 font-semibold text-[#702A91]">#OsunOpenLG</dd>
                  </div>
                  <div className="pb-3 border-b border-[#291044]/10">
                    <dt className="text-xs text-[#6B5A7E]">Developed by</dt>
                    <dd className="mt-0.5 font-semibold text-[#291044]">Insight Initiative</dd>
                  </div>
                  <div className="pb-3 border-b border-[#291044]/10">
                    <dt className="text-xs text-[#6B5A7E]">Supported by</dt>
                    <dd className="mt-0.5 font-semibold text-[#291044]">
                      Nigerian Youth Futures Fund (NYFF) through LEAP Africa
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#6B5A7E]">Primary Channel</dt>
                    <dd className="mt-0.5 font-semibold text-[#291044] tabular-nums">
                      WhatsApp ({WHATSAPP_CONFIG.displayNumber})
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="p-6 rounded-xl bg-[#291044] text-white">
                <h3 className="text-lg font-bold">Start a civic conversation</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#E2D8EE]">
                  Ask Amoye AI about local governance on WhatsApp or explore citizen updates from across Osun State.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href={WHATSAPP_CONFIG.getUrl('general')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-[#291044] bg-[#F5A623] hover:bg-[#E09416] rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <Link
                    to="/community"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white border border-white/25 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <span>Explore Community</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
