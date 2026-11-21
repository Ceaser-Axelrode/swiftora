'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: {
    componentStack?: string;
  };
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false });

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Caught by error boundary:', error);
      setErrorState({
        hasError: true,
        error: error.error,
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleReset = () => {
    setErrorState({ hasError: false });
    window.location.reload();
  };

  if (errorState.hasError) {
    if (fallback) return <>{fallback}</>;
    return (
      <FallbackErrorComponent
        error={errorState.error}
        onReset={handleReset}
      />
    );
  }

  return <>{children}</>;
}

function FallbackErrorComponent({
  error,
  onReset,
}: {
  error?: Error;
  onReset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.08),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 flex items-center justify-center"
          >
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-muted rounded-lg text-left">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-muted text-foreground px-6 py-3 rounded-xl font-semibold hover:bg-muted/80 transition"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          If this problem persists, please{' '}
          <a
            href="mailto:support@beluxtransit.com"
            className="text-primary hover:underline"
          >
            contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
}

// Simple error fallback for smaller components
export function ComponentErrorFallback({
  title = 'Error loading component',
  message = 'Something went wrong',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-6 bg-destructive/5 border border-destructive/20 rounded-xl">
      <div className="flex items-center gap-3 mb-3">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
