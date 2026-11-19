import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPage } from './pages/PrivacyPage';

function NotFoundPage() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-20 bg-[#F5F2F8]">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#702A91]">404</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#291044]">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#4B3D5C]">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5A1F76] rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

const APP_TOP_LEVEL_ROUTES = new Set([
  'about',
  'how-it-works',
  'community',
  'contact',
  'privacy',
  'admin',
]);

function getRouterBasename(): string {
  const baseUrl = import.meta.env.BASE_URL;
  if (baseUrl && baseUrl.startsWith('/') && baseUrl !== '/') {
    return baseUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.github.io')) {
    const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
    if (firstSegment && !APP_TOP_LEVEL_ROUTES.has(firstSegment)) {
      return `/${firstSegment}`;
    }
  }
  return '/';
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter basename={getRouterBasename()}>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
