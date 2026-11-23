'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/ThemeContext';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaSun,
  FaMoon,
  FaPaperPlane,
  FaCheckCircle,
} from 'react-icons/fa';

const socials = [
  {
    icon: FaWhatsapp,
    url: 'https://wa.me/message/6XY7JOM57HOHE1',
    label: 'WhatsApp',
  },
  {
    icon: FaInstagram,
    url: 'https://instagram.com/yourusername',
    label: 'Instagram',
  },
  {
    icon: FaFacebookF,
    url: 'https://facebook.com/yourusername',
    label: 'Facebook',
  },
  {
    icon: FaTwitter,
    url: 'https://twitter.com/yourusername',
    label: 'Twitter',
  },
];

export default function Footer() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setSubscribeStatus('loading');
    setSubscribeMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'footer' }),
      });
      const body = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          body?.error || 'Subscription failed. Please try again.',
        );
      }

      setSubscribeStatus('success');
      setSubscribeMessage(
        'You are subscribed. Watch your inbox for a welcome email.',
      );
      setEmail('');
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
      );
    }
  }

  return (
    <footer
      className="relative overflow-hidden border-t border-border bg-cover bg-center transition-colors duration-300"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1590497008432-598f04441de8?w=1920&q=80)',
      }}
    >
      {/* Stronger overlay keeps the footer readable over the photo. */}
      <div className="absolute inset-0 z-0 bg-black/75" />

      <div className="relative z-10">
        <div className="mx-auto grid max-w-6xl gap-8 p-6 text-sm text-gray-100 md:grid-cols-3 md:p-10">
          <div>
            <h3 className="mb-3 font-semibold text-orange-400">
              Swiftora Solutions
            </h3>
            <p className="leading-relaxed">
              Fast. Reliable. Global.
              <br />
              Your trusted partner for international shipping, real time
              tracking, and end to end logistics.
              <br />A Sublet of Swiftora Distribution Network (SDN).
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-orange-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/track"
                  className="transition-colors hover:text-orange-300"
                >
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="transition-colors hover:text-orange-300"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="transition-colors hover:text-orange-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-orange-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-orange-400">Contact</h3>
            <p>
              Email:{' '}
              <a
                href="mailto:support@beluxtransit.com"
                className="text-orange-300 hover:underline"
              >
                support@swiftorasolutions.com
              </a>
            </p>
            <p className="mt-2">1017HL Amsterdam, The Netherlands</p>
            <p className="mt-2">Comp No. (1023479-M)</p>
            <p className="mt-2">
              Sublet of Swiftora Distribution Network (SDN)
            </p>
            <p className="mt-2">
              Office Hours: Mon – Sat, 9:00 AM – 5:00 PM (UTC)
            </p>
            <div className="mt-4 flex gap-4">
              {socials.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="cursor-pointer text-xl transition-colors hover:text-orange-400"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/30">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-10">
            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-orange-400">
                Stay in the loop
              </h3>
              <p className="mt-1 text-sm text-gray-200">
                Shipping tips, service updates, and logistics news from
                Swiftora. No spam.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="w-full max-w-md"
              aria-label="Newsletter signup"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeStatus === 'loading'}
                  placeholder="you@example.com"
                  className="w-full flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-100 placeholder:text-gray-400 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {subscribeStatus === 'loading' ? (
                    'Subscribing...'
                  ) : (
                    <>
                      <FaPaperPlane className="h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </button>
              </div>

              {subscribeMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-2 flex items-center gap-2 text-sm ${
                    subscribeStatus === 'success'
                      ? 'text-green-400'
                      : 'text-red-300'
                  }`}
                >
                  {subscribeStatus === 'success' && (
                    <FaCheckCircle className="h-4 w-4" />
                  )}
                  {subscribeMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/40 py-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <p className="text-gray-200">
              © {new Date().getFullYear()} Swiftora Solutions. All rights
              reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-gray-100 transition-all duration-300 hover:border-orange-400"
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
              >
                {theme === 'dark' ? (
                  <>
                    <FaSun className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">Light</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="h-4 w-4 text-orange-300" />
                    <span className="text-sm">Dark</span>
                  </>
                )}
              </button>

              <div className="space-x-4 text-sm text-gray-200">
                <Link href="/privacy-policy" className="hover:underline">
                  Privacy
                </Link>
                <Link href="/terms-of-service" className="hover:underline">
                  Terms
                </Link>
                <Link href="/cookie-policy" className="hover:underline">
                  Cookies
                </Link>
                <Link href="/disclaimer" className="hover:underline">
                  Disclaimer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
