'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
} from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [linkValid, setLinkValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function prepareSession() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            if (!cancelled) setLinkValid(false);
            return;
          }
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!cancelled) {
          setLinkValid(Boolean(data.session) && !sessionError);
        }
      } catch {
        if (!cancelled) setLinkValid(false);
      } finally {
        if (!cancelled) setCheckingLink(false);
      }
    }

    prepareSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setDone(true);
    } catch {
      setError('Unable to update your password. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-24 sm:px-6 md:py-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            Choose a New Password
          </h1>
          <p className="text-muted-foreground">
            Enter a new password for your admin account.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl md:p-8">
          {checkingLink ? (
            <div className="flex items-center justify-center gap-3 py-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Verifying your reset link...
            </div>
          ) : done ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Password updated
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Your password has been changed. You can now sign in with your
                new password.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          ) : !linkValid ? (
            <div className="text-center">
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                Reset link expired
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                This password reset link is invalid or has expired. Request a
                new one to continue.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="new-password"
                  className="text-sm font-medium text-foreground"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-10 pr-11 text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    className="w-full rounded-xl border border-border bg-muted/50 py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}
