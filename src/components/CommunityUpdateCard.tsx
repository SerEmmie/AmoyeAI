import { ArrowRight, ImageOff } from 'lucide-react';
import { useState } from 'react';
import type { CommunityUpdate } from '../types/civic';

export function formatUpdateDate(ts: CommunityUpdate['published_at'] | CommunityUpdate['created_at']): string {
  if (!ts || typeof ts.toDate !== 'function') return 'Recently published';
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(ts.toDate());
}

interface CommunityUpdateCardProps {
  update: CommunityUpdate;
  onSelect: (update: CommunityUpdate) => void;
}

export function CommunityUpdateCard({ update, onSelect }: CommunityUpdateCardProps) {
  const [imgError, setImgError] = useState(false);
  const displayDate = formatUpdateDate(update.published_at ?? update.created_at);

  return (
    <article className="bg-white border border-[#291044]/12 rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-150 hover:border-[#702A91]/40">
      <div>
        {update.image_url && !imgError && (
          <div className="aspect-video w-full bg-[#EFEAF4] overflow-hidden border-b border-[#291044]/10">
            <img
              src={update.image_url}
              alt={update.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {update.image_url && imgError && (
          <div className="aspect-video w-full bg-[#EFEAF4] flex flex-col items-center justify-center text-[#6B5A7E] border-b border-[#291044]/10 p-4">
            <ImageOff className="w-6 h-6 mb-1.5 opacity-60" aria-hidden="true" />
            <span className="text-xs">Attached community photo unavailable</span>
          </div>
        )}

        <div className="p-6">
          {/* Zero-pill metadata line */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#6B5A7E] tabular-nums">
            <span className="text-[#702A91] font-semibold">{update.category}</span>
            <span aria-hidden="true">·</span>
            <span>{update.location}</span>
            <span aria-hidden="true">·</span>
            <time>{displayDate}</time>
          </div>

          <h3 className="mt-2.5 text-lg font-bold text-[#291044] leading-snug text-balance">
            {update.title}
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-[#4B3D5C] line-clamp-3">
            {update.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-5 pt-3 border-t border-[#291044]/8 flex items-center justify-between gap-4">
        <span className="text-xs text-[#6B5A7E] truncate">
          By {update.contributor_name || 'Anonymous Citizen'}
        </span>
        <button
          type="button"
          onClick={() => onSelect(update)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#702A91] hover:text-[#291044] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#702A91]"
        >
          <span>Read update</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
