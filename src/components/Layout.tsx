import { ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { WHATSAPP_CONFIG } from '../config/whatsapp';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/community', label: 'Community' },
  { to: '/contact', label: 'Contact' },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2F8] text-[#1D122B]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#291044] focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-sm border-b border-[#291044]/10">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element brand wordmark */}
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-[#291044] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702A91]"
          >
            Amoye AI
          </Link>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4B3D5C]"
          >
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#702A91] ${
                    isActive
                      ? 'border-[#702A91] text-[#291044] font-semibold'
                      : 'border-transparent hover:text-[#291044] hover:border-[#D66AB9]/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Single primary action + Mobile drawer button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={WHATSAPP_CONFIG.getUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#702A91]"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Chat with Amoye</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#291044]/15 text-[#291044] hover:bg-[#F5F2F8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#702A91]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden bg-white border-b border-[#291044]/15 px-4 py-5 shadow-lg"
          >
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-[#F5F2F8] text-[#702A91] font-semibold'
                        : 'text-[#291044] hover:bg-[#F5F2F8]/60'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="pt-3 mt-2 border-t border-[#291044]/10">
                <a
                  href={WHATSAPP_CONFIG.getUrl('general')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Chat with Amoye on WhatsApp</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Editorial Footer */}
      <footer className="bg-[#291044] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/15">
            <div className="md:col-span-5">
              <Link
                to="/"
                className="text-xl font-extrabold tracking-tight text-white inline-block"
              >
                Amoye AI
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-[#E2D8EE] max-w-md">
                A civic technology initiative bridging the information gap between local government councils and citizens across Osun State through WhatsApp and moderated community updates.
              </p>
              <p className="mt-4 text-xs font-medium tracking-wider uppercase text-[#F5A623]">
                #OsunOpenLG · Your Community. Your Government. Your Voice.
              </p>
            </div>

            <div className="md:col-span-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#A8BCEB]">
                Platform
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-[#E2D8EE]">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Amoye
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="hover:text-white transition-colors">
                    Community Updates
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact &amp; Corrections
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#A8BCEB]">
                WhatsApp Civic Channel
              </h2>
              <p className="mt-4 text-sm text-[#E2D8EE] leading-relaxed">
                Ask questions about local government administration, budgets, and civic affairs directly on WhatsApp.
              </p>
              <div className="mt-4 flex flex-col items-start gap-2">
                <a
                  href={WHATSAPP_CONFIG.getUrl('general')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#291044] bg-[#F5A623] hover:bg-[#E09416] rounded-lg transition-colors"
                >
                  <span>Message {WHATSAPP_CONFIG.displayNumber}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
                {WHATSAPP_CONFIG.communityGroupInviteUrl && (
                  <a
                    href={WHATSAPP_CONFIG.communityGroupInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#A8BCEB] hover:text-white underline underline-offset-4"
                  >
                    Join the WhatsApp Community Group
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#C7B8DB]">
            <p>
              Developed by <span className="text-white font-medium">Insight Initiative</span> · Supported by{' '}
              <span className="text-white font-medium">Nigerian Youth Futures Fund (NYFF)</span> through{' '}
              <span className="text-white font-medium">LEAP Africa</span>.
            </p>
            <div className="flex items-center gap-5 shrink-0">
              <span>© {new Date().getFullYear()} Amoye AI</span>
              <Link
                to="/admin"
                className="text-[#C7B8DB] hover:text-white underline underline-offset-4 transition-colors"
              >
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
