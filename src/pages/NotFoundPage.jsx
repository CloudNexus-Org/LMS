import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-6 text-center">
      <div className="mb-6 text-primary">
        <Ghost size={64} className="animate-float" />
      </div>
      <h1 className="mb-2 font-display text-5xl font-bold text-text">404</h1>
      <h2 className="mb-4 font-display text-2xl font-semibold text-text">Page not found</h2>
      <p className="mb-8 max-w-md text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
        <Button as={Link} to="/" variant="primary">
          Return Home
        </Button>
      </div>
    </div>
  );
}
