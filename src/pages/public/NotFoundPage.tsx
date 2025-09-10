import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Illustration/Image */}
        <div className="mb-8">
          <div className="mx-auto h-48 w-48 flex items-center justify-center rounded-full bg-muted/50">
            <svg
              className="h-32 w-32 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-foreground">Page not found</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-5 py-3 border border-border text-base font-medium rounded-md text-foreground bg-background hover:bg-accent transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Additional help */}
        <div className="mt-12">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link to="/contact" className="text-primary hover:text-primary/80 font-medium">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};