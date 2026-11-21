'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie_consent_v2';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // The banner is only shown when the user has not made a choice yet.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-4 shadow-lg backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          We use cookies to improve your experience, analyze traffic, and ensure
          proper functionality. By clicking &quot;Accept&quot;, you consent to
          our use of cookies.
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            onClick={rejectCookies}
            className="rounded border border-border px-4 py-2 text-sm text-foreground transition hover:bg-muted"
          >
            Reject
          </button>

          <button
            onClick={acceptCookies}
            className="rounded bg-[#f9b87e] px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
