import { Flag, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CommunityUpdate } from '../types/civic';
import { formatUpdateDate } from './CommunityUpdateCard';

interface UpdateDetailModalProps {
  update: CommunityUpdate | null;
  onClose: () => void;
}

export function UpdateDetailModal({ update, onClose }: UpdateDetailModalProps) {
  useEffect(() => {
    if (!update) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [update, onClose]);

  if (!update) return null;

  const displayDate = formatUpdateDate(update.published_at ?? update.created_at);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#291044]/65 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#291044]/15 shadow-2xl my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#291044]/10 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#6B5A7E] tabular-nums">
            <span className="text-[#702A91] font-semibold">{update.category}</span>
            <span aria-hidden="true">·</span>
            <span>{update.location}</span>
            <span aria-hidden="true">·</span>
            <time>{displayDate}</time>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close update details"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#4B3D5C] hover:bg-[#291044]/8 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto">
          {update.image_url && (
            <div className="w-full max-h-80 bg-[#EFEAF4] overflow-hidden border-b border-[#291044]/10">
              <img
                src={update.image_url}
                alt={update.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <h2 id="update-detail-title" className="text-2xl font-bold text-[#291044] leading-snug text-balance">
              {update.title}
            </h2>
            <p className="mt-2 text-xs text-[#6B5A7E]">
              Contributed by <span className="font-semibold text-[#291044]">{update.contributor_name}</span> · Reviewed &amp; Approved
            </p>

            <div className="mt-6 text-base leading-relaxed text-[#2E223D] whitespace-pre-line">
              {update.description}
            </div>

            <div className="mt-8 pt-5 border-t border-[#291044]/10 flex flex-wrap items-center justify-between gap-4">
              <Link
                to={`/contact?type=${encodeURIComponent('Information corrections')}&subject=${encodeURIComponent(`Correction request: ${update.title.slice(0, 80)}`)}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B5A7E] hover:text-[#702A91] transition-colors"
              >
                <Flag className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Report an inaccuracy or request correction</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#291044] hover:bg-[#3B1861] rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
