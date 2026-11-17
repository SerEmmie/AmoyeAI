import { AlertCircle, ArrowUpRight, BookOpen, ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WHATSAPP_CONFIG, type WhatsAppIntent } from '../config/whatsapp';
import { usePageMeta } from '../hooks/usePageMeta';

const SAMPLE_PROMPTS: {
  intent: WhatsAppIntent;
  label: string;
  question: string;
  context: string;
}[] = [
  {
    intent: 'localGovernment',
    label: 'Local Government Questions',
    question: 'Who are the key officials and administrative departments in my Local Government Area?',
    context: 'Ask about council structures, statutory responsibilities, and local leadership.',
  },
  {
    intent: 'budget',
    label: 'Budget Information',
    question: 'How can I understand local government budget allocations and public projects in Osun State?',
    context: 'Explore available public budget summaries, allocations, and project priorities.',
  },
  {
    intent: 'communityInfo',
    label: 'Community Information',
    question: 'What civic developments or public initiatives are happening in my community?',
    context: 'Discover public-interest updates and civic engagement opportunities.',
  },
  {
    intent: 'reportIssue',
    label: 'Reporting a Community Issue',
    question: 'How do I share a community issue or infrastructure update for review in Osun State?',
    context: 'Get guided steps to document and submit an update for moderated publication.',
  },
  {
    intent: 'general',
    label: 'General Enquiries',
    question: 'Hello Amoye AI, what kind of local governance information can you help me find?',
    context: 'Start with a broad overview of what Amoye AI supports under #OsunOpenLG.',
  },
];

interface FaqItem {
  id: string;
  topic: 'AI Accuracy' | 'Data Privacy' | 'Feedback & Corrections';
  question: string;
  answer: string;
  linkLabel?: string;
  linkTo?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-accuracy-1',
    topic: 'AI Accuracy',
    question: 'How accurate are Amoye AI’s answers about local government?',
    answer:
      'Amoye AI responds using available public governance records, Nigerian constitutional local government provisions, and curated #OsunOpenLG materials. While we aim for clear and reliable guidance, AI can occasionally make mistakes or reflect older records—so responses should not replace official council gazettes or formal legal notices.',
  },
  {
    id: 'faq-accuracy-2',
    topic: 'AI Accuracy',
    question: 'Can I check the sources behind Amoye AI’s information?',
    answer:
      'Yes. Where supporting public documents or record references are available, Amoye AI includes source notes in its replies so citizens can verify context independently.',
  },
  {
    id: 'faq-privacy-1',
    topic: 'Data Privacy',
    question: 'Is my email address or phone number published when I share a community update?',
    answer:
      'No. Your contact details are stored in a restricted moderation collection accessible only to authorised Amoye AI administrators for verification follow-up. They are never displayed publicly, and you can also choose to publish your update as "Anonymous Citizen".',
    linkLabel: 'Read our Privacy Policy',
    linkTo: '/privacy',
  },
  {
    id: 'faq-privacy-2',
    topic: 'Data Privacy',
    question: 'How are uploaded community photos and WhatsApp messages handled?',
    answer:
      'Community update submissions are reviewed by moderators before appearing publicly, and attached photos are automatically resized and stripped of embedded EXIF metadata prior to storage. Conversations on WhatsApp also operate under WhatsApp’s platform privacy terms.',
  },
  {
    id: 'faq-feedback-1',
    topic: 'Feedback & Corrections',
    question: 'How do I report inaccurate information or request a correction?',
    answer:
      'If you spot an error in an Amoye AI answer or a published community update, open the Contact page and select "Information corrections" (or click "Report an inaccuracy" inside any community update). Include brief supporting details so our team can review and update the record.',
    linkLabel: 'Submit an information correction',
    linkTo: '/contact?type=Information+corrections',
  },
  {
    id: 'faq-feedback-2',
    topic: 'Feedback & Corrections',
    question: 'Where can I send technical issues, partnership requests, or general feedback?',
    answer:
      'Use our Contact page to reach the Insight Initiative team for technical support, media enquiries, partnerships, or general feedback about the platform.',
    linkLabel: 'Go to Contact page',
    linkTo: '/contact',
  },
];

export function HowItWorksPage() {
  usePageMeta({
    title: 'How Amoye AI Works – WhatsApp Civic Assistant Guide & FAQ',
    description:
      'See step by step how to chat with Amoye AI on WhatsApp, try sample governance questions, and read FAQs on AI accuracy, data privacy, and reporting feedback.',
  });

  const [openFaqId, setOpenFaqId] = useState<string>('faq-accuracy-1');

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? '' : id));
  };

  return (
    <div className="bg-[#F5F2F8]">
      {/* Header */}
      <section className="bg-[#291044] text-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F5A623]">
              WhatsApp Experience · Step by Step
            </p>
            <h1
              className="mt-3 font-extrabold tracking-tight leading-tight text-white text-balance"
              style={{ fontSize: 'clamp(2rem, 3.8vw, 3.25rem)' }}
            >
              How Amoye AI works on WhatsApp
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#E2D8EE]">
              Amoye AI operates directly inside WhatsApp so citizens across Osun State can ask local governance questions without installing extra software.
            </p>
            <div className="mt-7">
              <a
                href={WHATSAPP_CONFIG.getUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 text-sm sm:text-base font-bold text-[#291044] bg-[#F5A623] hover:bg-[#E09416] rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>Open WhatsApp Chat ({WHATSAPP_CONFIG.displayNumber})</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step + Illustrative Conversation */}
      <section className="py-16 lg:py-20 bg-white border-b border-[#291044]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6 space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
                  The Citizen Flow
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#291044]">
                  From a simple WhatsApp message to civic clarity
                </h2>
              </div>

              <div className="space-y-6">
                <div className="pb-6 border-b border-[#291044]/10">
                  <span className="text-xs font-mono font-semibold text-[#702A91]">01. Start on WhatsApp</span>
                  <h3 className="mt-1.5 text-lg font-bold text-[#291044]">
                    Message {WHATSAPP_CONFIG.displayNumber}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#4B3D5C]">
                    Tap any &ldquo;Chat with Amoye&rdquo; button on this website or save our official WhatsApp number to start a conversation in seconds.
                  </p>
                </div>

                <div className="pb-6 border-b border-[#291044]/10">
                  <span className="text-xs font-mono font-semibold text-[#702A91]">02. Ask in plain language</span>
                  <h3 className="mt-1.5 text-lg font-bold text-[#291044]">
                    Ask about governance, budgets, or your community
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#4B3D5C]">
                    Ask specific questions about local government roles, public allocations, or civic processes in Osun State. Amoye responds in clear, concise language and shares supporting source references where available.
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono font-semibold text-[#702A91]">03. Share &amp; verify</span>
                  <h3 className="mt-1.5 text-lg font-bold text-[#291044]">
                    Contribute community updates through moderation
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#4B3D5C]">
                    When you have news or a local development to share publicly, submit it on the Community page where moderators review entries before publication.
                  </p>
                </div>
              </div>
            </div>

            {/* Static Illustrative WhatsApp Preview (Explicitly NOT a live chatbot) */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#291044]/15 bg-[#EFEAE2] overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-[#291044] text-white flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`${import.meta.env.BASE_URL}assets/aistudio/image_05ce9a2b.png`}
                      alt="Amoye AI WhatsApp profile"
                      className="w-9 h-9 rounded-full object-cover border border-white/25"
                    />
                    <div>
                      <p className="text-sm font-bold leading-tight">Amoye AI</p>
                      <p className="text-xs text-[#D8CBE8] tabular-nums">{WHATSAPP_CONFIG.displayNumber}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#A8BCEB]">
                    Illustrative Example
                  </span>
                </div>

                <div className="p-5 space-y-4 text-sm">
                  <div className="ml-auto max-w-[85%] bg-[#D9FDD3] text-[#111B21] px-4 py-3 rounded-xl rounded-tr-none shadow-2xs">
                    <p>
                      Hello Amoye, what responsibilities belong to a Local Government Council in Osun State regarding primary healthcare?
                    </p>
                    <p className="mt-1 text-[11px] text-[#54656F] text-right tabular-nums">10:14 AM</p>
                  </div>

                  <div className="mr-auto max-w-[90%] bg-white text-[#111B21] px-4 py-3 rounded-xl rounded-tl-none shadow-2xs space-y-2">
                    <p className="leading-relaxed">
                      Under Nigeria&rsquo;s Fourth Schedule constitutional framework and Osun State local governance guidelines, Local Government Councils participate in maintaining primary health centres, community sanitation, and local maternal/child health outreach alongside state health agencies.
                    </p>
                    <p className="text-xs text-[#4B3D5C] pt-1 border-t border-black/8">
                      <strong>Source Note:</strong> 1999 Constitution (Fourth Schedule) &amp; Osun State Local Government public records. Always verify specific facility schedules with your LGA health department.
                    </p>
                    <p className="text-[11px] text-[#54656F] text-right tabular-nums">10:14 AM</p>
                  </div>

                  <div className="ml-auto max-w-[85%] bg-[#D9FDD3] text-[#111B21] px-4 py-3 rounded-xl rounded-tr-none shadow-2xs">
                    <p>Where can I report a broken borehole in my ward so others in the community know?</p>
                    <p className="mt-1 text-[11px] text-[#54656F] text-right tabular-nums">10:15 AM</p>
                  </div>

                  <div className="mr-auto max-w-[90%] bg-white text-[#111B21] px-4 py-3 rounded-xl rounded-tl-none shadow-2xs">
                    <p className="leading-relaxed">
                      You can submit a Community Update under the <strong>Infrastructure</strong> category on the Amoye Community page. Our moderation team reviews every submission before publishing it publicly.
                    </p>
                    <p className="mt-1 text-[11px] text-[#54656F] text-right tabular-nums">10:15 AM</p>
                  </div>
                </div>

                <div className="px-5 py-3 bg-white/90 border-t border-[#291044]/10 flex items-center justify-between gap-4 text-xs text-[#4B3D5C]">
                  <span>Sample dialogue shown for illustration</span>
                  <a
                    href={WHATSAPP_CONFIG.getUrl('general')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#702A91] hover:text-[#291044] inline-flex items-center gap-1"
                  >
                    <span>Try on WhatsApp</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Questions Citizens Can Ask */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
              Sample Questions
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#291044]">
              Tap any topic to open WhatsApp with a prefilled prompt
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {SAMPLE_PROMPTS.map((item) => (
              <a
                key={item.intent}
                href={WHATSAPP_CONFIG.getUrl(item.intent)}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#291044]/12 hover:border-[#702A91] rounded-xl p-6 transition-colors flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#702A91]">
                      {item.label}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 text-[#6B5A7E] group-hover:text-[#702A91] transition-colors shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-2.5 text-base font-bold text-[#291044] leading-snug">
                    &ldquo;{item.question}&rdquo;
                  </p>
                  <p className="mt-2 text-sm text-[#57486B]">{item.context}</p>
                </div>
                <span className="text-xs font-semibold text-[#702A91] group-hover:underline">
                  Ask this on WhatsApp
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency, Sources & Limitations */}
      <section className="bg-white border-y border-[#291044]/10 py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-7 rounded-xl bg-[#F5F2F8] border border-[#291044]/10">
              <div className="flex items-center gap-2.5 text-[#291044]">
                <BookOpen className="w-5 h-5 text-[#702A91]" aria-hidden="true" />
                <h2 className="text-lg font-bold">Grounded in available sources</h2>
              </div>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4B3D5C]">
                Amoye AI generates responses based on available public-sector records, local governance documentation, and curated civic datasets. Whenever supporting source documents or references are available, citizens can access or request them directly.
              </p>
            </div>

            <div className="p-7 rounded-xl bg-[#F5F2F8] border border-[#291044]/10">
              <div className="flex items-center gap-2.5 text-[#291044]">
                <AlertCircle className="w-5 h-5 text-[#702A91]" aria-hidden="true" />
                <h2 className="text-lg font-bold">Responsible AI &amp; accuracy notice</h2>
              </div>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4B3D5C]">
                AI systems can occasionally make mistakes or reflect outdated records. Amoye AI does not guarantee 100% accuracy and should not replace official legal or council gazettes. Notice something outdated or inaccurate?{' '}
                <Link
                  to="/contact?type=Information+corrections"
                  className="font-semibold text-[#702A91] underline underline-offset-4 hover:text-[#291044]"
                >
                  Submit an information correction
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 lg:py-20 bg-[#F5F2F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">
                Frequently Asked Questions
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#291044] text-balance">
                Accuracy, privacy, and how to share feedback
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#4B3D5C]">
                Clear answers on how Amoye AI handles public governance answers, protects citizen privacy, and processes corrections.
              </p>
            </div>

            <div className="lg:col-span-8 divide-y divide-[#291044]/12 bg-white border border-[#291044]/12 rounded-2xl overflow-hidden">
              {FAQ_ITEMS.map((item) => {
                const isOpen = openFaqId === item.id;
                const panelId = `${item.id}-panel`;
                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(item.id)}
                      className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-[#F5F2F8]/60 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#702A91]"
                    >
                      <div>
                        <span className="block text-xs font-medium text-[#702A91]">
                          {item.topic}
                        </span>
                        <span className="mt-1 block text-base font-bold text-[#291044]">
                          {item.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[#6B5A7E] shrink-0 mt-1 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-[#702A91]' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={panelId}
                        className="px-6 pb-6 pt-1 text-sm sm:text-base leading-relaxed text-[#4B3D5C] space-y-3"
                      >
                        <p>{item.answer}</p>
                        {item.linkTo && item.linkLabel && (
                          <Link
                            to={item.linkTo}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#702A91] hover:text-[#291044] underline underline-offset-4"
                          >
                            <span>{item.linkLabel}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
