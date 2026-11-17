import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F5F2F8] text-[#1D122B] flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full bg-white border border-[#291044]/15 rounded-xl p-8">
            <p className="text-xs font-medium uppercase tracking-widest text-[#702A91]">
              Application Notice
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[#291044]">
              Something interrupted this page
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#4B3D5C]">
              We encountered an unexpected error while loading this view. You can reload the page or return to the homepage.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#702A91] hover:bg-[#5B2078] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#702A91]"
              >
                Reload Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, errorMessage: '' })}
                className="px-5 py-2.5 text-sm font-semibold text-[#291044] border border-[#291044]/20 hover:bg-[#F5F2F8] rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
