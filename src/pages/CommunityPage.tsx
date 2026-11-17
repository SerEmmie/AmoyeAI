import { AlertTriangle, Megaphone, Plus, Search, ShieldCheck, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CommunitySubmissionModal } from '../components/CommunitySubmissionModal';
import { CommunityUpdateCard } from '../components/CommunityUpdateCard';
import { UpdateDetailModal } from '../components/UpdateDetailModal';
import { WHATSAPP_CONFIG } from '../config/whatsapp';
import { usePageMeta } from '../hooks/usePageMeta';
import { subscribeApprovedUpdates } from '../lib/communityService';
import { COMMUNITY_CATEGORIES, type CommunityCategory, type CommunityUpdate } from '../types/civic';

type FilterCategory = 'All' | CommunityCategory;

export function CommunityPage() {
  usePageMeta({
    title: 'Community Updates – Amoye AI (#OsunOpenLG)',
    description:
      'Discover approved community updates, civic announcements, and public-interest reports across Osun State, or submit an update for moderation.',
  });

  const [updates, setUpdates] = useState<CommunityUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeUpdate, setActiveUpdate] = useState<CommunityUpdate | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeApprovedUpdates(
      (data) => {
        setUpdates(data);
        setLoading(false);
        setLoadError(null);
      },
      () => {
        setLoading(false);
        setLoadError('Unable to load community updates right now. Please refresh to try again.');
      }
    );
    return () => unsubscribe();
  }, []);

  const filteredUpdates = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return updates.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [updates, selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F5F2F8] min-h-[80vh]">
      {/* Community Header */}
      <section className="bg-[#291044] text-white py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F5A623]">
                Osun State Citizen Hub · Moderated Updates
              </p>
              <h1
                className="mt-3 font-extrabold tracking-tight leading-tight text-white text-balance"
                style={{ fontSize: 'clamp(2rem, 3.8vw, 3.25rem)' }}
              >
                WHAT&rsquo;S HAPPENING IN YOUR COMMUNITY?
              </h1>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#E2D8EE]">
                Stay informed about developments, activities and issues that matter to communities across Osun State. Explore latest updates, community announcements, civic information, development activities, and public-interest reports.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-[#291044] bg-[#F5A623] hover:bg-[#E09416] rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5A623]"
              >
                <Plus className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>SHARE A COMMUNITY UPDATE</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-white border-b border-[#291044]/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:max-w-sm">
              <Search
                className="w-4 h-4 text-[#6B5A7E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search community updates by keyword or local government area"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, keyword, or LGA..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F5F2F8]/60 border border-[#291044]/15 rounded-lg focus:outline-none focus:bg-white focus:border-[#702A91]"
              />
            </div>

            <p className="text-xs text-[#6B5A7E] tabular-nums">
              Showing <strong className="text-[#291044]">{filteredUpdates.length}</strong> approved{' '}
              {filteredUpdates.length === 1 ? 'update' : 'updates'}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter updates by category"
            className="flex items-center gap-1.5 overflow-x-auto pb-1"
          >
            {(['All', ...COMMUNITY_CATEGORIES] as const).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#702A91] ${
                    active
                      ? 'bg-[#291044] text-white'
                      : 'bg-[#F5F2F8] text-[#4B3D5C] hover:bg-[#EAE3F2] hover:text-[#291044]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Community Feed */}
      <section className="py-12 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadError && (
            <div
              role="alert"
              className="mb-8 p-4 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30 flex items-center gap-3 text-sm text-[#991B1B]"
            >
              <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{loadError}</span>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="h-64 bg-white border border-[#291044]/10 rounded-xl p-6 animate-pulse"
                />
              ))}
            </div>
          ) : filteredUpdates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpdates.map((update) => (
                <CommunityUpdateCard
                  key={update.id}
                  update={update}
                  onSelect={setActiveUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#291044]/12 rounded-2xl p-10 text-center max-w-2xl mx-auto">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#F5F2F8] text-[#702A91] flex items-center justify-center">
                <Megaphone className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-[#291044]">
                {updates.length === 0
                  ? 'No approved updates published yet'
                  : 'No updates match your current filter'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4B3D5C]">
                {updates.length === 0
                  ? 'Citizens across Osun State can submit local announcements, infrastructure reports, or civic activities. Every submission is reviewed before publication.'
                  : 'Try clearing your search keyword or switching to All categories.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {updates.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2.5 text-sm font-semibold text-[#291044] border border-[#291044]/20 hover:bg-[#F5F2F8] rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] rounded-lg transition-colors"
                >
                  Share a Community Update
                </button>
              </div>
            </div>
          )}

          {/* Community Guidelines & Corrections Strip */}
          <div className="mt-14 pt-10 border-t border-[#291044]/12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#291044]/12 rounded-xl p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#291044]">
                <ShieldCheck className="w-4 h-4 text-[#702A91]" aria-hidden="true" />
                <span>Community Guidelines &amp; Moderation</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#4B3D5C]">
                All submissions undergo moderation review before appearing publicly. We prioritise factual, respectful, public-interest updates relevant to Osun State communities. Personal contact details are kept private and never published.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <Link
                  to="/contact?type=Information+corrections"
                  className="text-[#702A91] hover:text-[#291044] underline underline-offset-4"
                >
                  Request a correction or report an issue
                </Link>
                <Link
                  to="/privacy"
                  className="text-[#6B5A7E] hover:text-[#291044] underline underline-offset-4"
                >
                  Read Privacy Policy
                </Link>
              </div>
            </div>

            <div className="bg-white border border-[#291044]/12 rounded-xl p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-[#291044]">
                <Users className="w-4 h-4 text-[#702A91]" aria-hidden="true" />
                <span>Ask Governance Questions on WhatsApp</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#4B3D5C]">
                Need quick clarity on local government administration, council responsibilities, or public budgets? Connect directly with Amoye AI on WhatsApp.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a
                  href={WHATSAPP_CONFIG.getUrl('communityInfo')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#702A91] hover:text-[#291044] underline underline-offset-4"
                >
                  Chat with Amoye AI ({WHATSAPP_CONFIG.displayNumber})
                </a>
                {WHATSAPP_CONFIG.communityGroupInviteUrl && (
                  <a
                    href={WHATSAPP_CONFIG.communityGroupInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#291044] underline underline-offset-4"
                  >
                    Join WhatsApp Community Group
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CommunitySubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      <UpdateDetailModal
        update={activeUpdate}
        onClose={() => setActiveUpdate(null)}
      />
    </div>
  );
}
