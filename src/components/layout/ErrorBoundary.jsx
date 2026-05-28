import { Component } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-6 text-center">
          <div className="mb-6 rounded-full bg-danger/10 p-4 text-danger">
            <AlertCircle size={48} />
          </div>
          <h1 className="mb-2 font-display text-3xl font-bold text-text">
            Something went wrong
          </h1>
          <p className="mb-8 max-w-md text-muted">
            We've encountered an unexpected error. Our engineering team has been notified.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()} variant="primary">
              Refresh Page
            </Button>
            <Button as="a" href="/" variant="outline">
              Return Home
            </Button>
          </div>
          {import.meta.env.DEV && (
            <pre className="mt-12 max-w-2xl overflow-auto rounded-lg bg-surface p-4 text-left text-sm text-subtle shadow-card">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
